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

// Demo Students
export const demoStudents: DemoStudent[] = [
  { id: 's1', name: 'Sarah Jones', email: 'sarah@email.com', joinedAt: '2026-01-17', lastActive: '2026-01-31', classIds: ['c1'] },
  { id: 's2', name: 'Tom Smith', email: 'tom@email.com', joinedAt: '2026-01-24', lastActive: '2026-01-30', classIds: ['c1'] },
  { id: 's3', name: 'Emma Brown', email: 'emma@email.com', joinedAt: '2026-01-28', lastActive: '2026-01-29', classIds: ['c1'] },
  { id: 's4', name: 'Jake Wilson', email: 'jake@email.com', joinedAt: '2026-01-20', lastActive: '2026-01-31', classIds: ['c1', 'c2'] },
  { id: 's5', name: 'Lily Chen', email: 'lily@email.com', joinedAt: '2026-01-15', lastActive: '2026-01-31', classIds: ['c1'] },
  { id: 's6', name: 'Oliver Davis', email: 'oliver@email.com', joinedAt: '2026-01-22', lastActive: '2026-01-28', classIds: ['c1', 'c2'] },
  { id: 's7', name: 'Sophie Taylor', email: 'sophie@email.com', joinedAt: '2026-01-19', lastActive: '2026-01-31', classIds: ['c1', 'c3'] },
  { id: 's8', name: 'Noah Martinez', email: 'noah@email.com', joinedAt: '2026-01-25', lastActive: '2026-01-30', classIds: ['c1'] },
  { id: 's9', name: 'Ava Johnson', email: 'ava@email.com', joinedAt: '2026-01-18', lastActive: '2026-01-31', classIds: ['c2'] },
  { id: 's10', name: 'Ethan Williams', email: 'ethan@email.com', joinedAt: '2026-01-21', lastActive: '2026-01-29', classIds: ['c2'] },
  { id: 's11', name: 'Mia Anderson', email: 'mia@email.com', joinedAt: '2026-01-16', lastActive: '2026-01-31', classIds: ['c3'] },
  { id: 's12', name: 'Lucas Thompson', email: 'lucas@email.com', joinedAt: '2026-01-23', lastActive: '2026-01-30', classIds: ['c3'] },
];

// Demo Classes
export const demoClasses: DemoClass[] = [
  {
    id: 'c1',
    name: 'Year 7 Maths',
    subject: 'Maths',
    ageRange: '12-14',
    description: 'Core mathematics for Year 7 students',
    joinCode: 'ABC123',
    tutorId: 'tutor-demo',
    studentIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
    createdAt: '2026-01-10',
  },
  {
    id: 'c2',
    name: 'Year 8 Science',
    subject: 'Science',
    ageRange: '12-14',
    description: 'Biology, Chemistry, and Physics fundamentals',
    joinCode: 'DEF456',
    tutorId: 'tutor-demo',
    studentIds: ['s4', 's6', 's9', 's10'],
    createdAt: '2026-01-12',
  },
  {
    id: 'c3',
    name: 'GCSE English',
    subject: 'English',
    ageRange: '15-18',
    description: 'GCSE English Language and Literature prep',
    joinCode: 'GHI789',
    tutorId: 'tutor-demo',
    studentIds: ['s7', 's11', 's12', 's1', 's2', 's3'],
    createdAt: '2026-01-14',
  },
];

// Times Tables Quiz Questions
const timesTablesQuestions: MultipleChoiceQuestion[] = [
  { id: 'tt1', question: 'What is 7 × 8?', options: ['54', '56', '63', '48'], correctIndex: 1 },
  { id: 'tt2', question: 'What is 9 × 6?', options: ['54', '45', '63', '56'], correctIndex: 0 },
  { id: 'tt3', question: 'What is 12 × 7?', options: ['72', '84', '96', '78'], correctIndex: 1 },
  { id: 'tt4', question: 'What is 8 × 9?', options: ['64', '81', '72', '63'], correctIndex: 2 },
  { id: 'tt5', question: 'What is 11 × 12?', options: ['121', '132', '144', '120'], correctIndex: 1 },
  { id: 'tt6', question: 'What is 6 × 7?', options: ['42', '48', '36', '49'], correctIndex: 0 },
  { id: 'tt7', question: 'What is 4 × 9?', options: ['32', '45', '36', '40'], correctIndex: 2 },
  { id: 'tt8', question: 'What is 5 × 8?', options: ['35', '40', '45', '48'], correctIndex: 1 },
  { id: 'tt9', question: 'What is 3 × 12?', options: ['32', '36', '39', '33'], correctIndex: 1 },
  { id: 'tt10', question: 'What is 7 × 7?', options: ['42', '56', '49', '47'], correctIndex: 2 },
];

// Capital Cities Quiz Questions
const capitalCitiesQuestions: MultipleChoiceQuestion[] = [
  { id: 'cc1', question: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correctIndex: 1 },
  { id: 'cc2', question: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Hiroshima'], correctIndex: 2 },
  { id: 'cc3', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
  { id: 'cc4', question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correctIndex: 2 },
  { id: 'cc5', question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], correctIndex: 3 },
  { id: 'cc6', question: 'What is the capital of Germany?', options: ['Munich', 'Frankfurt', 'Hamburg', 'Berlin'], correctIndex: 3 },
  { id: 'cc7', question: 'What is the capital of Italy?', options: ['Milan', 'Rome', 'Venice', 'Florence'], correctIndex: 1 },
  { id: 'cc8', question: 'What is the capital of Spain?', options: ['Barcelona', 'Seville', 'Madrid', 'Valencia'], correctIndex: 2 },
  { id: 'cc9', question: 'What is the capital of China?', options: ['Shanghai', 'Beijing', 'Hong Kong', 'Guangzhou'], correctIndex: 1 },
  { id: 'cc10', question: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'Chennai', 'New Delhi'], correctIndex: 3 },
  { id: 'cc11', question: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Luxor', 'Giza'], correctIndex: 1 },
  { id: 'cc12', question: 'What is the capital of Russia?', options: ['St. Petersburg', 'Moscow', 'Sochi', 'Kazan'], correctIndex: 1 },
  { id: 'cc13', question: 'What is the capital of South Korea?', options: ['Busan', 'Incheon', 'Seoul', 'Daegu'], correctIndex: 2 },
  { id: 'cc14', question: 'What is the capital of Mexico?', options: ['Guadalajara', 'Cancun', 'Mexico City', 'Monterrey'], correctIndex: 2 },
  { id: 'cc15', question: 'What is the capital of Argentina?', options: ['Córdoba', 'Buenos Aires', 'Rosario', 'Mendoza'], correctIndex: 1 },
];

// Quick Maths Challenge Questions
const quickMathsQuestions: MultipleChoiceQuestion[] = [
  { id: 'qm1', question: 'What is 15 + 27?', options: ['41', '42', '43', '44'], correctIndex: 1 },
  { id: 'qm2', question: 'What is 100 - 37?', options: ['63', '73', '67', '57'], correctIndex: 0 },
  { id: 'qm3', question: 'What is 8 × 15?', options: ['110', '115', '120', '125'], correctIndex: 2 },
  { id: 'qm4', question: 'What is 144 ÷ 12?', options: ['11', '12', '13', '14'], correctIndex: 1 },
  { id: 'qm5', question: 'What is 25²?', options: ['525', '625', '725', '425'], correctIndex: 1 },
  { id: 'qm6', question: 'What is √81?', options: ['7', '8', '9', '10'], correctIndex: 2 },
  { id: 'qm7', question: 'What is 3³?', options: ['9', '18', '27', '81'], correctIndex: 2 },
  { id: 'qm8', question: 'What is 50% of 84?', options: ['40', '41', '42', '44'], correctIndex: 2 },
  { id: 'qm9', question: 'What is 1/4 of 100?', options: ['20', '25', '30', '40'], correctIndex: 1 },
  { id: 'qm10', question: 'What is 17 + 28 + 15?', options: ['58', '59', '60', '61'], correctIndex: 2 },
  { id: 'qm11', question: 'What is 200 - 65?', options: ['125', '130', '135', '140'], correctIndex: 2 },
  { id: 'qm12', question: 'What is 6 × 17?', options: ['96', '98', '100', '102'], correctIndex: 3 },
];

// Vocabulary Builder Flashcards
const vocabularyFlashcards: FlashcardQuestion[] = [
  { id: 'vb1', front: 'Ephemeral', back: 'Lasting for a very short time' },
  { id: 'vb2', front: 'Ubiquitous', back: 'Present, appearing, or found everywhere' },
  { id: 'vb3', front: 'Pragmatic', back: 'Dealing with things sensibly and realistically' },
  { id: 'vb4', front: 'Ambiguous', back: 'Open to more than one interpretation; unclear' },
  { id: 'vb5', front: 'Eloquent', back: 'Fluent or persuasive in speaking or writing' },
  { id: 'vb6', front: 'Resilient', back: 'Able to recover quickly from difficulties' },
  { id: 'vb7', front: 'Meticulous', back: 'Showing great attention to detail; very careful' },
  { id: 'vb8', front: 'Profound', back: 'Very great or intense; having deep meaning' },
  { id: 'vb9', front: 'Benevolent', back: 'Well-meaning and kindly' },
  { id: 'vb10', front: 'Capricious', back: 'Given to sudden and unaccountable changes of mood' },
  { id: 'vb11', front: 'Diligent', back: 'Having or showing care in one\'s work or duties' },
  { id: 'vb12', front: 'Empirical', back: 'Based on observation or experience rather than theory' },
  { id: 'vb13', front: 'Futile', back: 'Incapable of producing any useful result; pointless' },
  { id: 'vb14', front: 'Gregarious', back: 'Fond of company; sociable' },
  { id: 'vb15', front: 'Hypothetical', back: 'Based on a suggested idea, not proven' },
  { id: 'vb16', front: 'Imminent', back: 'About to happen' },
  { id: 'vb17', front: 'Juxtapose', back: 'Place close together for contrasting effect' },
  { id: 'vb18', front: 'Kinetic', back: 'Relating to or resulting from motion' },
  { id: 'vb19', front: 'Lethargic', back: 'Affected by lethargy; sluggish and apathetic' },
  { id: 'vb20', front: 'Malevolent', back: 'Having or showing a wish to do evil to others' },
];

// Science Facts Flashcards
const scienceFactsFlashcards: FlashcardQuestion[] = [
  { id: 'sf1', front: 'What is the chemical symbol for water?', back: 'H₂O' },
  { id: 'sf2', front: 'What is the powerhouse of the cell?', back: 'Mitochondria' },
  { id: 'sf3', front: 'What is the speed of light?', back: 'Approximately 299,792 km/s' },
  { id: 'sf4', front: 'What is the largest organ in the human body?', back: 'The skin' },
  { id: 'sf5', front: 'What is the chemical symbol for gold?', back: 'Au (from Latin "aurum")' },
  { id: 'sf6', front: 'What is photosynthesis?', back: 'The process plants use to convert light energy into chemical energy' },
  { id: 'sf7', front: 'What is Newton\'s First Law?', back: 'An object at rest stays at rest unless acted upon by an external force' },
  { id: 'sf8', front: 'What are the three states of matter?', back: 'Solid, Liquid, Gas' },
];

// Demo Games
export const demoGames: DemoGame[] = [
  {
    id: 'g1',
    name: 'Times Tables Practice',
    type: 'multiple-choice',
    subject: 'Maths',
    description: 'Master your multiplication tables from 1 to 12',
    questions: timesTablesQuestions,
    tutorId: 'tutor-demo',
    timesAssigned: 5,
    createdAt: '2026-01-15',
  },
  {
    id: 'g2',
    name: 'Capital Cities Quiz',
    type: 'multiple-choice',
    subject: 'Geography',
    description: 'Test your knowledge of world capitals',
    questions: capitalCitiesQuestions,
    tutorId: 'tutor-demo',
    timesAssigned: 3,
    createdAt: '2026-01-16',
  },
  {
    id: 'g3',
    name: 'Vocabulary Builder',
    type: 'flashcards',
    subject: 'English',
    description: 'Advanced vocabulary for GCSE English',
    questions: vocabularyFlashcards,
    tutorId: 'tutor-demo',
    timesAssigned: 4,
    createdAt: '2026-01-17',
  },
  {
    id: 'g4',
    name: 'Quick Maths Challenge',
    type: 'multiple-choice',
    subject: 'Maths',
    description: 'Fast-paced mental maths practice',
    questions: quickMathsQuestions,
    tutorId: 'tutor-demo',
    timesAssigned: 2,
    createdAt: '2026-01-18',
  },
  {
    id: 'g5',
    name: 'Science Facts Review',
    type: 'flashcards',
    subject: 'Science',
    description: 'Key science facts and concepts',
    questions: scienceFactsFlashcards,
    tutorId: 'tutor-demo',
    timesAssigned: 3,
    createdAt: '2026-01-19',
  },
];

// Demo Assignments
export const demoAssignments: DemoAssignment[] = [
  { id: 'a1', gameId: 'g1', classId: 'c1', dueDate: '2026-02-01', passPercentage: 70, createdAt: '2026-01-25' },
  { id: 'a2', gameId: 'g2', classId: 'c2', dueDate: '2026-02-03', passPercentage: 60, createdAt: '2026-01-26' },
  { id: 'a3', gameId: 'g3', classId: 'c3', dueDate: '2026-02-07', createdAt: '2026-01-27' },
  { id: 'a4', gameId: 'g4', classId: 'c1', dueDate: '2026-02-05', passPercentage: 75, createdAt: '2026-01-28' },
  { id: 'a5', gameId: 'g5', classId: 'c2', dueDate: '2026-02-10', createdAt: '2026-01-29' },
  { id: 'a6', gameId: 'g1', classId: 'c2', dueDate: '2026-01-28', passPercentage: 70, createdAt: '2026-01-20' },
  { id: 'a7', gameId: 'g3', classId: 'c1', dueDate: '2026-02-12', createdAt: '2026-01-30' },
  { id: 'a8', gameId: 'g2', classId: 'c3', dueDate: '2026-02-08', passPercentage: 65, createdAt: '2026-01-30' },
];

// Demo Student Progress
export const demoStudentProgress: StudentProgress[] = [
  // Assignment 1 (Times Tables - Year 7 Maths) - mostly completed
  { id: 'p1', studentId: 's1', assignmentId: 'a1', status: 'completed', score: 85, attempts: 2, timeSpent: 260, lastPlayedAt: '2026-01-31' },
  { id: 'p2', studentId: 's2', assignmentId: 'a1', status: 'completed', score: 92, attempts: 1, timeSpent: 195, lastPlayedAt: '2026-01-30' },
  { id: 'p3', studentId: 's3', assignmentId: 'a1', status: 'in-progress', score: 45, attempts: 1, lastPlayedAt: '2026-01-29' },
  { id: 'p4', studentId: 's4', assignmentId: 'a1', status: 'not-started', attempts: 0 },
  { id: 'p5', studentId: 's5', assignmentId: 'a1', status: 'completed', score: 78, attempts: 3, timeSpent: 320, lastPlayedAt: '2026-01-31' },
  { id: 'p6', studentId: 's6', assignmentId: 'a1', status: 'completed', score: 88, attempts: 1, timeSpent: 210, lastPlayedAt: '2026-01-28' },
  { id: 'p7', studentId: 's7', assignmentId: 'a1', status: 'completed', score: 95, attempts: 1, timeSpent: 180, lastPlayedAt: '2026-01-31' },
  { id: 'p8', studentId: 's8', assignmentId: 'a1', status: 'not-started', attempts: 0 },

  // Assignment 2 (Capital Cities - Year 8 Science) - half completed
  { id: 'p9', studentId: 's4', assignmentId: 'a2', status: 'completed', score: 68, attempts: 2, timeSpent: 310, lastPlayedAt: '2026-01-30' },
  { id: 'p10', studentId: 's6', assignmentId: 'a2', status: 'in-progress', score: 40, attempts: 1, lastPlayedAt: '2026-01-29' },
  { id: 'p11', studentId: 's9', assignmentId: 'a2', status: 'not-started', attempts: 0 },
  { id: 'p12', studentId: 's10', assignmentId: 'a2', status: 'completed', score: 73, attempts: 1, timeSpent: 280, lastPlayedAt: '2026-01-31' },

  // Assignment 3 (Vocabulary - GCSE English) - just started
  { id: 'p13', studentId: 's7', assignmentId: 'a3', status: 'not-started', attempts: 0 },
  { id: 'p14', studentId: 's11', assignmentId: 'a3', status: 'not-started', attempts: 0 },
  { id: 'p15', studentId: 's12', assignmentId: 'a3', status: 'not-started', attempts: 0 },
  { id: 'p16', studentId: 's1', assignmentId: 'a3', status: 'not-started', attempts: 0 },
  { id: 'p17', studentId: 's2', assignmentId: 'a3', status: 'not-started', attempts: 0 },
  { id: 'p18', studentId: 's3', assignmentId: 'a3', status: 'not-started', attempts: 0 },

  // Assignment 6 (Times Tables - Year 8 Science - past due) - all completed
  { id: 'p19', studentId: 's4', assignmentId: 'a6', status: 'completed', score: 82, attempts: 1, timeSpent: 220, lastPlayedAt: '2026-01-27' },
  { id: 'p20', studentId: 's6', assignmentId: 'a6', status: 'completed', score: 90, attempts: 1, timeSpent: 190, lastPlayedAt: '2026-01-26' },
  { id: 'p21', studentId: 's9', assignmentId: 'a6', status: 'completed', score: 75, attempts: 2, timeSpent: 340, lastPlayedAt: '2026-01-28' },
  { id: 'p22', studentId: 's10', assignmentId: 'a6', status: 'completed', score: 88, attempts: 1, timeSpent: 205, lastPlayedAt: '2026-01-27' },
];

// Demo Activity Feed
export const demoActivityFeed: ActivityItem[] = [
  { id: 'act1', type: 'assignment-completed', message: 'Sarah completed "Times Tables Practice" - 85%', timestamp: '2026-01-31T14:30:00' },
  { id: 'act2', type: 'student-joined', message: 'Tom joined "Year 7 Maths"', timestamp: '2026-01-31T11:15:00' },
  { id: 'act3', type: 'assignment-created', message: 'New assignment created for "Year 8 Science"', timestamp: '2026-01-30T16:45:00' },
  { id: 'act4', type: 'assignment-completed', message: 'Sophie completed "Times Tables Practice" - 95%', timestamp: '2026-01-30T10:20:00' },
  { id: 'act5', type: 'game-created', message: 'New game "Science Facts Review" created', timestamp: '2026-01-29T09:00:00' },
  { id: 'act6', type: 'class-created', message: 'New class "GCSE English" created', timestamp: '2026-01-28T14:00:00' },
];

// Student demo data - what student@studybug.io sees
export const demoStudentUser = {
  id: 'student-demo',
  name: 'Alex Demo',
  email: 'student@studybug.io',
  classIds: ['c1', 'c2'],
  joinedAt: '2026-01-20',
};

export const demoStudentScores = [
  { id: 'score1', gameId: 'g1', gameName: 'Times Tables Practice', classId: 'c1', className: 'Year 7 Maths', score: 85, date: '2026-01-31', timeSpent: 260 },
  { id: 'score2', gameId: 'g2', gameName: 'Capital Cities Quiz', classId: 'c2', className: 'Year 8 Science', score: 68, date: '2026-01-30', timeSpent: 310 },
  { id: 'score3', gameId: 'g1', gameName: 'Times Tables Practice', classId: 'c1', className: 'Year 7 Maths', score: 72, date: '2026-01-28', timeSpent: 345 },
  { id: 'score4', gameId: 'g4', gameName: 'Quick Maths Challenge', classId: 'c1', className: 'Year 7 Maths', score: 78, date: '2026-01-27', timeSpent: 280 },
  { id: 'score5', gameId: 'g1', gameName: 'Times Tables Practice', classId: 'c2', className: 'Year 8 Science', score: 82, date: '2026-01-26', timeSpent: 220 },
  { id: 'score6', gameId: 'g5', gameName: 'Science Facts Review', classId: 'c2', className: 'Year 8 Science', score: 90, date: '2026-01-25', timeSpent: 180 },
  { id: 'score7', gameId: 'g2', gameName: 'Capital Cities Quiz', classId: 'c2', className: 'Year 8 Science', score: 55, date: '2026-01-24', timeSpent: 380 },
  { id: 'score8', gameId: 'g1', gameName: 'Times Tables Practice', classId: 'c1', className: 'Year 7 Maths', score: 65, date: '2026-01-22', timeSpent: 400 },
];

// Student assignments - what student@studybug.io sees
export const demoStudentAssignments = [
  { 
    id: 'sa1', 
    assignmentId: 'a1', 
    gameId: 'g1', 
    gameName: 'Times Tables Practice', 
    gameType: 'multiple-choice' as const,
    classId: 'c1', 
    className: 'Year 7 Maths', 
    dueDate: '2026-02-01', 
    status: 'completed' as const, 
    score: 85, 
    attempts: 2 
  },
  { 
    id: 'sa2', 
    assignmentId: 'a2', 
    gameId: 'g2', 
    gameName: 'Capital Cities Quiz', 
    gameType: 'multiple-choice' as const,
    classId: 'c2', 
    className: 'Year 8 Science', 
    dueDate: '2026-02-03', 
    status: 'in-progress' as const, 
    score: 40, 
    attempts: 1 
  },
  { 
    id: 'sa3', 
    assignmentId: 'a4', 
    gameId: 'g4', 
    gameName: 'Quick Maths Challenge', 
    gameType: 'multiple-choice' as const,
    classId: 'c1', 
    className: 'Year 7 Maths', 
    dueDate: '2026-02-05', 
    status: 'not-started' as const, 
    attempts: 0 
  },
  { 
    id: 'sa4', 
    assignmentId: 'a5', 
    gameId: 'g5', 
    gameName: 'Science Facts Review', 
    gameType: 'flashcards' as const,
    classId: 'c2', 
    className: 'Year 8 Science', 
    dueDate: '2026-02-10', 
    status: 'not-started' as const, 
    attempts: 0 
  },
  { 
    id: 'sa5', 
    assignmentId: 'a7', 
    gameId: 'g3', 
    gameName: 'Vocabulary Builder', 
    gameType: 'flashcards' as const,
    classId: 'c1', 
    className: 'Year 7 Maths', 
    dueDate: '2026-02-12', 
    status: 'not-started' as const, 
    attempts: 0 
  },
  { 
    id: 'sa6', 
    assignmentId: 'a6', 
    gameId: 'g1', 
    gameName: 'Times Tables Practice', 
    gameType: 'multiple-choice' as const,
    classId: 'c2', 
    className: 'Year 8 Science', 
    dueDate: '2026-01-28', 
    status: 'completed' as const, 
    score: 82, 
    attempts: 1 
  },
];
