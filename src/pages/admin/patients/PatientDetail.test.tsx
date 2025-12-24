import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import PatientDetail from './PatientDetail';
import { db } from '../../../lib/db';

vi.mock('../../../lib/db');

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const mockAuthProvider = {
    profile: { clinic_id: 1 },
};

const mockPatient = { 
    id: '1', 
    full_name: 'Zeynep Çelik', 
    phone: '5557778899', 
    email: 'zeynep@example.com',
    tc_number: '12345678901',
    birth_date: '1990-05-15',
    gender: 'female',
    address: 'İstanbul, Türkiye',
    created_at: new Date().toISOString(), 
    balance: 0 
};

const renderWithProviders = (patientId: string) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={mockAuthProvider as any}>
                <MemoryRouter initialEntries={[`/admin/patients/${patientId}`]}>
                    <Routes>
                        <Route path="/admin/patients/:patientId" element={<PatientDetail />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

describe('PatientDetail', () => {
    it('renders patient details correctly', async () => {
        vi.mocked(db.patients.getById).mockResolvedValue(mockPatient as any);
        vi.mocked(db.appointments.getByPatientId).mockResolvedValue([]); // Mock appointments call

        renderWithProviders('1');

        await waitFor(() => {
            expect(screen.getByText('Zeynep Çelik')).toBeInTheDocument();
        });

        // Check if details are rendered in the 'overview' tab
        const overviewTab = screen.getByText(/Genel Bakış/i);
        fireEvent.click(overviewTab);

        await waitFor(() => {
            expect(screen.getByText('12345678901')).toBeInTheDocument();
            expect(screen.getByText('5557778899')).toBeInTheDocument();
            expect(screen.getByText('zeynep@example.com')).toBeInTheDocument();
        });
    });

    it('displays an error message if patient is not found', async () => {
        vi.mocked(db.patients.getById).mockRejectedValue(new Error('Hasta bulunamadı'));

        renderWithProviders('2');

        await waitFor(() => {
            expect(screen.getByText(/Hasta bulunamadı/i)).toBeInTheDocument();
        });
    });
});
