
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, Edit, Trash2, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Announcement as AnnouncementType } from '@/types/lms';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const Announcements = () => {
  const { announcements, users, currentUser, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useLMS();
  const { toast } = useToast();

  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  const handleAddAnnouncement = () => {
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim() || !currentUser) return;
    addAnnouncement({
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      createdBy: currentUser.id,
      priority: 'medium',
    });
    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    toast({
      title: "Aviso publicado",
      description: "El nuevo aviso está ahora visible para todos.",
    });
  };

  const handleEdit = (announcement: AnnouncementType) => {
    setEditingAnnouncementId(announcement.id);
    setEditedTitle(announcement.title);
    setEditedContent(announcement.content);
  };

  const handleCancelEdit = () => {
    setEditingAnnouncementId(null);
    setEditedTitle('');
    setEditedContent('');
  };

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncementId || !editedTitle.trim() || !editedContent.trim() || !updateAnnouncement) return;
    updateAnnouncement(editingAnnouncementId, { title: editedTitle, content: editedContent });
    toast({
      title: "Aviso actualizado",
      description: "Los cambios han sido guardados.",
    });
    handleCancelEdit();
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!deleteAnnouncement) return;
    deleteAnnouncement(id);
    toast({
      title: "Aviso eliminado",
      description: "El aviso ha sido borrado permanentemente.",
    });
  };

  const getAuthorName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Usuario desconocido';
  };

  const isTeacher = currentUser?.role === 'teacher';

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Tablón de Avisos</h1>
      <p className="text-muted-foreground mb-6">Centro de comunicaciones y anuncios</p>

      {isTeacher && (
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>Crear nuevo aviso</CardTitle>
            <CardDescription>Escribe un título y el contenido del aviso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Título del aviso"
              value={newAnnouncementTitle}
              onChange={(e) => setNewAnnouncementTitle(e.target.value)}
              aria-label="Título del nuevo aviso"
            />
            <Textarea
              placeholder="Escribe tu aviso aquí..."
              value={newAnnouncementContent}
              onChange={(e) => setNewAnnouncementContent(e.target.value)}
              aria-label="Contenido del nuevo aviso"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddAnnouncement} disabled={!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()}>
              <Send className="mr-2" />
              Enviar Aviso
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {announcements
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((announcement, i) => (
            <Card key={announcement.id} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              {editingAnnouncementId === announcement.id && isTeacher ? (
                <>
                  <CardHeader>
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-2xl font-semibold leading-none tracking-tight"
                      aria-label="Editar título del aviso"
                    />
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={4}
                      aria-label="Editar contenido del aviso"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleCancelEdit}>Cancelar</Button>
                    <Button onClick={handleUpdateAnnouncement}>
                      <Save className="mr-2" />
                      Guardar
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>
                      Publicado por {getAuthorName(announcement.createdBy)} - {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true, locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
                  </CardContent>
                  {isTeacher && (
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)}>
                        <Edit />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el aviso.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnnouncement(announcement.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  )}
                </>
              )}
            </Card>
        ))}
        {announcements.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <p>No hay avisos por el momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
