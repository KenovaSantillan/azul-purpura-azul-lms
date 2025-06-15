
import React, { useMemo, useState } from 'react';
import { useLMS } from '@/contexts/LMSContext';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/lms';
import { toast } from 'sonner';
import { UserTable } from './UserTable';

const UserManagement = () => {
  const { groups, addUsersToGroup } = useLMS();
  const { users, updateUser } = useUser();
  const [selectedGroups, setSelectedGroups] = useState<Record<string, string>>({});
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});

  const pendingUsers = useMemo(() => users.filter(u => u.status === 'pending'), [users]);
  const otherUsers = useMemo(() => users.filter(u => u.status !== 'pending').sort((a, b) => (a.name || "").localeCompare(b.name || "")), [users]);

  const handleGroupSelect = (userId: string, groupId: string) => {
    setSelectedGroups(prev => ({ ...prev, [userId]: groupId }));
  };

  const handleRoleSelect = (userId: string, role: UserRole) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleApproveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const roleToAssign = selectedRoles[userId] || user.role;
    const isTeacher = roleToAssign === 'teacher';

    if (roleToAssign === 'student') {
        const groupId = selectedGroups[userId];
        if (!groupId) {
            toast.error("Por favor, seleccione un grupo para el alumno antes de aprobarlo.");
            return;
        }
        updateUser(userId, { status: 'active', role: 'student' });
        addUsersToGroup(groupId, [userId]);
        toast.success("Alumno aprobado y asignado al grupo.");
    } else {
        updateUser(userId, { 
          status: 'active', 
          role: roleToAssign,
          ...(isTeacher && { ai_grading_enabled: true })
        });
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
        groups={groups}
        selectedGroups={selectedGroups}
        handleGroupSelect={handleGroupSelect}
        handleRoleSelect={handleRoleSelect}
        handleApproveUser={handleApproveUser}
        handleRejectUser={handleRejectUser}
        updateUser={updateUser}
        findStudentGroup={findStudentGroup}
      />
      
      <UserTable
        userList={otherUsers}
        title="Todos los Usuarios"
        description="Lista de usuarios activos e inactivos."
        showActions={false}
        groups={groups}
        updateUser={updateUser}
        findStudentGroup={findStudentGroup}
      />
    </div>
  );
};

export default UserManagement;
