import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/Button';
import { ArrowLeft, Trash2, MessageCircle } from 'lucide-react';

export function Comments() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);
  const [invite, setInvite] = useState<any>(null);

  useEffect(() => {
    const storedInvites = localStorage.getItem('lathe_invitations');
    if (storedInvites) {
      const invitations = JSON.parse(storedInvites);
      const found = invitations.find((i: any) => i.slug === slug);
      if (found) {
        setInvite(found);
      }
    }

    const storedComments = localStorage.getItem('lathe_comments');
    if (storedComments) {
      const allComments = JSON.parse(storedComments);
      setComments(allComments.filter((c: any) => c.inviteSlug === slug));
    }
  }, [slug]);

  const handleDelete = (id: string) => {
    const storedComments = localStorage.getItem('lathe_comments');
    if (storedComments) {
      const allComments = JSON.parse(storedComments);
      const updatedAll = allComments.filter((c: any) => c.id !== id);
      localStorage.setItem('lathe_comments', JSON.stringify(updatedAll));
      setComments(updatedAll.filter((c: any) => c.inviteSlug === slug));
    }
  };

  if (!invite) {
    return (
      <AppLayout title="Komentar">
        <div className="p-8 flex items-center justify-center w-full h-full">
          <p className="text-lathe-ink/60 dark:text-lathe-surface/60">Undangan tidak ditemukan.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Moderasi Komentar">
      <div className="p-8 overflow-y-auto w-full h-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-10 h-10 p-0 rounded-full text-lathe-ink dark:text-lathe-surface hover:bg-lathe-ink/5 dark:hover:bg-lathe-surface/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-lathe-ink dark:text-lathe-surface">
                Moderasi Komentar
              </h1>
              <p className="text-lathe-ink/60 dark:text-lathe-surface/60 mt-1 font-medium">
                Mengelola komentar untuk {invite.groomName} & {invite.brideName}
              </p>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="border border-dashed border-lathe-ink/20 dark:border-lathe-surface/20 p-12 flex flex-col items-center justify-center text-center bg-lathe-surface/50 dark:bg-lathe-ink/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-lathe-ink/5 dark:bg-lathe-surface/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-lathe-ink/40 dark:text-lathe-surface/40" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-lathe-ink dark:text-lathe-surface">Belum ada komentar</h3>
              <p className="text-lathe-ink/60 dark:text-lathe-surface/60 max-w-sm">
                Belum ada tamu yang meninggalkan pesan di undangan ini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-lathe-ink p-6 flex items-start justify-between gap-6 rounded-xl ring-1 ring-lathe-ink/10 dark:ring-lathe-surface/10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lathe-ink dark:text-lathe-surface">{comment.name}</h4>
                      <span className="text-xs text-lathe-ink/40 dark:text-lathe-surface/40">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-lathe-ink/80 dark:text-lathe-surface/80">{comment.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
