
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import CreateGroupDialog from './groups/CreateGroupDialog';
import GroupList from './groups/GroupList';
import EmptyState from './groups/EmptyState';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function GroupsManager() {
  const { groups } = useLMS();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const activeGroups = groups.filter(g => g.status !== 'archived');
  const archivedGroups = groups.filter(g => g.status === 'archived');

  const groupsToShow = showArchived ? archivedGroups : activeGroups;
  const emptyStateMessage = showArchived ? "No hay grupos archivados." : "Aún no has creado ningún grupo.";


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

      {groupsToShow.length > 0 ? (
        <GroupList 
          groups={groupsToShow} 
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup} 
        />
      ) : (
        <EmptyState onAction={() => setIsCreateOpen(true)} message={emptyStateMessage} />
      )}
    </div>
  );
}
