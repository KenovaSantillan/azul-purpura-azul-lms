export type Grade = '1o' | '2o' | '3o' | '4o' | '5o' | '6o';
export type Letter = 'A' | 'B' | 'C' | 'D' | 'E';
export type Specialty = 'Servicios de Hospedaje' | 'Programación' | 'Contabilidad' | 'Construcción';
export type Shift = 'Matutino' | 'Vespertino';
export type TaskType = 'collective' | 'group' | 'individual';
export type UserRole = 'student' | 'teacher' | 'tutor' | 'parent' | 'admin';
export type ResourceType = 'file' | 'link';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  parentId?: string; // For students linked to parents
  studentIds?: string[]; // For parents linked to students
  status?: 'pending' | 'active' | 'inactive';
  ai_grading_enabled?: boolean;
}

export interface Group {
  id: string;
  name: string;
  grade: Grade;
  letter: Letter;
  specialty: Specialty;
  shift: Shift;
  teacherId: string;
  tutorId?: string;
  students: User[];
  color?: string;
  createdAt: Date;
  status?: 'active' | 'archived';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  groupId: string;
  assignedTo: string[]; // Student IDs
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'submitted' | 'graded' | 'plagiarized';
  createdBy: string;
  createdAt: Date;
  max_score?: number;
  allow_late_submissions?: boolean;
  rubric?: string | null;
  rubric_structured?: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  groupId?: string; // If null, it's for all groups
  createdBy: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface StudentProgress {
  studentId: string;
  groupId: string;
  completedTasks: number;
  totalTasks: number;
  grade: number;
  lastActivity: Date;
}

export interface Team {
  id: string;
  name: string;
  groupId: string;
  members: User[];
  color?: string;
}

export interface Attachment {
  fileName: string;
  url: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  teamId?: string;
  submittedAt: Date;
  content?: string;
  attachments?: Attachment[];
  submissionHash?: string;
  total_score?: number;
  score_details?: any;
  teacherFeedback?: string;
  createdAt: Date;
}

export interface GroupChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  type: ResourceType;
  content: string;
  file_name?: string | null;
  file_type?: string | null;
  group_id?: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}
