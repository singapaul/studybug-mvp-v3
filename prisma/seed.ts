import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { GameType } from '../src/types/game';

const prisma = new PrismaClient();

// Helper to generate consistent IDs
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${faker.string.alphanumeric(9)}`;
}

// Helper to generate join code
function generateJoinCode(): string {
  return faker.string.alphanumeric({ length: 6, casing: 'upper' });
}

// Helper to add/subtract days from date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.gameAttempt.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.game.deleteMany();
  await prisma.group.deleteMany();
  await prisma.student.deleteMany();
  await prisma.tutor.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleared\n');

  // ========================================
  // USERS & PROFILES
  // ========================================
  console.log('👥 Creating users and profiles...');

  // Dummy password hash for demo accounts (password: "demo123")
  const demoPasswordHash = '$2a$10$dummyhashforexampleonly1234567890';

  // Tutor 1 - Math Teacher
  const tutor1User = await prisma.user.create({
    data: {
      id: generateId('user'),
      email: 'tutor1@example.com',
      passwordHash: demoPasswordHash,
      role: 'TUTOR',
    },
  });

  const tutor1 = await prisma.tutor.create({
    data: {
      id: generateId('tutor'),
      userId: tutor1User.id,
      subscriptionStatus: 'FREE',
    },
  });

  // Tutor 2 - Science Teacher
  const tutor2User = await prisma.user.create({
    data: {
      id: generateId('user'),
      email: 'tutor2@example.com',
      passwordHash: demoPasswordHash,
      role: 'TUTOR',
    },
  });

  const tutor2 = await prisma.tutor.create({
    data: {
      id: generateId('tutor'),
      userId: tutor2User.id,
      subscriptionStatus: 'FREE',
    },
  });

  // Students
  const students = [];
  const studentNames = [
    { first: 'Emma', last: 'Wilson' },
    { first: 'Liam', last: 'Brown' },
    { first: 'Olivia', last: 'Martinez' },
    { first: 'Noah', last: 'Garcia' },
    { first: 'Ava', last: 'Davis' },
    { first: 'Ethan', last: 'Rodriguez' },
    { first: 'Sophia', last: 'Lopez' },
    { first: 'Mason', last: 'Gonzalez' },
  ];

  for (let i = 0; i < 8; i++) {
    const user = await prisma.user.create({
      data: {
        id: generateId('user'),
        email: `student${i + 1}@example.com`,
        passwordHash: demoPasswordHash,
        role: 'STUDENT',
      },
    });

    const student = await prisma.student.create({
      data: {
        id: generateId('student'),
        userId: user.id,
      },
    });

    students.push(student);
  }

  console.log(`✅ Created 2 tutors and 8 students\n`);

  // ========================================
  // GROUPS
  // ========================================
  console.log('📚 Creating groups...');

  const group1 = await prisma.group.create({
    data: {
      id: generateId('group'),
      tutorId: tutor1.id,
      name: 'Grade 5 Math',
      ageRange: '10-11',
      subjectArea: 'Mathematics',
      joinCode: 'MATH01',
    },
  });

  const group2 = await prisma.group.create({
    data: {
      id: generateId('group'),
      tutorId: tutor1.id,
      name: 'Algebra Basics',
      ageRange: '11-12',
      subjectArea: 'Mathematics',
      joinCode: 'ALG101',
    },
  });

  const group3 = await prisma.group.create({
    data: {
      id: generateId('group'),
      tutorId: tutor2.id,
      name: 'Science Explorers',
      ageRange: '10-12',
      subjectArea: 'Science',
      joinCode: 'SCI999',
    },
  });

  console.log('✅ Created 3 groups\n');

  // ========================================
  // GROUP MEMBERS
  // ========================================
  console.log('🔗 Adding students to groups...');

  // Grade 5 Math - 4 students
  for (let i = 0; i < 4; i++) {
    await prisma.groupMember.create({
      data: {
        id: generateId('member'),
        groupId: group1.id,
        studentId: students[i].id,
        joinedAt: faker.date.past({ years: 0.5 }),
      },
    });
  }

  // Algebra Basics - 3 students
  for (let i = 4; i < 7; i++) {
    await prisma.groupMember.create({
      data: {
        id: generateId('member'),
        groupId: group2.id,
        studentId: students[i].id,
        joinedAt: faker.date.past({ years: 0.3 }),
      },
    });
  }

  // Science Explorers - 5 students (overlap with other groups)
  const scienceStudentIndices = [0, 2, 4, 6, 7];
  for (const i of scienceStudentIndices) {
    await prisma.groupMember.create({
      data: {
        id: generateId('member'),
        groupId: group3.id,
        studentId: students[i].id,
        joinedAt: faker.date.past({ years: 0.2 }),
      },
    });
  }

  console.log('✅ Added students to groups\n');

  // ========================================
  // GAMES
  // ========================================
  console.log('🎮 Creating games...');

  // PAIRS - Multiplication Tables
  const pairsGame = await prisma.game.create({
    data: {
      id: generateId('game'),
      tutorId: tutor1.id,
      name: 'Multiplication Tables',
      gameType: GameType.PAIRS,
      gameData: JSON.stringify({
        description: 'Match multiplication problems with their answers',
        items: [
          { id: '1', leftText: '3 × 4', rightText: '12' },
          { id: '2', leftText: '6 × 7', rightText: '42' },
          { id: '3', leftText: '8 × 9', rightText: '72' },
          { id: '4', leftText: '5 × 6', rightText: '30' },
          { id: '5', leftText: '7 × 8', rightText: '56' },
          { id: '6', leftText: '9 × 9', rightText: '81' },
          { id: '7', leftText: '4 × 5', rightText: '20' },
          { id: '8', leftText: '6 × 6', rightText: '36' },
          { id: '9', leftText: '7 × 9', rightText: '63' },
          { id: '10', leftText: '8 × 8', rightText: '64' },
          { id: '11', leftText: '3 × 7', rightText: '21' },
          { id: '12', leftText: '5 × 9', rightText: '45' },
        ],
      }),
    },
  });

  // FLASHCARDS - States and Capitals
  const flashcardsGame = await prisma.game.create({
    data: {
      id: generateId('game'),
      tutorId: tutor1.id,
      name: 'States and Capitals',
      gameType: GameType.FLASHCARDS,
      gameData: JSON.stringify({
        description: 'Learn US state capitals',
        cards: [
          { id: '1', front: 'California', back: 'Sacramento' },
          { id: '2', front: 'Texas', back: 'Austin' },
          { id: '3', front: 'New York', back: 'Albany' },
          { id: '4', front: 'Florida', back: 'Tallahassee' },
          { id: '5', front: 'Illinois', back: 'Springfield' },
          { id: '6', front: 'Pennsylvania', back: 'Harrisburg' },
          { id: '7', front: 'Ohio', back: 'Columbus' },
          { id: '8', front: 'Georgia', back: 'Atlanta' },
          { id: '9', front: 'North Carolina', back: 'Raleigh' },
          { id: '10', front: 'Michigan', back: 'Lansing' },
          { id: '11', front: 'Massachusetts', back: 'Boston' },
          { id: '12', front: 'Washington', back: 'Olympia' },
          { id: '13', front: 'Arizona', back: 'Phoenix' },
          { id: '14', front: 'Virginia', back: 'Richmond' },
          { id: '15', front: 'Colorado', back: 'Denver' },
          { id: '16', front: 'Tennessee', back: 'Nashville' },
          { id: '17', front: 'Maryland', back: 'Annapolis' },
          { id: '18', front: 'Oregon', back: 'Salem' },
          { id: '19', front: 'Nevada', back: 'Carson City' },
          { id: '20', front: 'Wisconsin', back: 'Madison' },
        ],
      }),
    },
  });

  // MULTIPLE CHOICE - Fractions Quiz
  const multipleChoiceGame = await prisma.game.create({
    data: {
      id: generateId('game'),
      tutorId: tutor1.id,
      name: 'Fractions Quiz',
      gameType: GameType.MULTIPLE_CHOICE,
      gameData: JSON.stringify({
        description: 'Test your knowledge of fractions',
        questions: [
          {
            id: '1',
            question: 'What is 1/2 + 1/4?',
            options: [
              { id: 'a', text: '3/4', isCorrect: true },
              { id: 'b', text: '2/6', isCorrect: false },
              { id: 'c', text: '1/6', isCorrect: false },
              { id: 'd', text: '2/4', isCorrect: false },
            ],
          },
          {
            id: '2',
            question: 'What is 3/4 - 1/4?',
            options: [
              { id: 'a', text: '1/4', isCorrect: false },
              { id: 'b', text: '2/4', isCorrect: true },
              { id: 'c', text: '2/8', isCorrect: false },
              { id: 'd', text: '4/8', isCorrect: false },
            ],
          },
          {
            id: '3',
            question: 'What is 1/3 × 3?',
            options: [
              { id: 'a', text: '3', isCorrect: false },
              { id: 'b', text: '1/9', isCorrect: false },
              { id: 'c', text: '1', isCorrect: true },
              { id: 'd', text: '3/9', isCorrect: false },
            ],
          },
          {
            id: '4',
            question: 'Which fraction is equivalent to 2/4?',
            options: [
              { id: 'a', text: '4/8', isCorrect: true },
              { id: 'b', text: '3/6', isCorrect: false },
              { id: 'c', text: '2/8', isCorrect: false },
              { id: 'd', text: '4/6', isCorrect: false },
            ],
          },
          {
            id: '5',
            question: 'What is 2/3 + 1/3?',
            options: [
              { id: 'a', text: '3/6', isCorrect: false },
              { id: 'b', text: '1', isCorrect: true },
              { id: 'c', text: '3/9', isCorrect: false },
              { id: 'd', text: '2/3', isCorrect: false },
            ],
          },
          {
            id: '6',
            question: 'What is 5/10 simplified?',
            options: [
              { id: 'a', text: '1/2', isCorrect: true },
              { id: 'b', text: '2/4', isCorrect: false },
              { id: 'c', text: '5/10', isCorrect: false },
              { id: 'd', text: '1/5', isCorrect: false },
            ],
          },
          {
            id: '7',
            question: 'What is 3/8 + 3/8?',
            options: [
              { id: 'a', text: '6/16', isCorrect: false },
              { id: 'b', text: '3/4', isCorrect: true },
              { id: 'c', text: '6/8', isCorrect: false },
              { id: 'd', text: '1/2', isCorrect: false },
            ],
          },
          {
            id: '8',
            question: 'Which is larger: 3/4 or 2/3?',
            options: [
              { id: 'a', text: '3/4', isCorrect: true },
              { id: 'b', text: '2/3', isCorrect: false },
              { id: 'c', text: 'They are equal', isCorrect: false },
              { id: 'd', text: 'Cannot determine', isCorrect: false },
            ],
          },
          {
            id: '9',
            question: 'What is 1/2 ÷ 2?',
            options: [
              { id: 'a', text: '1/4', isCorrect: true },
              { id: 'b', text: '1', isCorrect: false },
              { id: 'c', text: '2/4', isCorrect: false },
              { id: 'd', text: '1/3', isCorrect: false },
            ],
          },
          {
            id: '10',
            question: 'What is 4/5 - 1/5?',
            options: [
              { id: 'a', text: '3/5', isCorrect: true },
              { id: 'b', text: '5/10', isCorrect: false },
              { id: 'c', text: '3/10', isCorrect: false },
              { id: 'd', text: '4/10', isCorrect: false },
            ],
          },
        ],
      }),
    },
  });

  // SPLAT - Quick Math
  const splatGame = await prisma.game.create({
    data: {
      id: generateId('game'),
      tutorId: tutor2.id,
      name: 'Quick Math',
      gameType: GameType.SPLAT,
      gameData: JSON.stringify({
        description: 'Answer fast! Test your quick thinking',
        timeLimit: 8,
        items: [
          { id: '1', question: 'What is 7 + 8?', answer: '15' },
          { id: '2', question: 'What is 12 - 5?', answer: '7' },
          { id: '3', question: 'What is 6 × 4?', answer: '24' },
          { id: '4', question: 'What is 18 ÷ 3?', answer: '6' },
          { id: '5', question: 'What is 9 + 7?', answer: '16' },
          { id: '6', question: 'What is 20 - 13?', answer: '7' },
          { id: '7', question: 'What is 5 × 5?', answer: '25' },
          { id: '8', question: 'What is 24 ÷ 4?', answer: '6' },
          { id: '9', question: 'What is 11 + 9?', answer: '20' },
          { id: '10', question: 'What is 15 - 8?', answer: '7' },
          { id: '11', question: 'What is 7 × 6?', answer: '42' },
          { id: '12', question: 'What is 36 ÷ 6?', answer: '6' },
          { id: '13', question: 'What is 13 + 8?', answer: '21' },
          { id: '14', question: 'What is 25 - 17?', answer: '8' },
          { id: '15', question: 'What is 9 × 4?', answer: '36' },
        ],
      }),
    },
  });

  // SWIPE - True or False Science
  const swipeGame = await prisma.game.create({
    data: {
      id: generateId('game'),
      tutorId: tutor2.id,
      name: 'True or False Science',
      gameType: GameType.SWIPE,
      gameData: JSON.stringify({
        description: 'Swipe right for true, left for false',
        items: [
          { id: '1', statement: 'The Sun is a star', isCorrect: true },
          { id: '2', statement: 'Fish can live without water', isCorrect: false },
          { id: '3', statement: 'Plants produce oxygen through photosynthesis', isCorrect: true },
          { id: '4', statement: 'The Earth is flat', isCorrect: false },
          { id: '5', statement: 'Water boils at 100°C at sea level', isCorrect: true },
          { id: '6', statement: 'Humans have four lungs', isCorrect: false },
          { id: '7', statement: 'The moon orbits around Earth', isCorrect: true },
          { id: '8', statement: 'Birds are mammals', isCorrect: false },
          { id: '9', statement: 'Lightning is hotter than the surface of the Sun', isCorrect: true },
          { id: '10', statement: 'All spiders have 6 legs', isCorrect: false },
          { id: '11', statement: 'Sound travels faster in water than in air', isCorrect: true },
          { id: '12', statement: 'The human body has 206 bones', isCorrect: true },
          { id: '13', statement: 'Penguins live at the North Pole', isCorrect: false },
          { id: '14', statement: 'The heart is a muscle', isCorrect: true },
          { id: '15', statement: 'Bats are blind', isCorrect: false },
          { id: '16', statement: 'DNA stands for Deoxyribonucleic acid', isCorrect: true },
          { id: '17', statement: 'The smallest bone in the human body is in the ear', isCorrect: true },
          { id: '18', statement: 'Lightning never strikes the same place twice', isCorrect: false },
          { id: '19', statement: 'The human brain stops developing at age 10', isCorrect: false },
          { id: '20', statement: 'Venus is the hottest planet in our solar system', isCorrect: true },
        ],
      }),
    },
  });

  console.log('✅ Created 5 games (all types)\n');

  // ========================================
  // ASSIGNMENTS
  // ========================================
  console.log('📋 Creating assignments...');

  const today = new Date();
  const assignments = [];

  // Assignment 1: Past due with completions (Grade 5 Math - Multiplication)
  const assignment1 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: pairsGame.id,
      groupId: group1.id,
      dueDate: addDays(today, -5), // 5 days ago
      passPercentage: 70,
    },
  });
  assignments.push(assignment1);

  // Assignment 2: Past due, partial completion (Grade 5 Math - Flashcards)
  const assignment2 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: flashcardsGame.id,
      groupId: group1.id,
      dueDate: addDays(today, -2), // 2 days ago
      passPercentage: 75,
    },
  });
  assignments.push(assignment2);

  // Assignment 3: Due today (Algebra - Multiple Choice)
  const assignment3 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: multipleChoiceGame.id,
      groupId: group2.id,
      dueDate: today,
      passPercentage: 80,
    },
  });
  assignments.push(assignment3);

  // Assignment 4: Due tomorrow (Science - Splat)
  const assignment4 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: splatGame.id,
      groupId: group3.id,
      dueDate: addDays(today, 1),
      passPercentage: 60,
    },
  });
  assignments.push(assignment4);

  // Assignment 5: Future - 3 days (Science - Swipe)
  const assignment5 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: swipeGame.id,
      groupId: group3.id,
      dueDate: addDays(today, 3),
      passPercentage: 70,
    },
  });
  assignments.push(assignment5);

  // Assignment 6: Future - 7 days (Grade 5 Math - Multiple Choice)
  const assignment6 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: multipleChoiceGame.id,
      groupId: group1.id,
      dueDate: addDays(today, 7),
      passPercentage: 70,
    },
  });
  assignments.push(assignment6);

  // Assignment 7: Past, 100% completion (Algebra - Pairs)
  const assignment7 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: pairsGame.id,
      groupId: group2.id,
      dueDate: addDays(today, -10),
      passPercentage: 70,
    },
  });
  assignments.push(assignment7);

  // Assignment 8: Future - 5 days (Science - Quick Math)
  const assignment8 = await prisma.assignment.create({
    data: {
      id: generateId('assignment'),
      gameId: splatGame.id,
      groupId: group3.id,
      dueDate: addDays(today, 5),
      passPercentage: 65,
    },
  });
  assignments.push(assignment8);

  console.log('✅ Created 8 assignments\n');

  // ========================================
  // GAME ATTEMPTS
  // ========================================
  console.log('🎯 Creating game attempts...');

  // Assignment 1 attempts (Past due, mixed completion)
  // Student 1 - Perfect score
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment1.id,
      studentId: students[0].id,
      scorePercentage: 100,
      timeTaken: 245, // 4 minutes 5 seconds
      attemptData: JSON.stringify({ moves: 24, correctPairs: 12, incorrectAttempts: 0 }),
      completedAt: addDays(today, -4),
    },
  });

  // Student 2 - Good score
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment1.id,
      studentId: students[1].id,
      scorePercentage: 83,
      timeTaken: 312,
      attemptData: JSON.stringify({ moves: 28, correctPairs: 10, incorrectAttempts: 4 }),
      completedAt: addDays(today, -3),
    },
  });

  // Student 3 - Failed first attempt
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment1.id,
      studentId: students[2].id,
      scorePercentage: 58,
      timeTaken: 420,
      attemptData: JSON.stringify({ moves: 35, correctPairs: 7, incorrectAttempts: 11 }),
      completedAt: addDays(today, -6),
    },
  });

  // Student 3 - Second attempt, passed
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment1.id,
      studentId: students[2].id,
      scorePercentage: 75,
      timeTaken: 298,
      attemptData: JSON.stringify({ moves: 27, correctPairs: 9, incorrectAttempts: 6 }),
      completedAt: addDays(today, -4),
    },
  });

  // Assignment 2 attempts (Flashcards, partial completion)
  // Student 1 - Multiple attempts improving
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment2.id,
      studentId: students[0].id,
      scorePercentage: 65,
      timeTaken: 480,
      attemptData: JSON.stringify({ cardsViewed: 20, correct: 13, incorrect: 7 }),
      completedAt: addDays(today, -3),
    },
  });

  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment2.id,
      studentId: students[0].id,
      scorePercentage: 85,
      timeTaken: 425,
      attemptData: JSON.stringify({ cardsViewed: 20, correct: 17, incorrect: 3 }),
      completedAt: addDays(today, -1),
    },
  });

  // Student 2 - One attempt
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment2.id,
      studentId: students[1].id,
      scorePercentage: 80,
      timeTaken: 390,
      attemptData: JSON.stringify({ cardsViewed: 20, correct: 16, incorrect: 4 }),
      completedAt: addDays(today, -2),
    },
  });

  // Assignment 3 attempts (Multiple Choice, due today)
  // Student 5 - Early completion, excellent
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment3.id,
      studentId: students[4].id,
      scorePercentage: 90,
      timeTaken: 420,
      attemptData: JSON.stringify({
        questions: 10,
        correct: 9,
        incorrect: 1,
        answers: Array(10).fill(null).map((_, i) => ({
          questionId: `${i + 1}`,
          selectedOption: i === 3 ? 'wrong' : 'correct',
          correct: i !== 3,
        })),
      }),
      completedAt: addDays(today, -1),
    },
  });

  // Assignment 4 attempts (Splat, due tomorrow - some early birds)
  // Student 7 - Fast and accurate
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment4.id,
      studentId: students[6].id,
      scorePercentage: 87,
      timeTaken: 185,
      attemptData: JSON.stringify({
        totalQuestions: 15,
        correct: 13,
        incorrect: 2,
        averageTime: 12.3,
      }),
      completedAt: new Date(),
    },
  });

  // Student 4 - Good score
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment4.id,
      studentId: students[0].id,
      scorePercentage: 73,
      timeTaken: 215,
      attemptData: JSON.stringify({
        totalQuestions: 15,
        correct: 11,
        incorrect: 4,
        averageTime: 14.3,
      }),
      completedAt: new Date(),
    },
  });

  // Assignment 5 attempts (Swipe, future - one eager student)
  // Student 2 - Very early, perfect score
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment5.id,
      studentId: students[2].id,
      scorePercentage: 100,
      timeTaken: 280,
      attemptData: JSON.stringify({
        totalQuestions: 20,
        correctSwipes: 20,
        incorrectSwipes: 0,
        swipes: Array(20).fill(null).map((_, i) => ({
          statementId: `${i + 1}`,
          direction: i % 2 === 0 ? 'right' : 'left',
          correct: true,
        })),
      }),
      completedAt: new Date(),
    },
  });

  // Assignment 7 attempts (Past, 100% completion)
  // All 3 students completed
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment7.id,
      studentId: students[4].id,
      scorePercentage: 92,
      timeTaken: 215,
      attemptData: JSON.stringify({ moves: 25, correctPairs: 11, incorrectAttempts: 2 }),
      completedAt: addDays(today, -9),
    },
  });

  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment7.id,
      studentId: students[5].id,
      scorePercentage: 100,
      timeTaken: 198,
      attemptData: JSON.stringify({ moves: 24, correctPairs: 12, incorrectAttempts: 0 }),
      completedAt: addDays(today, -8),
    },
  });

  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment7.id,
      studentId: students[6].id,
      scorePercentage: 83,
      timeTaken: 267,
      attemptData: JSON.stringify({ moves: 29, correctPairs: 10, incorrectAttempts: 5 }),
      completedAt: addDays(today, -8),
    },
  });

  // Additional random attempts for variety
  // Student 3 practicing Swipe game
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment5.id,
      studentId: students[6].id,
      scorePercentage: 75,
      timeTaken: 310,
      attemptData: JSON.stringify({
        totalQuestions: 20,
        correctSwipes: 15,
        incorrectSwipes: 5,
        swipes: Array(20).fill(null).map((_, i) => ({
          statementId: `${i + 1}`,
          direction: i % 2 === 0 ? 'right' : 'left',
          correct: i % 4 !== 3,
        })),
      }),
      completedAt: new Date(),
    },
  });

  // Student 4 - Multiple Choice practice
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment3.id,
      studentId: students[5].id,
      scorePercentage: 70,
      timeTaken: 485,
      attemptData: JSON.stringify({
        questions: 10,
        correct: 7,
        incorrect: 3,
        answers: Array(10).fill(null).map((_, i) => ({
          questionId: `${i + 1}`,
          selectedOption: i % 3 === 0 ? 'wrong' : 'correct',
          correct: i % 3 !== 0,
        })),
      }),
      completedAt: addDays(today, -1),
    },
  });

  // Student 6 - Splat game low score, needs retry
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment4.id,
      studentId: students[4].id,
      scorePercentage: 47,
      timeTaken: 240,
      attemptData: JSON.stringify({
        totalQuestions: 15,
        correct: 7,
        incorrect: 8,
        averageTime: 16.0,
      }),
      completedAt: new Date(),
    },
  });

  // Student 7 - Flashcards excellent score
  await prisma.gameAttempt.create({
    data: {
      id: generateId('attempt'),
      assignmentId: assignment2.id,
      studentId: students[3].id,
      scorePercentage: 95,
      timeTaken: 362,
      attemptData: JSON.stringify({ cardsViewed: 20, correct: 19, incorrect: 1 }),
      completedAt: addDays(today, -1),
    },
  });

  console.log('✅ Created 18 game attempts\n');

  // ========================================
  // SUMMARY
  // ========================================
  console.log('📊 Seed Summary:');
  console.log('================');
  console.log(`✅ Users: ${2 + 8} (2 tutors, 8 students)`);
  console.log(`✅ Groups: 3`);
  console.log(`✅ Group Members: ${4 + 3 + 5} (some students in multiple groups)`);
  console.log(`✅ Games: 5 (covering all types)`);
  console.log(`✅ Assignments: 8 (varied due dates and completion)`);
  console.log(`✅ Game Attempts: 18 (varied scores and times)`);
  console.log('');
  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('📝 Test Accounts:');
  console.log('  Tutors:');
  console.log('    - tutor1@example.com (Sarah Johnson - Math)');
  console.log('    - tutor2@example.com (Michael Chen - Science)');
  console.log('  Students:');
  console.log('    - student1@example.com (Emma Wilson)');
  console.log('    - student2@example.com (Liam Brown)');
  console.log('    - student3@example.com (Olivia Martinez)');
  console.log('    - student4@example.com (Noah Garcia)');
  console.log('    - student5@example.com (Ava Davis)');
  console.log('    - student6@example.com (Ethan Rodriguez)');
  console.log('    - student7@example.com (Sophia Lopez)');
  console.log('    - student8@example.com (Mason Gonzalez)');
  console.log('');
  console.log('🎮 Join Codes:');
  console.log('  - MATH01 (Grade 5 Math)');
  console.log('  - ALG101 (Algebra Basics)');
  console.log('  - SCI999 (Science Explorers)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
