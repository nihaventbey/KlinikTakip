/**
 * Kritik işlemleri kayıt altına alır (Audit Logs).
 * Yasal uyumluluk için kimin, ne zaman, hangi veriyi değiştirdiği saklanır.
 */
export const logAction = (user, action, resource, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: user?.id || 'anonymous',
    userRole: user?.role || 'unknown',
    action,   // Örn: 'DELETE', 'UPDATE', 'VIEW'
    resource, // Örn: 'PatientRecord', 'FinancialReport'
    details,  // Değişen verinin eski/yeni hali veya ID'si
  };

  // TODO: Bu veriyi güvenli bir veritabanına veya log servisine gönderin.
  // console.log geliştirme ortamı içindir.
  console.info('AUDIT_LOG:', JSON.stringify(logEntry));
  
  return logEntry;
};