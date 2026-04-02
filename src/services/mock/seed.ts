import { Game, GameType, FlashcardsGameData, PairsGameData, SwipeGameData, SplatGameData } from '@/types/game';
import { Group, GroupWithDetails, GroupMember } from '@/types/group';
import { Assignment, GameAttempt, StudentAssignment } from '@/types/assignment';

// Tutor user - matches DEV_TUTOR_SESSION
export const SEED_TUTOR = {
  id: 'tutor-profile-1',
  userId: 'tutor-dev-1',
  name: 'Alex Thompson',
  email: 'tutor@dev.local',
};

// Students
export const SEED_STUDENTS = [
  { id: 'student-profile-1', userId: 'student-dev-1', name: 'Emma Wilson', email: 'student@dev.local', joinCode: 'EMW001' },
  { id: 'student-profile-2', userId: 'student-dev-2', name: 'Jack Davies', email: 'jack@dev.local', joinCode: 'JKD002' },
  { id: 'student-profile-3', userId: 'student-dev-3', name: 'Sophie Chen', email: 'sophie@dev.local', joinCode: 'SPC003' },
];

const NOW = new Date('2026-04-02T12:00:00Z');
const PAST = new Date('2026-01-01T12:00:00Z');
const FUTURE = new Date('2026-05-01T12:00:00Z');

// Games - one per type
const flashcardsData: FlashcardsGameData = {
  description: 'Practice your multiplication tables',
  cards: [
    { id: 'fc1', front: '6 x 7', back: '42' },
    { id: 'fc2', front: '8 x 9', back: '72' },
    { id: 'fc3', front: '7 x 8', back: '56' },
    { id: 'fc4', front: '9 x 6', back: '54' },
    { id: 'fc5', front: '12 x 12', back: '144' },
  ],
};

const pairsData: PairsGameData = {
  description: 'Match French words with their English translations',
  items: [
    { id: 'p1', leftText: 'Bonjour', rightText: 'Hello' },
    { id: 'p2', leftText: 'Merci', rightText: 'Thank you' },
    { id: 'p3', leftText: 'Au revoir', rightText: 'Goodbye' },
    { id: 'p4', leftText: 'Oui', rightText: 'Yes' },
    { id: 'p5', leftText: 'Non', rightText: 'No' },
    { id: 'p6', leftText: 'S\'il vous plait', rightText: 'Please' },
  ],
};

const swipeData: SwipeGameData = {
  description: 'Swipe right if the statement is true, left if false',
  items: [
    { id: 'sw1', statement: 'The capital of France is Paris', isCorrect: true },
    { id: 'sw2', statement: 'The capital of Spain is Barcelona', isCorrect: false, explanation: 'The capital of Spain is Madrid' },
    { id: 'sw3', statement: 'The capital of Germany is Berlin', isCorrect: true },
    { id: 'sw4', statement: 'The capital of Italy is Venice', isCorrect: false, explanation: 'The capital of Italy is Rome' },
    { id: 'sw5', statement: 'The capital of Japan is Tokyo', isCorrect: true },
    { id: 'sw6', statement: 'The capital of Australia is Sydney', isCorrect: false, explanation: 'The capital of Australia is Canberra' },
  ],
};

const splatData: SplatGameData = {
  description: 'Solve the algebra problems quickly!',
  timeLimit: 10,
  items: [
    { id: 'sp1', question: 'What is x if 2x = 10?', answer: '5' },
    { id: 'sp2', question: 'What is x if x + 7 = 12?', answer: '5' },
    { id: 'sp3', question: 'What is x if 3x = 15?', answer: '5' },
    { id: 'sp4', question: 'What is x if x - 4 = 6?', answer: '10' },
    { id: 'sp5', question: 'What is x if 4x = 20?', answer: '5' },
  ],
};

export const SEED_GAMES: Game[] = [
  {
    id: 'game-1',
    userId: 'tutor-dev-1',
    name: 'Times Tables',
    gameType: GameType.FLASHCARDS,
    gameData: JSON.stringify(flashcardsData),
    createdAt: PAST,
    updatedAt: PAST,
    _count: { assignments: 2 },
  },
  {
    id: 'game-2',
    userId: 'tutor-dev-1',
    name: 'French Vocabulary',
    gameType: GameType.PAIRS,
    gameData: JSON.stringify(pairsData),
    createdAt: PAST,
    updatedAt: PAST,
    _count: { assignments: 1 },
  },
  {
    id: 'game-3',
    userId: 'tutor-dev-1',
    name: 'Capital Cities',
    gameType: GameType.SWIPE,
    gameData: JSON.stringify(swipeData),
    createdAt: PAST,
    updatedAt: PAST,
    _count: { assignments: 1 },
  },
  {
    id: 'game-4',
    userId: 'tutor-dev-1',
    name: 'Algebra Basics',
    gameType: GameType.SPLAT,
    gameData: JSON.stringify(splatData),
    createdAt: PAST,
    updatedAt: PAST,
    _count: { assignments: 0 },
  },
];

// Group members
const GROUP_1_MEMBERS: GroupMember[] = [
  {
    id: 'member-1',
    groupId: 'group-1',
    studentId: 'student-profile-1',
    joinedAt: PAST,
    student: { id: 'student-profile-1', user: { id: 'student-dev-1', email: 'student@dev.local' } },
  },
  {
    id: 'member-2',
    groupId: 'group-1',
    studentId: 'student-profile-2',
    joinedAt: PAST,
    student: { id: 'student-profile-2', user: { id: 'student-dev-2', email: 'jack@dev.local' } },
  },
];

const GROUP_2_MEMBERS: GroupMember[] = [
  {
    id: 'member-3',
    groupId: 'group-2',
    studentId: 'student-profile-2',
    joinedAt: PAST,
    student: { id: 'student-profile-2', user: { id: 'student-dev-2', email: 'jack@dev.local' } },
  },
  {
    id: 'member-4',
    groupId: 'group-2',
    studentId: 'student-profile-3',
    joinedAt: PAST,
    student: { id: 'student-profile-3', user: { id: 'student-dev-3', email: 'sophie@dev.local' } },
  },
];

export const SEED_GROUPS: Group[] = [
  {
    id: 'group-1',
    tutorId: 'tutor-dev-1',
    name: 'Year 8 Maths',
    ageRange: '12-13',
    subjectArea: 'Mathematics',
    joinCode: 'Y8M001',
    createdAt: PAST,
    updatedAt: PAST,
    _count: { members: 2, assignments: 2 },
  },
  {
    id: 'group-2',
    tutorId: 'tutor-dev-1',
    name: 'GCSE French',
    ageRange: '14-16',
    subjectArea: 'French',
    joinCode: 'GCF002',
    createdAt: PAST,
    updatedAt: PAST,
    _count: { members: 2, assignments: 1 },
  },
];

export const SEED_GROUPS_WITH_DETAILS: GroupWithDetails[] = [
  {
    ...SEED_GROUPS[0],
    members: GROUP_1_MEMBERS,
    assignments: [
      { id: 'assignment-1', gameId: 'game-1', dueDate: FUTURE, passPercentage: 70, game: { id: 'game-1', name: 'Times Tables', gameType: GameType.FLASHCARDS } },
      { id: 'assignment-2', gameId: 'game-3', dueDate: null, passPercentage: null, game: { id: 'game-3', name: 'Capital Cities', gameType: GameType.SWIPE } },
    ],
  },
  {
    ...SEED_GROUPS[1],
    members: GROUP_2_MEMBERS,
    assignments: [
      { id: 'assignment-3', gameId: 'game-2', dueDate: FUTURE, passPercentage: 60, game: { id: 'game-2', name: 'French Vocabulary', gameType: GameType.PAIRS } },
    ],
  },
];

// Assignments
export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assignment-1',
    gameId: 'game-1',
    groupId: 'group-1',
    dueDate: FUTURE,
    passPercentage: 70,
    createdAt: PAST,
    updatedAt: PAST,
    game: SEED_GAMES[0] as any,
    group: SEED_GROUPS[0],
  },
  {
    id: 'assignment-2',
    gameId: 'game-3',
    groupId: 'group-1',
    dueDate: null,
    passPercentage: null,
    createdAt: PAST,
    updatedAt: PAST,
    game: SEED_GAMES[2] as any,
    group: SEED_GROUPS[0],
  },
  {
    id: 'assignment-3',
    gameId: 'game-2',
    groupId: 'group-2',
    dueDate: FUTURE,
    passPercentage: 60,
    createdAt: PAST,
    updatedAt: PAST,
    game: SEED_GAMES[1] as any,
    group: SEED_GROUPS[1],
  },
];

// Game attempts for student-1 (Emma)
export const SEED_GAME_ATTEMPTS: GameAttempt[] = [
  {
    id: 'attempt-1',
    assignmentId: 'assignment-1',
    studentId: 'student-profile-1',
    scorePercentage: 80,
    timeTaken: 120,
    completedAt: new Date('2026-03-15T10:00:00Z'),
    attemptData: JSON.stringify({ totalCards: 5, knownCards: 4, unknownCards: 1, reviewedAll: true }),
  },
  {
    id: 'attempt-2',
    assignmentId: 'assignment-2',
    studentId: 'student-profile-1',
    scorePercentage: 67,
    timeTaken: 90,
    completedAt: new Date('2026-03-20T14:00:00Z'),
    attemptData: JSON.stringify({ correctAnswers: 4, totalQuestions: 6 }),
  },
];
