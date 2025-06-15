
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import CreateGroupDialog from './groups/CreateGroupDialog';
import GroupList from './groups/GroupList';
import EmptyState from './groups/EmptyState';

export default function GroupsManager() {
  const { groups } = useLMS();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Grupos</h1>
          <p className="text-muted-foreground">Administra los grupos académicos</p>
        </div>
        
        <CreateGroupDialog isCreateOpen={isCreateOpen} setIsCreateOpen={setIsCreateOpen} />
      </div>

      {groups.length > 0 ? (
        <GroupList 
          groups={groups} 
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup} 
        />
      ) : (
        <EmptyState onAction={() => setIsCreateOpen(true)} />
      )}
    </div>
  );
}
