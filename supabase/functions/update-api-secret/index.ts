import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Supabase admin client
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ApiSecretPayload {
  clinic_id: string;
  secret_name: 'sms' | 'whatsapp' | 'gemini';
  secret_value: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { clinic_id, secret_name, secret_value }: ApiSecretPayload = await req.json();

    // 1. Validate input
    if (!clinic_id || !secret_name || !secret_value) {
      return new Response(JSON.stringify({ error: 'Missing required fields: clinic_id, secret_name, or secret_value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validSecretNames = ['sms', 'whatsapp', 'gemini'];
    if (!validSecretNames.includes(secret_name)) {
      return new Response(JSON.stringify({ error: 'Invalid secret_name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // 2. Insert the secret into the vault and get the ID
    const { data: secretData, error: secretError } = await supabaseAdmin
      .from('secrets')
      .insert({ secret: secret_value })
      .select('id')
      .single();

    if (secretError || !secretData) {
        // In Supabase Vault, secrets are unique. If it already exists, we can't insert it again.
        // A more robust implementation would be to check if a secret with this value exists and reuse the ID,
        // or delete the old secret if it's being replaced. For simplicity, we'll throw an error.
        // A production system should handle this more gracefully.
      throw new Error(`Failed to insert secret into vault: ${secretError?.message}`);
    }
    const secret_id = secretData.id;

    // 3. Update the clinic_settings table with the new secret ID
    const column_name = `${secret_name}_api_key_id`;
    const { error: updateError } = await supabaseAdmin
      .from('clinic_settings')
      .update({ [column_name]: secret_id })
      .eq('clinic_id', clinic_id);

    if (updateError) {
      // If the update fails, we should ideally delete the secret we just created from the vault
      // to prevent orphaned secrets. This is a compensating action.
      await supabaseAdmin.from('secrets').delete().eq('id', secret_id);
      throw new Error(`Failed to update clinic_settings: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ message: `Successfully updated ${secret_name} API key.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
