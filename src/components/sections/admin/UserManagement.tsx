
import React, { useMemo } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

const UserManagement = () => {
  const { users, updateUser } = useLMS();

  const pendingUsers = useMemo(() => users.filter(u => u.status === 'pending'), [users]);
  const otherUsers = useMemo(() => users.filter(u => u.status !== 'pending').sort((a, b) => (a.name || "").localeCompare(b.name || "")), [users]);

  const handleUpdateStatus = (userId: string, status: 'active' | 'inactive') => {
    updateUser(userId, { status });
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
                    <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(user.id, 'active')}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Aprobar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(user.id, 'inactive')}>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Rechazar</span>
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={showActions ? 5 : 4} className="h-24 text-center">
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
        <p className="text-muted-foreground mt-1">Aprueba o rechaza nuevas solicitudes de registro.</p>
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
