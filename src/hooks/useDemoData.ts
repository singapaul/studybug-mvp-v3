import { useState, useEffect, useCallback } from 'react';
import { 
  DemoClass, 
  DemoStudent, 
  DemoGame, 
  DemoAssignment, 
  StudentProgress, 
  ActivityItem,
  MultipleChoiceQuestion,
  FlashcardQuestion
} from '@/types/app';
import {
  demoClasses,
  demoStudents,
  demoGames,
  demoAssignments,
  demoStudentProgress,
  demoActivityFeed,
  demoStudentUser,
  demoStudentScores,
  demoStudentAssignments
} from '@/data/demoData';

const STORAGE_KEY = 'studybug_demo_data';

interface DemoDataStore {
  classes: DemoClass[];
  students: DemoStudent[];
  games: DemoGame[];
  assignments: DemoAssignment[];
  studentProgress: StudentProgress[];
  activityFeed: ActivityItem[];
}

function getInitialData(): DemoDataStore {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // Fall through to default data
    }
  }
  
  const initialData: DemoDataStore = {
    classes: demoClasses,
    students: demoStudents,
    games: demoGames,
    assignments: demoAssignments,
    studentProgress: demoStudentProgress,
    activityFeed: demoActivityFeed,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

export function useDemoData() {
  const [data, setData] = useState<DemoDataStore>(getInitialData);

  const saveData = useCallback((newData: DemoDataStore) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  // Class operations
  const addClass = useCallback((classData: Omit<DemoClass, 'id' | 'createdAt'>) => {
    const newClass: DemoClass = {
      ...classData,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newData = { ...data, classes: [...data.classes, newClass] };
    
    // Add activity
    const activity: ActivityItem = {
      id: `act${Date.now()}`,
      type: 'class-created',
      message: `New class "${newClass.name}" created`,
      timestamp: new Date().toISOString(),
    };
    newData.activityFeed = [activity, ...newData.activityFeed];
    
    saveData(newData);
    return newClass;
  }, [data, saveData]);

  const updateClass = useCallback((id: string, updates: Partial<DemoClass>) => {
    const newClasses = data.classes.map(c => c.id === id ? { ...c, ...updates } : c);
    saveData({ ...data, classes: newClasses });
  }, [data, saveData]);

  const deleteClass = useCallback((id: string) => {
    const newClasses = data.classes.filter(c => c.id !== id);
    saveData({ ...data, classes: newClasses });
  }, [data, saveData]);

  // Game operations
  const addGame = useCallback((gameData: Omit<DemoGame, 'id' | 'createdAt' | 'timesAssigned'>) => {
    const newGame: DemoGame = {
      ...gameData,
      id: `g${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      timesAssigned: 0,
    };
    const newData = { ...data, games: [...data.games, newGame] };
    
    // Add activity
    const activity: ActivityItem = {
      id: `act${Date.now()}`,
      type: 'game-created',
      message: `New game "${newGame.name}" created`,
      timestamp: new Date().toISOString(),
    };
    newData.activityFeed = [activity, ...newData.activityFeed];
    
    saveData(newData);
    return newGame;
  }, [data, saveData]);

  const updateGame = useCallback((id: string, updates: Partial<DemoGame>) => {
    const newGames = data.games.map(g => g.id === id ? { ...g, ...updates } : g);
    saveData({ ...data, games: newGames });
  }, [data, saveData]);

  const deleteGame = useCallback((id: string) => {
    const newGames = data.games.filter(g => g.id !== id);
    saveData({ ...data, games: newGames });
  }, [data, saveData]);

  const duplicateGame = useCallback((id: string) => {
    const game = data.games.find(g => g.id === id);
    if (!game) return null;
    
    const newGame: DemoGame = {
      ...game,
      id: `g${Date.now()}`,
      name: `${game.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      timesAssigned: 0,
    };
    saveData({ ...data, games: [...data.games, newGame] });
    return newGame;
  }, [data, saveData]);

  // Assignment operations
  const addAssignment = useCallback((assignmentData: Omit<DemoAssignment, 'id' | 'createdAt'>) => {
    const newAssignment: DemoAssignment = {
      ...assignmentData,
      id: `a${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    // Update game's timesAssigned
    const newGames = data.games.map(g => 
      g.id === assignmentData.gameId 
        ? { ...g, timesAssigned: g.timesAssigned + 1 } 
        : g
    );
    
    // Create progress entries for all students in the class
    const classData = data.classes.find(c => c.id === assignmentData.classId);
    const newProgress: StudentProgress[] = classData?.studentIds.map(studentId => ({
      id: `p${Date.now()}-${studentId}`,
      studentId,
      assignmentId: newAssignment.id,
      status: 'not-started' as const,
      attempts: 0,
    })) || [];
    
    const newData = { 
      ...data, 
      assignments: [...data.assignments, newAssignment],
      games: newGames,
      studentProgress: [...data.studentProgress, ...newProgress],
    };
    
    // Add activity
    const game = data.games.find(g => g.id === assignmentData.gameId);
    const activity: ActivityItem = {
      id: `act${Date.now()}`,
      type: 'assignment-created',
      message: `New assignment "${game?.name || 'Game'}" created for "${classData?.name || 'Class'}"`,
      timestamp: new Date().toISOString(),
    };
    newData.activityFeed = [activity, ...newData.activityFeed];
    
    saveData(newData);
    return newAssignment;
  }, [data, saveData]);

  const deleteAssignment = useCallback((id: string) => {
    const newAssignments = data.assignments.filter(a => a.id !== id);
    const newProgress = data.studentProgress.filter(p => p.assignmentId !== id);
    saveData({ ...data, assignments: newAssignments, studentProgress: newProgress });
  }, [data, saveData]);

  // Student operations
  const joinClass = useCallback((joinCode: string, studentId: string) => {
    const classToJoin = data.classes.find(c => c.joinCode.toUpperCase() === joinCode.toUpperCase());
    if (!classToJoin) {
      return { success: false, error: 'Invalid join code' };
    }
    
    if (classToJoin.studentIds.includes(studentId)) {
      return { success: false, error: 'Already in this class' };
    }
    
    const newClasses = data.classes.map(c => 
      c.id === classToJoin.id 
        ? { ...c, studentIds: [...c.studentIds, studentId] }
        : c
    );
    
    // Create progress entries for existing assignments in this class
    const classAssignments = data.assignments.filter(a => a.classId === classToJoin.id);
    const newProgress: StudentProgress[] = classAssignments.map(assignment => ({
      id: `p${Date.now()}-${assignment.id}`,
      studentId,
      assignmentId: assignment.id,
      status: 'not-started' as const,
      attempts: 0,
    }));
    
    const newData = { 
      ...data, 
      classes: newClasses,
      studentProgress: [...data.studentProgress, ...newProgress],
    };
    
    // Add activity
    const activity: ActivityItem = {
      id: `act${Date.now()}`,
      type: 'student-joined',
      message: `New student joined "${classToJoin.name}"`,
      timestamp: new Date().toISOString(),
    };
    newData.activityFeed = [activity, ...newData.activityFeed];
    
    saveData(newData);
    return { success: true, className: classToJoin.name };
  }, [data, saveData]);

  // Progress operations
  const updateProgress = useCallback((studentId: string, assignmentId: string, updates: Partial<StudentProgress>) => {
    const existingIndex = data.studentProgress.findIndex(
      p => p.studentId === studentId && p.assignmentId === assignmentId
    );
    
    let newProgress: StudentProgress[];
    if (existingIndex >= 0) {
      newProgress = data.studentProgress.map((p, i) => 
        i === existingIndex ? { ...p, ...updates } : p
      );
    } else {
      newProgress = [...data.studentProgress, {
        id: `p${Date.now()}`,
        studentId,
        assignmentId,
        status: 'not-started' as const,
        attempts: 0,
        ...updates,
      }];
    }
    
    saveData({ ...data, studentProgress: newProgress });
  }, [data, saveData]);

  // Computed data
  const getClassById = useCallback((id: string) => data.classes.find(c => c.id === id), [data.classes]);
  const getGameById = useCallback((id: string) => data.games.find(g => g.id === id), [data.games]);
  const getAssignmentById = useCallback((id: string) => data.assignments.find(a => a.id === id), [data.assignments]);
  const getStudentById = useCallback((id: string) => data.students.find(s => s.id === id), [data.students]);
  
  const getStudentsInClass = useCallback((classId: string) => {
    const classData = data.classes.find(c => c.id === classId);
    if (!classData) return [];
    return data.students.filter(s => classData.studentIds.includes(s.id));
  }, [data.classes, data.students]);

  const getAssignmentsForClass = useCallback((classId: string) => {
    return data.assignments.filter(a => a.classId === classId);
  }, [data.assignments]);

  const getProgressForAssignment = useCallback((assignmentId: string) => {
    return data.studentProgress.filter(p => p.assignmentId === assignmentId);
  }, [data.studentProgress]);

  const getProgressForStudent = useCallback((studentId: string) => {
    return data.studentProgress.filter(p => p.studentId === studentId);
  }, [data.studentProgress]);

  // Reset demo data
  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const freshData = getInitialData();
    setData(freshData);
  }, []);

  return {
    // Data
    classes: data.classes,
    students: data.students,
    games: data.games,
    assignments: data.assignments,
    studentProgress: data.studentProgress,
    activityFeed: data.activityFeed,
    
    // Class operations
    addClass,
    updateClass,
    deleteClass,
    getClassById,
    getStudentsInClass,
    getAssignmentsForClass,
    
    // Game operations
    addGame,
    updateGame,
    deleteGame,
    duplicateGame,
    getGameById,
    
    // Assignment operations
    addAssignment,
    deleteAssignment,
    getAssignmentById,
    getProgressForAssignment,
    
    // Student operations
    joinClass,
    getStudentById,
    getProgressForStudent,
    
    // Progress operations
    updateProgress,
    
    // Utility
    resetData,
    
    // Student-specific demo data
    demoStudentUser,
    demoStudentScores,
    demoStudentAssignments,
  };
}

// Generate a random 6-character join code
export function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
