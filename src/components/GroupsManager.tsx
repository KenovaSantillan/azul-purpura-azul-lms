
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import CreateGroupDialog from './groups/CreateGroupDialog';
import GroupCard from './groups/GroupCard';
import GroupChat from '@/components/chat/GroupChat';
import EmptyState from './groups/EmptyState';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Group } from '@/types/lms';
import EditGroupDialog from './groups/EditGroupDialog';
import DeleteGroupConfirmationDialog from './groups/DeleteGroupConfirmationDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function GroupsManager() {
  const { groups, loadingGroups } = useLMS();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [viewingChat, setViewingChat] = useState<string | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const activeGroups = groups.filter(g => g.status !== 'archived');
  const archivedGroups = groups.filter(g => g.status === 'archived');

  const groupsToShow = showArchived ? archivedGroups : activeGroups;
  const viewingGroupName = viewingChat ? groups.find(g => g.id === viewingChat)?.name : '';

  if (viewingChat) {
    return (
      <div className="p-6 space-y-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setViewingChat(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Aula Virtual: {viewingGroupName}</h1>
            <p className="text-muted-foreground">Chatea con los miembros de tu grupo.</p>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <GroupChat groupId={viewingChat} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Grupos</h1>
          <p className="text-muted-foreground">Administra los grupos académicos</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived">Mostrar archivados</Label>
          </div>
          <CreateGroupDialog isCreateOpen={isCreateOpen} setIsCreateOpen={setIsCreateOpen} />
        </div>
      </div>

      {loadingGroups ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border bg-card text-card-foreground rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-6 w-16" />
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : groupsToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsToShow.map((group, index) => (
            <GroupCard 
              key={group.id}
              group={group}
              index={index}
              isSelected={selectedGroup === group.id}
              onSelect={setSelectedGroup} 
              onEnterClassroom={setViewingChat}
              onEdit={setGroupToEdit}
              onDelete={setGroupToDelete}
            />
          ))}
        </div>
      ) : (
        showArchived ? (
          <EmptyState message="No hay grupos archivados." description="Cuando archives un grupo, aparecerá aquí." />
        ) : (
          <EmptyState 
            message="Aún no has creado ningún grupo."
            description="Crea tu primer grupo para comenzar a gestionar estudiantes."
            actionText="Crear Primer Grupo"
            onAction={() => setIsCreateOpen(true)}
          />
        )
      )}

      <EditGroupDialog
        group={groupToEdit}
        isOpen={!!groupToEdit}
        onOpenChange={(isOpen) => !isOpen && setGroupToEdit(null)}
      />
      <DeleteGroupConfirmationDialog
        group={groupToDelete}
        isOpen={!!groupToDelete}
        onOpenChange={(isOpen) => !isOpen && setGroupToDelete(null)}
      />
    </div>
  );
}
