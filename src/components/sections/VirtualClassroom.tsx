
import React, { useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { Group } from '@/types/lms';
import GroupChat from '@/components/chat/GroupChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare } from 'lucide-react';

const VirtualClassroom = () => {
  const { groups, currentUser } = useLMS();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  if (!currentUser) {
    return (
      <div className="p-6 text-center">
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  const myGroups = groups.filter(g => 
    g.status === 'active' && 
    (g.teacherId === currentUser.id || g.students.some(s => s.id === currentUser.id))
  );
  
  if (myGroups.length === 0) {
     return (
        <div className="p-6 animate-fade-in flex items-center justify-center h-[calc(100vh-128px)]">
            <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold">No estás en ningún grupo activo</h2>
                <p className="text-muted-foreground mt-2">No tienes acceso al Aula Virtual porque no perteneces a ningún grupo activo.</p>
            </div>
        </div>
     );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-73px)] animate-fade-in">
      <Card className="md:col-span-1 lg:col-span-1 rounded-none border-r border-t-0 border-l-0 border-b-0 flex flex-col">
        <CardHeader>
          <CardTitle>Mis Grupos</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-2">
              {myGroups.map(group => (
                <Button
                  key={group.id}
                  variant={selectedGroup?.id === group.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate">{group.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{group.specialty}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-3">
        {selectedGroup ? (
          <GroupChat groupId={selectedGroup.id} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-background">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Selecciona un grupo</h2>
            <p className="text-muted-foreground mt-2">Elige un grupo de la lista para ver el chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VirtualClassroom;
