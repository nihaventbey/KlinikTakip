import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { BookMarked, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MedicalHistoryNotesProps {
  patientId: string;
  clinicId: string;
}

type NoteFormData = {
  note: string;
};

// --- Add Note Form Component ---
const AddNoteForm = ({ patientId, clinicId }: MedicalHistoryNotesProps) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteFormData>();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const addNoteMutation = useMutation({
        mutationFn: (newNote: { note: string; patient_id: string; clinic_id: string; doctor_id: string; }) => db.clinical_notes.add(newNote),
        onSuccess: () => {
            toast.success('Not başarıyla eklendi.');
            reset();
        },
        onError: (error) => {
            toast.error(`Not eklenirken bir hata oluştu: ${error.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['clinical_notes', patientId] });
        }
    });

    const onSubmit: SubmitHandler<NoteFormData> = (data) => {
        if (!user) {
            toast.error("Not eklemek için giriş yapmalısınız.");
            return;
        }
        addNoteMutation.mutate({
            note: data.note,
            patient_id: patientId,
            clinic_id: clinicId,
            doctor_id: user.id,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 border bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Yeni Klinik Not Ekle</h4>
            <textarea
                {...register('note', { required: 'Not alanı boş bırakılamaz.' })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hasta ile ilgili gözlemlerinizi, teşhis veya tedavi notlarınızı buraya yazın..."
            />
            {errors.note && <p className="text-xs text-red-600 mt-1">{errors.note.message}</p>}
            <div className="text-right mt-2">
                <Button type="submit" isLoading={addNoteMutation.isPending}>
                    Notu Kaydet
                </Button>
            </div>
        </form>
    );
};


// --- Main Component ---
export default function MedicalHistoryNotes({ patientId, clinicId }: MedicalHistoryNotesProps) {
  const queryClient = useQueryClient();
  const { data: notes, isLoading } = useQuery({
    queryKey: ['clinical_notes', patientId],
    queryFn: () => db.clinical_notes.getByPatientId(patientId, clinicId),
    enabled: !!patientId && !!clinicId,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => db.clinical_notes.remove(noteId),
    onSuccess: () => {
      toast.success('Not başarıyla silindi.');
    },
    onError: (error) => {
      toast.error(`Not silinirken bir hata oluştu: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical_notes', patientId] });
    },
  });

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  return (
    <div>
        <AddNoteForm patientId={patientId} clinicId={clinicId} />
        
        <h4 className="font-semibold text-gray-800 mb-4">Geçmiş Notlar</h4>
        {isLoading && <div className="text-center py-4">Tıbbi notlar yükleniyor...</div>}
        {!isLoading && (!notes || notes.length === 0) && (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                Bu hasta için henüz klinik not eklenmemiş.
            </div>
        )}

        {notes && notes.length > 0 && (
            <div className="flow-root">
                <ul className="-mb-8">
                    {notes.map((note, index) => (
                    <li key={note.id}>
                        <div className="relative pb-8">
                        {index !== notes.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                            <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
                                <BookMarked className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </div>
                            </div>
                            <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{note.doctor?.full_name || 'Bilinmeyen Doktor'}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        {new Date(note.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-full"
                                    disabled={deleteNoteMutation.isPending && deleteNoteMutation.variables === note.id}
                                    title="Notu Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 bg-white p-3 rounded-md border">
                                <p style={{ whiteSpace: 'pre-wrap' }}>{note.note}</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}
