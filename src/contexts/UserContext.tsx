
import React, { createContext, useContext } from 'react';
import { User } from '@/types/lms';
import { useUserData } from '@/hooks/useUserData';

interface UserContextType {
  users: User[];
  loadingUsers: boolean;
  currentUser: User | null;
  loadingCurrentUser: boolean;
  createUser: (userData: { email: string; role: 'student' | 'teacher' | 'tutor' | 'parent' | 'admin'; first_name: string; last_name: string; }) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Lista de maestros y tutores predefinidos
const defaultTeachersAndTutors: User[] = [
  // Maestros
  { id: 'teacher-1', name: 'Alfaro Hernández Jesús', email: 'alfaro@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-2', name: 'Avalos Vizcarra Ana Elena', email: 'avalos@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-3', name: 'Barbosa Romo Erika Gabriela', email: 'barbosa@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-4', name: 'Bogarin Aguayo María Guadalupe', email: 'bogarin@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-5', name: 'Campos Quirarte Juana Elizabeth', email: 'campos@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-6', name: 'Delgadillo Preciado Héctor Enrique', email: 'delgadillo@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-7', name: 'Distancia Sánchez Blanca Estela', email: 'distancia@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-8', name: 'Fernández Rolón Lilia Patricia', email: 'fernandez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-9', name: 'García Serrano Emmanuel Alejandro', email: 'garcia@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-10', name: 'Gutiérrez Mercado José De Jesús', email: 'gutierrez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-11', name: 'López Garibay Esther Cecilia', email: 'lopez.garibay@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-12', name: 'López Morales Francisco Javier', email: 'lopez.morales@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-13', name: 'Medina Carrillo Patricia', email: 'medina@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-14', name: 'Montes Leos María Guadalupe', email: 'montes@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-15', name: 'Ramírez Buenrostro Blanca Selene', email: 'ramirez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-16', name: 'Rizo García Gerardo Alejandro', email: 'rizo@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-17', name: 'Rodríguez Mendoza Adriana María', email: 'rodriguez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-18', name: 'Rosales Briseño Jorge Luis', email: 'rosales@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-19', name: 'Santillán Vázquez Francisco', email: 'santillan@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-20', name: 'Soto Navarro Miriam Elizabeth', email: 'soto@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-21', name: 'Suarez Delgado José Antonio', email: 'suarez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-22', name: 'Torres Cervantes Rita Judith', email: 'torres@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-23', name: 'Valdez Alcaraz Alfonso Daniel', email: 'valdez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-24', name: 'Vázquez Barajas Marcos Alberto', email: 'vazquez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  
  // Tutores (algunos de los mismos maestros pueden ser tutores)
  { id: 'tutor-1', name: 'Alfaro Hernández Jesús', email: 'alfaro.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-2', name: 'Avalos Vizcarra Ana Elena', email: 'avalos.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-3', name: 'Barbosa Romo Erika Gabriela', email: 'barbosa.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-4', name: 'Campos Quirarte Juana Elizabeth', email: 'campos.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-5', name: 'Fernández Rolón Lilia Patricia', email: 'fernandez.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-6', name: 'García Serrano Emmanuel Alejandro', email: 'garcia.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-7', name: 'López Garibay Esther Cecilia', email: 'lopez.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-8', name: 'Medina Carrillo Patricia', email: 'medina.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-9', name: 'Santillán Vázquez Francisco', email: 'santillan.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-10', name: 'Soto Navarro Miriam Elizabeth', email: 'soto.tutor@cetis14.edu.mx', role: 'tutor', status: 'active' },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userData = useUserData();

  // Combinar usuarios existentes con la lista predefinida de maestros y tutores
  const allUsers = [...userData.users, ...defaultTeachersAndTutors];
  
  // Eliminar duplicados basados en el email
  const uniqueUsers = allUsers.filter((user, index, self) => 
    index === self.findIndex((u) => u.email === user.email)
  );

  const contextValue = {
    ...userData,
    users: uniqueUsers,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
