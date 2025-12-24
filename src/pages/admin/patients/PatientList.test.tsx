import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import PatientList from './PatientList';
import { db } from '../../../lib/db';

vi.mock('../../../lib/db');

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const mockAuthProvider = {
    profile: { clinic_id: 1 },
};

const mockPatients = [
    { id: '1', full_name: 'Ahmet Yılmaz', phone: '5551112233', created_at: new Date().toISOString(), balance: 100 },
    { id: '2', full_name: 'Ayşe Kaya', phone: '5554445566', created_at: new Date().toISOString(), balance: -50 },
];

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={mockAuthProvider as any}>
                <MemoryRouter>{ui}</MemoryRouter>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

describe('PatientList', () => {
    it('renders and displays patients', async () => {
        vi.mocked(db.patients.getAll).mockResolvedValue(mockPatients as any);

        renderWithProviders(<PatientList />);

        expect(screen.getByText(/Aktif Hastalar/i)).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
            expect(screen.getByText('Ayşe Kaya')).toBeInTheDocument();
        });
    });

    it('filters patients when searching', async () => {
        vi.mocked(db.patients.getAll).mockResolvedValue(mockPatients as any);
        const searchMock = vi.mocked(db.patients.search).mockResolvedValue([mockPatients[1]] as any);

        renderWithProviders(<PatientList />);

        await waitFor(() => {
            expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/İsim veya TC No ile ara/i);
        fireEvent.change(searchInput, { target: { value: 'Ayşe' } });

        await waitFor(() => {
            // useDebounce will trigger this after a delay
            expect(searchMock).toHaveBeenCalledWith('Ayşe', 1);
        });

        await waitFor(() => {
            expect(screen.queryByText('Ahmet Yılmaz')).not.toBeInTheDocument();
            expect(screen.getByText('Ayşe Kaya')).toBeInTheDocument();
        });
    });
});
