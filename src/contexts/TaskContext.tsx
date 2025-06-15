
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskSubmission, StudentProgress, User } from '@/types/lms';
import { useUser } from './UserContext';

const simpleHash = (text: string): string => {
  if (!text) return '';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export interface TaskContextType {
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTaskSubmission: (submission: Omit<TaskSubmission, 'id' | 'createdAt' | 'submittedAt' | 'submissionHash'>) => void;
  updateTaskSubmission: (id: string, submission: Partial<TaskSubmission>) => void;
  getStudentProgress: (studentId: string, groupId: string) => StudentProgress | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  const { users } = useUser();

  useEffect(() => {
    if (users.length === 0) return;

    const usersForSetup = users;
    
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Proyecto Final HTML/CSS',
        description: 'Crear una página web completa usando HTML y CSS',
        type: 'collective',
        groupId: '1',
        assignedTo: usersForSetup.filter(u => u.role === 'student').map(s => s.id),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: '1',
        createdAt: new Date(),
        max_score: 100,
        allow_late_submissions: true,
        rubric: `...`,
        rubric_structured: [
          { id: 'html_structure', description: 'Estructura HTML', points: 30 },
          { id: 'css_styles', description: 'Estilos CSS', points: 40 },
          { id: 'responsiveness', description: 'Responsividad', points: 20 },
          { id: 'creativity', description: 'Creatividad y Originalidad', points: 10 },
        ],
      },
      {
        id: '2',
        title: 'Investigación sobre Frameworks',
        description: 'Realizar un cuadro comparativo de React, Vue y Angular.',
        type: 'individual',
        groupId: '1',
        assignedTo: usersForSetup.filter(u => u.role === 'student').map(s => s.id),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: '1',
        createdAt: new Date(),
        max_score: 100,
        allow_late_submissions: true,
      },
      {
        id: '3',
        title: 'Examen Parcial 1',
        description: 'Examen sobre los fundamentos de JavaScript.',
        type: 'individual',
        groupId: '1',
        assignedTo: usersForSetup.filter(u => u.role === 'student').map(s => s.id),
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'completed',
        createdBy: '1',
        createdAt: new Date(),
        max_score: 100,
        allow_late_submissions: false,
      }
    ];
    setTasks(sampleTasks);
    
    const studentJuan = usersForSetup.find(u => u.email === 'juan@estudiante.edu');
    const sampleSubmissions: TaskSubmission[] = [];
    if (studentJuan) {
      sampleSubmissions.push({ id: 'sub1', taskId: '1', studentId: studentJuan.id, submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), total_score: 90 });
      sampleSubmissions.push({ id: 'sub2', taskId: '2', studentId: studentJuan.id, submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), total_score: 85 });
      sampleSubmissions.push({ id: 'sub3', taskId: '3', studentId: studentJuan.id, submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), total_score: 92 });
    }
    setTaskSubmissions(sampleSubmissions);
  }, [users]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), createdAt: new Date() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTaskSubmission = (submission: Omit<TaskSubmission, 'id' | 'createdAt' | 'submittedAt' | 'submissionHash'>) => {
    const submissionHash = submission.content ? simpleHash(submission.content) : undefined;
    const newSubmission: TaskSubmission = { ...submission, id: Date.now().toString(), createdAt: new Date(), submittedAt: new Date(), submissionHash };
    
    if (submissionHash) {
      const existingSubmission = taskSubmissions.find(s => s.taskId === submission.taskId && s.submissionHash === submissionHash && s.studentId !== submission.studentId);
      if (existingSubmission) {
        updateTask(submission.taskId, { status: 'plagiarized' });
        console.warn(`Plagiarism detected for task ${submission.taskId}`);
      }
    }
    
    setTaskSubmissions(prev => [...prev, newSubmission]);
    
    const task = tasks.find(t => t.id === submission.taskId);
    if (task && task.status !== 'plagiarized') {
      updateTask(submission.taskId, { status: 'submitted' });
    }
  };

  const updateTaskSubmission = (id: string, submission: Partial<TaskSubmission>) => {
    setTaskSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...submission } : s));
  };

  const getStudentProgress = (studentId: string, groupId: string): StudentProgress | null => {
    const groupTasks = tasks.filter(t => t.groupId === groupId && t.assignedTo.includes(studentId));
    const completedTasks = groupTasks.filter(t => t.status === 'completed').length;
    
    return {
      studentId,
      groupId,
      completedTasks,
      totalTasks: groupTasks.length,
      grade: groupTasks.length > 0 ? (completedTasks / groupTasks.length) * 100 : 0,
      lastActivity: new Date(),
    };
  };

  const value = { tasks, taskSubmissions, addTask, updateTask, deleteTask, addTaskSubmission, updateTaskSubmission, getStudentProgress };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
