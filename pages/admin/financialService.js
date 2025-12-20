import { TREATMENTS } from '../data/clinicSettings';

/**
 * Doktor hakedişini hesaplar.
 * @param {Object} doctor - Doktor objesi (commissionRate içermeli)
 * @param {Array} completedTreatments - Yapılan tedavilerin ID listesi
 */
export const calculateDoctorCommission = (doctor, completedTreatments) => {
  if (!doctor.commissionRate || doctor.commissionRate <= 0) return 0;

  const totalRevenue = completedTreatments.reduce((sum, treatmentId) => {
    const treatment = TREATMENTS.find(t => t.id === treatmentId);
    return sum + (treatment ? treatment.price : 0);
  }, 0);

  return {
    totalRevenue,
    commissionAmount: totalRevenue * doctor.commissionRate,
    rate: doctor.commissionRate
  };
};

/**
 * Basit Gelir/Gider Raporu
 */
export const generateFinancialReport = (transactions) => {
  const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

  return {
    totalIncome: income,
    totalExpense: expense,
    netProfit: income - expense,
    dateGenerated: new Date().toISOString()
  };
};