/**
 * Basit Audit Logger
 * Sistemdeki kritik işlemleri konsola veya veritabanına loglar.
 */
export const logAction = (user, action, type, details = {}) => {
  const timestamp = new Date().toISOString();
  const userId = user ? (user.email || user.id || 'Unknown') : 'Anonymous';
  
  console.log(`[AUDIT] ${timestamp} | User: ${userId} | Action: ${action} | Type: ${type}`, details);
  
  // İleride buraya Supabase insert işlemi eklenebilir:
  // supabase.from('audit_logs').insert({ user_id: user.id, action, details, created_at: timestamp });
};