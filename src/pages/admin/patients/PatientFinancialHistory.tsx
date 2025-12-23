import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { Patient } from '../../../types';

interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense' | 'opening_balance';
  amount: number;
  description: string;
  status: 'completed' | 'pending';
  created_at: string;
}

interface PatientFinancialHistoryProps {
    patient: Patient;
}

const transactionConfig = {
    income: { icon: ArrowDownCircle, color: 'text-green-500', label: 'Tahsilat' },
    expense: { icon: ArrowUpCircle, color: 'text-red-500', label: 'Borç/Gider' },
    opening_balance: { icon: AlertCircle, color: 'text-gray-500', label: 'Açılış Bakiyesi' }
}

export default function PatientFinancialHistory({ patient }: PatientFinancialHistoryProps) {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!patient) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('patient_id', patient.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Hastanın finansal geçmişi alınırken hata: ", error);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [patient]);

  return (
    <div className="space-y-6">
        {/* Bakiye Özeti */}
        <div className="p-4 bg-white rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <p className="text-sm font-medium text-gray-500">Güncel Bakiye</p>
                <p className={`text-3xl font-bold ${patient.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
                <p className="text-xs text-gray-400">
                    {patient.balance >= 0 ? 'Hastanın alacağı var.' : 'Hastanın borcu var.'}
                </p>
            </div>
        </div>

        {/* İşlem Listesi */}
        <div className="bg-white rounded-lg border overflow-hidden">
            <h3 className="p-4 font-semibold text-lg border-b">İşlem Geçmişi</h3>
            {loading ? (
                <p className="p-8 text-center text-gray-500">İşlemler yükleniyor...</p>
            ) : transactions.length === 0 ? (
                <p className="p-8 text-center text-gray-500">Kayıtlı finansal işlem bulunamadı.</p>
            ) : (
                <table className="min-w-full">
                    <tbody className="divide-y divide-gray-200">
                    {transactions.map(tx => {
                        const config = transactionConfig[tx.type];
                        const Icon = config.icon;
                        return (
                            <tr key={tx.id}>
                                <td className="p-4 w-12"><Icon className={`w-6 h-6 ${config.color}`} /></td>
                                <td className="p-4">
                                    <p className="font-medium">{tx.description}</p>
                                    <p className="text-sm text-gray-500">{config.label}</p>
                                </td>
                                <td className="p-4 text-right">
                                    <p className={`font-semibold ${config.color}`}>
                                        {tx.type === 'income' ? '-' : '+'}
                                        {tx.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString('tr-TR')}
                                    </p>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}
