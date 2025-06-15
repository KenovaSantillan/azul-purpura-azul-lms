
import React, { useMemo, useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { User } from '@/types/lms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
  const { users, updateUser, groups, addUsersToGroup } = useLMS();
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>({});

  const pendingUsers = useMemo(() => users.filter(u => u.status === 'pending'), [users]);
  const otherUsers = useMemo(() => users.filter(u => u.status !== 'pending').sort((a, b) => (a.name || "").localeCompare(b.name || "")), [users]);

  const handleGroupSelect = (userId: string, groupId: string) => {
    setSelectedGroups(prev => ({ ...prev, [userId]: groupId }));
  };

  const handleApproveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.role === 'student') {
        const groupId = selectedGroups[userId];
        if (!groupId) {
            toast.error("Por favor, seleccione un grupo para el alumno antes de aprobarlo.");
            return;
        }
        updateUser(userId, { status: 'active' });
        addUsersToGroup(groupId, [userId]);
        toast.success("Alumno aprobado y asignado al grupo.");
    } else {
        updateUser(userId, { status: 'active' });
        toast.success("Usuario aprobado.");
    }
  };

  const handleRejectUser = (userId: string) => {
    updateUser(userId, { status: 'inactive' });
    toast.info("Usuario rechazado.");
  };

  const findStudentGroup = (studentId: string): string => {
    for (const group of groups) {
      if (group.students.some(student => student.id === studentId)) {
        return group.name;
      }
    }
    return 'Sin grupo';
  };

  const UserTable = ({ userList, title, description, showActions }: { userList: User[], title: string, description: string, showActions: boolean }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Rol</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Estatus</TableHead>
                {showActions && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.length > 0 ? userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === 'student' ? (
                      showActions ? (
                        <Select onValueChange={(value) => handleGroupSelect(user.id, value)} value={selectedGroups[user.id]}>
                          <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Asignar grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.filter(g => g.status === 'active').map((group) => (
                              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        findStudentGroup(user.id)
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleApproveUser(user.id)}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Aprobar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRejectUser(user.id)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Rechazar</span>
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={showActions ? 6 : 5} className="h-24 text-center">
                    No hay usuarios en esta categoría.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-1">Aprueba o rechaza nuevas solicitudes de registro y asígnalos a un grupo.</p>
      </header>
      
      <UserTable 
        userList={pendingUsers} 
        title="Solicitudes Pendientes" 
        description={`${pendingUsers.length} ${pendingUsers.length === 1 ? 'usuario pendiente' : 'usuarios pendientes'}`}
        showActions={true}
      />
      
      <UserTable
        userList={otherUsers}
        title="Todos los Usuarios"
        description="Lista de usuarios activos e inactivos."
        showActions={false}
      />
    </div>
  );
};

export default UserManagement;
