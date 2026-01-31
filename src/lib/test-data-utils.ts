/**
 * Utility functions for creating test data
 * These help populate assignments for development and testing
 */

export function createTestAssignments() {
  const assignments = [
    {
      id: `assignment_${Date.now()}_1`,
      gameId: 'test_game_1',
      groupId: 'test_group_1',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      passPercentage: 70,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `assignment_${Date.now()}_2`,
      gameId: 'test_game_2',
      groupId: 'test_group_1',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      passPercentage: 80,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: `assignment_${Date.now()}_3`,
      gameId: 'test_game_3',
      groupId: 'test_group_1',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      passPercentage: 60,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  localStorage.setItem('dev_assignments', JSON.stringify(assignments));
}

export function createTestAttempt(assignmentId: string, studentId: string, score: number) {
  const attempts = JSON.parse(localStorage.getItem('dev_game_attempts') || '[]');

  const newAttempt = {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    assignmentId,
    studentId,
    scorePercentage: score,
    timeTaken: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
    completedAt: new Date(),
    attemptData: JSON.stringify({ answers: [] }),
  };

  attempts.push(newAttempt);
  localStorage.setItem('dev_game_attempts', JSON.stringify(attempts));

  return newAttempt;
}

export function createTestGamesForAssignments() {
  const games = [
    {
      id: 'test_game_1',
      tutorId: 'test_tutor',
      name: 'Math Facts Challenge',
      gameType: 'PAIRS',
      gameData: JSON.stringify({
        description: 'Match numbers with their operations',
        items: [
          { id: '1', leftText: '5 + 3', rightText: '8' },
          { id: '2', leftText: '10 - 4', rightText: '6' },
          { id: '3', leftText: '3 × 4', rightText: '12' },
          { id: '4', leftText: '20 ÷ 5', rightText: '4' },
          { id: '5', leftText: '7 + 8', rightText: '15' },
          { id: '6', leftText: '9 - 3', rightText: '6' },
        ],
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'test_game_2',
      tutorId: 'test_tutor',
      name: 'Science Vocabulary',
      gameType: 'FLASHCARDS',
      gameData: JSON.stringify({
        description: 'Learn key science terms',
        cards: [
          { id: '1', front: 'Photosynthesis', back: 'The process plants use to make food from sunlight, water, and carbon dioxide' },
          { id: '2', front: 'Evaporation', back: 'When liquid turns into gas due to heat energy' },
          { id: '3', front: 'Gravity', back: 'The force that pulls objects toward each other' },
          { id: '4', front: 'Ecosystem', back: 'A community of living organisms and their environment' },
          { id: '5', front: 'Molecule', back: 'Two or more atoms bonded together' },
          { id: '6', front: 'Fossil', back: 'Preserved remains of ancient life' },
          { id: '7', front: 'Habitat', back: 'The natural home of an animal or plant' },
          { id: '8', front: 'Organism', back: 'A living thing' },
        ],
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'test_game_3',
      tutorId: 'test_tutor',
      name: 'Quick Math Splat',
      gameType: 'SPLAT',
      gameData: JSON.stringify({
        description: 'Answer fast! Test your quick thinking',
        timeLimit: 8,
        items: [
          { id: '1', question: 'What is 5 + 7?', answer: '12' },
          { id: '2', question: 'What is 9 × 3?', answer: '27' },
          { id: '3', question: 'What is 20 - 8?', answer: '12' },
          { id: '4', question: 'What is 6 × 4?', answer: '24' },
          { id: '5', question: 'What is 15 ÷ 3?', answer: '5' },
          { id: '6', question: 'What is 8 + 9?', answer: '17' },
          { id: '7', question: 'What is 7 × 5?', answer: '35' },
          { id: '8', question: 'What is 30 - 12?', answer: '18' },
        ],
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const existingGames = JSON.parse(localStorage.getItem('dev_games') || '[]');
  const mergedGames = [...existingGames];

  games.forEach((game) => {
    if (!mergedGames.find((g: any) => g.id === game.id)) {
      mergedGames.push(game);
    }
  });

  localStorage.setItem('dev_games', JSON.stringify(mergedGames));
}

/**
 * Initialize all test data needed for student dashboard testing
 */
export function initializeStudentTestData(studentId: string, tutorId: string) {
  // Create test games
  createTestGamesForAssignments();

  // Create test group if it doesn't exist
  const groups = JSON.parse(localStorage.getItem('dev_groups') || '[]');
  if (!groups.find((g: any) => g.id === 'test_group_1')) {
    groups.push({
      id: 'test_group_1',
      tutorId,
      name: 'Test Class - Room 101',
      ageRange: '10-12',
      subjectArea: 'Mathematics',
      joinCode: 'TEST01',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    localStorage.setItem('dev_groups', JSON.stringify(groups));
  }

  // Add student to group if not already a member
  const members = JSON.parse(localStorage.getItem('dev_group_members') || '[]');
  if (!members.find((m: any) => m.groupId === 'test_group_1' && m.studentId === studentId)) {
    members.push({
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      groupId: 'test_group_1',
      studentId,
      joinedAt: new Date(),
      student: {
        id: studentId,
        user: {
          id: `user_${studentId}`,
          email: 'test.student@example.com',
        },
      },
    });
    localStorage.setItem('dev_group_members', JSON.stringify(members));
  }

  // Create assignments
  createTestAssignments();

  // Create a sample attempt for the first assignment
  const assignments = JSON.parse(localStorage.getItem('dev_assignments') || '[]');
  if (assignments.length > 0) {
    createTestAttempt(assignments[0].id, studentId, 85);
  }

  console.log('✅ Student test data initialized successfully!');
  console.log('📚 Created 3 assignments (1 pending, 1 overdue, 1 completed)');
  console.log('🎮 Created 3 test games');
  console.log('👥 Added student to test group');
}

/**
 * Clear all test data
 */
export function clearTestData() {
  localStorage.removeItem('dev_assignments');
  localStorage.removeItem('dev_game_attempts');
  console.log('🧹 Test data cleared');
}
