import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '../../../contexts/AuthContext';
import AddPatientForm from './AddPatientForm';

// Mocking the db module
vi.mock('../../../lib/db', () => ({
  db: {
    patients: {
      add: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockAuthProvider = {
  profile: { clinic_id: 1 },
  // Add other properties if your component uses them
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthProvider as any}>
        {ui}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('AddPatientForm', () => {
  it('renders correctly', () => {
    renderWithProviders(<AddPatientForm onSuccess={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText(/Ad Soyad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kaydet/i })).toBeInTheDocument();
  });

  it('shows validation error for short full_name', async () => {
    renderWithProviders(<AddPatientForm onSuccess={() => {}} onCancel={() => {}} />);
    
    const nameInput = screen.getByLabelText(/Ad Soyad/i);
    const saveButton = screen.getByRole('button', { name: /Kaydet/i });

    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Ad soyad en az 3 karakter olmalıdır/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid TC number', async () => {
    renderWithProviders(<AddPatientForm onSuccess={() => {}} onCancel={() => {}} />);
    
    const tcInput = screen.getByLabelText(/TC Kimlik No/i);
    const saveButton = screen.getByRole('button', { name: /Kaydet/i });

    fireEvent.change(tcInput, { target: { value: '12345' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/TC Kimlik No 11 haneli olmalıdır/i)).toBeInTheDocument();
    });

    fireEvent.change(tcInput, { target: { value: '11111111111' } });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
        expect(screen.getByText(/Geçersiz TC Kimlik No/i)).toBeInTheDocument();
    });
  });

});