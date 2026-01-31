// Group and class management types

export interface Group {
  id: string;
  tutorId: string;
  name: string;
  ageRange: string | null;
  subjectArea: string | null;
  joinCode: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    members: number;
    assignments: number;
  };
}

export interface GroupMember {
  id: string;
  groupId: string;
  studentId: string;
  joinedAt: Date;
  student: {
    id: string;
    user: {
      id: string;
      email: string;
    };
  };
}

export interface GroupWithDetails extends Group {
  members: GroupMember[];
  assignments: Array<{
    id: string;
    gameId: string;
    dueDate: Date | null;
    game: {
      id: string;
      name: string;
      gameType: string;
    };
  }>;
}

export interface CreateGroupInput {
  name: string;
  ageRange?: string;
  subjectArea?: string;
}

export interface UpdateGroupInput {
  name?: string;
  ageRange?: string;
  subjectArea?: string;
}
