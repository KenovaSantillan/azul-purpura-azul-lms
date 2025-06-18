
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

// Lista de maestros y tutores predefinidos con correos actualizados
const defaultTeachersAndTutors: User[] = [
  // Maestros
  { id: 'teacher-1', name: 'Alfaro Hernández Jesús', email: 'jesus.alfaro@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-2', name: 'Avalos Vizcarra Ana Elena', email: 'anaelena.avalos@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-3', name: 'Barbosa Romo Erika Gabriela', email: 'erika.barbosa@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-4', name: 'Bogarin Aguayo María Guadalupe', email: 'mguadalupe.bogarin@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-5', name: 'Campos Quirarte Juana Elizabeth', email: 'elizabeth.campos@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-6', name: 'Delgadillo Preciado Héctor Enrique', email: 'hector.delgadillo@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-7', name: 'Distancia Sánchez Blanca Estela', email: 'blanca.distancia@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-8', name: 'Fernández Rolón Lilia Patricia', email: 'liliapatricia.fernandez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-9', name: 'García Serrano Emmanuel Alejandro', email: 'emmanuel.garcia@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-10', name: 'Gutiérrez Mercado José De Jesús', email: 'josedejesus.gutierrez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-11', name: 'López Garibay Esther Cecilia', email: 'esthercecilia.lopez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-12', name: 'López Morales Francisco Javier', email: 'franciscojavier.lopez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-13', name: 'Medina Carrillo Patricia', email: 'patricia.medina@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-14', name: 'Montes Leos María Guadalupe', email: 'mguadalupe.montes@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-15', name: 'Ramírez Buenrostro Blanca Selene', email: 'blancaselene.ramirez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-16', name: 'Rizo García Gerardo Alejandro', email: 'gerardo.rizo@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-17', name: 'Rodríguez Mendoza Adriana María', email: 'adriana.rodriguez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-18', name: 'Rosales Briseño Jorge Luis', email: 'jorgeluis.rosales@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-19', name: 'Santillán Vázquez Francisco', email: 'francisco.santillan@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-20', name: 'Soto Navarro Miriam Elizabeth', email: 'miriam.soto@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-21', name: 'Suarez Delgado José Antonio', email: 'joseantonio.suarez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-22', name: 'Torres Cervantes Rita Judith', email: 'judith.torres@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-23', name: 'Valdez Alcaraz Alfonso Daniel', email: 'daniel.valdez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  { id: 'teacher-24', name: 'Vázquez Barajas Marcos Alberto', email: 'marcosalberto.vazquez@cetis14.edu.mx', role: 'teacher', status: 'active' },
  
  // Tutores (usando IDs únicos para evitar conflictos)
  { id: 'tutor-1', name: 'Alfaro Hernández Jesús', email: 'jesus.alfaro@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-2', name: 'Avalos Vizcarra Ana Elena', email: 'anaelena.avalos@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-3', name: 'Barbosa Romo Erika Gabriela', email: 'erika.barbosa@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-4', name: 'Campos Quirarte Juana Elizabeth', email: 'elizabeth.campos@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-5', name: 'Fernández Rolón Lilia Patricia', email: 'liliapatricia.fernandez@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-6', name: 'García Serrano Emmanuel Alejandro', email: 'emmanuel.garcia@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-7', name: 'López Garibay Esther Cecilia', email: 'esthercecilia.lopez@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-8', name: 'Medina Carrillo Patricia', email: 'patricia.medina@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-9', name: 'Santillán Vázquez Francisco', email: 'francisco.santillan@cetis14.edu.mx', role: 'tutor', status: 'active' },
  { id: 'tutor-10', name: 'Soto Navarro Miriam Elizabeth', email: 'miriam.soto@cetis14.edu.mx', role: 'tutor', status: 'active' },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userData = useUserData();

  // Combinar usuarios existentes con la lista predefinida de maestros y tutores
  // Mantener todos los usuarios predefinidos y agregar cualquier usuario adicional de la base de datos
  const existingEmails = new Set(defaultTeachersAndTutors.map(u => u.email));
  const additionalUsers = userData.users.filter(u => !existingEmails.has(u.email));
  const allUsers = [...defaultTeachersAndTutors, ...additionalUsers];

  const contextValue = {
    ...userData,
    users: allUsers,
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
