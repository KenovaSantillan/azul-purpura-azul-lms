
import React from 'react';
import { User, UserRole, Group } from '@/types/lms';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface UserTableProps {
  userList: User[];
  title: string;
  description: string;
  showActions: boolean;
  groups: Group[];
  selectedGroups?: Record<string, string>;
  handleGroupSelect?: (userId: string, groupId: string) => void;
  handleRoleSelect?: (userId: string, role: UserRole) => void;
  handleApproveUser?: (userId: string) => void;
  handleRejectUser?: (userId: string) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  findStudentGroup: (studentId: string) => string;
}

export const UserTable = ({
  userList,
  title,
  description,
  showActions,
  groups,
  selectedGroups,
  handleGroupSelect,
  handleRoleSelect,
  handleApproveUser,
  handleRejectUser,
  updateUser,
  findStudentGroup,
}: UserTableProps) => (
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
              <TableHead>Calificación IA</TableHead>
              {showActions && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.length > 0 ? userList.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {showActions && user.status === 'pending' && handleRoleSelect ? (
                      <Select onValueChange={(value) => handleRoleSelect(user.id, value as UserRole)} defaultValue={user.role}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Asignar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Alumno</SelectItem>
                          <SelectItem value="teacher">Docente</SelectItem>
                          <SelectItem value="tutor">Tutor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{user.role}</Badge>
                    )}
                </TableCell>
                <TableCell>
                  {user.role === 'student' ? (
                    (showActions && handleGroupSelect && selectedGroups) ? (
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
                <TableCell>
                  {user.role === 'teacher' ? (
                    <Switch
                      checked={user.ai_grading_enabled ?? true}
                      onCheckedChange={(checked) => {
                        updateUser(user.id, { ai_grading_enabled: checked });
                        toast.success(`Calificación con IA ${checked ? 'habilitada' : 'deshabilitada'} para ${user.name}.`);
                      }}
                      disabled={user.status !== 'active'}
                    />
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                {showActions && handleApproveUser && handleRejectUser && (
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
                <TableCell colSpan={showActions ? 7 : 6} className="h-24 text-center">
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
