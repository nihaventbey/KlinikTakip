-- supabase/migrations/YYYYMMDDHHMMSS_add_api_keys_to_clinic_settings.sql

-- 1. Mevcut 'clinic_settings' tablosuna yeni sütunlar ekleniyor.
-- Bu sütunlar, API anahtarlarının kendisini değil, Supabase Vault'ta saklanacak
-- olan şifreli verinin referans ID'sini (UUID) tutacaktır. Bu yöntem,
-- API anahtarlarının güvenliğini en üst düzeye çıkarır.

ALTER TABLE public.clinic_settings
  ADD COLUMN sms_api_key_id UUID,
  ADD COLUMN whatsapp_api_key_id UUID,
  ADD COLUMN gemini_api_key_id UUID;

COMMENT ON COLUMN public.clinic_settings.sms_api_key_id IS 'ID of the secret in vault.secrets for SMS provider API key';
COMMENT ON COLUMN public.clinic_settings.whatsapp_api_key_id IS 'ID of the secret in vault.secrets for WhatsApp provider API key';
COMMENT ON COLUMN public.clinic_settings.gemini_api_key_id IS 'ID of the secret in vault.secrets for Google Gemini API key';


-- 2. 'clinic_settings' tablosu için Satır Seviyesi Güvenliği (RLS) aktifleştiriliyor.
-- Bu, verilere erişimin sadece yetkili kullanıcılar tarafından yapılabilmesini sağlar.

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;


-- 3. Güvenlik Politikaları Oluşturuluyor.
-- Bu politikalar, her kliniğin sadece kendi ayarlarına erişebilmesini ve
-- üzerinde değişiklik yapabilmesini garanti eder.

-- Politika 1: Kliniklerin sadece kendi ayarlarını görebilmesi için.
CREATE POLICY "Clinics can view their own settings."
  ON public.clinic_settings FOR SELECT
  USING (clinic_id = (
    SELECT clinic_id
    FROM public.profiles
    WHERE id = auth.uid()
  ));

-- Politika 2: Kliniklerin sadece kendi ayarlarını güncelleyebilmesi için.
CREATE POLICY "Clinics can update their own settings."
  ON public.clinic_settings FOR UPDATE
  USING (clinic_id = (
    SELECT clinic_id
    FROM public.profiles
    WHERE id = auth.uid()
  ));

-- Not: Yeni bir klinik oluşturulduğunda ayarların otomatik eklenmesi 'handle_new_clinic'
-- isimli 'SECURITY DEFINER' trigger'ı ile yapıldığı için INSERT politikası
-- normal kullanıcılar için gerekli değildir. Bu, RLS'yi bypass ederek işlemi güvenli bir şekilde gerçekleştirir.

-- Süper Admin için ek bir politika (isteğe bağlı):
-- Süper adminlerin tüm ayarları görebilmesi ve düzenleyebilmesi için bu politikayı aktif edebilirsiniz.
/*
CREATE POLICY "Super Admins have full access."
  ON public.clinic_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid() AND 'SUPER_ADMIN' = ANY(roles)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid() AND 'SUPER_ADMIN' = ANY(roles)
    )
  );
*/

-- 4. Vault'taki secret'lara erişim için helper fonksiyonlar (Örnek)
-- API anahtarını kaydetmek ve okumak için bu tür fonksiyonlar oluşturulabilir.
-- Bu fonksiyonlar, uygulamanızın backend'inde (Edge Functions) kullanılmalıdır.
-- DOĞRUDAN CLIENT TARAFINDAN ÇAĞIRILMAMALIDIR.

/*
-- Örnek: Bir API anahtarını Vault'a kaydetme ve ID'sini döndürme (SECURITY DEFINER olmalı)
CREATE OR REPLACE FUNCTION private.create_secret(secret_value text, secret_name text)
RETURNS uuid AS $$
DECLARE
  secret_id uuid;
BEGIN
  INSERT INTO vault.secrets (secret, name) VALUES (secret_value, secret_name) RETURNING id INTO secret_id;
  RETURN secret_id;
END;
$$ LANGUAGE plpgsql;

-- Örnek: Vault'taki bir API anahtarını ID ile okuma (SECURITY DEFINER olmalı)
CREATE OR REPLACE FUNCTION private.get_secret(secret_id uuid)
RETURNS text AS $$
DECLARE
  decrypted_secret text;
BEGIN
  -- Sadece belirli rollere sahip kişilerin erişebilmesi için ek kontrol eklenmelidir.
  SELECT decrypted_secret INTO decrypted_secret FROM vault.decrypted_secrets WHERE id = secret_id;
  RETURN decrypted_secret;
END;
$$ LANGUAGE plpgsql;
*/
