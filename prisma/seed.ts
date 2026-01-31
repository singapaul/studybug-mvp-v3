import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Example: Create a test tutor user
  const tutorUser = await prisma.user.create({
    data: {
      email: 'tutor@example.com',
      passwordHash: '$2a$10$dummyhashforexampleonly', // Replace with actual bcrypt hash
      role: 'TUTOR',
      emailVerified: true,
      tutor: {
        create: {
          subscriptionStatus: 'FREE',
        },
      },
    },
    include: {
      tutor: true,
    },
  });

  console.log('Created tutor:', tutorUser);

  // Example: Create a test student user
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@example.com',
      passwordHash: '$2a$10$dummyhashforexampleonly', // Replace with actual bcrypt hash
      role: 'STUDENT',
      emailVerified: true,
      student: {
        create: {},
      },
    },
    include: {
      student: true,
    },
  });

  console.log('Created student:', studentUser);

  // Example: Create a test group
  if (tutorUser.tutor) {
    const group = await prisma.group.create({
      data: {
        tutorId: tutorUser.tutor.id,
        name: 'Year 5 Mathematics',
        ageRange: '9-10 years',
        subjectArea: 'Mathematics',
        joinCode: generateJoinCode(),
      },
    });

    console.log('Created group:', group);

    // Example: Add student to group
    if (studentUser.student) {
      const groupMember = await prisma.groupMember.create({
        data: {
          groupId: group.id,
          studentId: studentUser.student.id,
        },
      });

      console.log('Added student to group:', groupMember);
    }

    // Example: Create a test game
    const game = await prisma.game.create({
      data: {
        tutorId: tutorUser.tutor.id,
        name: 'Times Tables Quiz',
        gameType: 'MULTIPLE_CHOICE',
        gameData: JSON.stringify({
          questions: [
            {
              question: 'What is 5 × 6?',
              options: ['25', '30', '35', '40'],
              correctIndex: 1,
            },
            {
              question: 'What is 7 × 8?',
              options: ['54', '56', '58', '60'],
              correctIndex: 1,
            },
          ],
        }),
      },
    });

    console.log('Created game:', game);

    // Example: Create an assignment
    const assignment = await prisma.assignment.create({
      data: {
        gameId: game.id,
        groupId: group.id,
        passPercentage: 70,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    console.log('Created assignment:', assignment);
  }

  console.log('Database seed completed!');
}

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
