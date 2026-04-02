/**
 * API Testing Page (Mock Service Layer)
 * Test all mock service functions using the in-memory mock layer
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameType } from '@/types/game';
import { services } from '@/services';

const TUTOR_ID = 'tutor-dev-1';
const TUTOR_PROFILE_ID = 'tutor-profile-1';
const STUDENT_PROFILE_ID = 'student-profile-1';

export default function ApiTest() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestPayload, setRequestPayload] = useState<unknown>(null);

  // Form states
  const [gameId, setGameId] = useState('game-1');
  const [groupId, setGroupId] = useState('group-1');
  const [assignmentId, setAssignmentId] = useState('assignment-1');
  const [joinCode, setJoinCode] = useState('MATH01');

  const handleApiCall = async (apiFunction: () => Promise<unknown>, payload?: unknown) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRequestPayload(payload || null);

    try {
      const data = await apiFunction();
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const ResultDisplay = () => {
    if (loading) {
      return (
        <Alert>
          <AlertDescription>Loading...</AlertDescription>
        </Alert>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (result !== null) {
      return (
        <Alert>
          <AlertDescription>
            <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const RequestDisplay = () => {
    if (!requestPayload) return null;

    return (
      <Alert className="mb-4">
        <AlertDescription>
          <div className="font-semibold mb-2">Request Payload:</div>
          <pre className="max-h-48 overflow-auto text-xs bg-slate-100 p-2 rounded">
            {JSON.stringify(requestPayload, null, 2)}
          </pre>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Mock Service API Testing</h1>
      <p className="text-muted-foreground mb-6">
        Testing against the in-memory mock service layer. Tutor ID: <code>{TUTOR_ID}</code> /
        Student profile: <code>{STUDENT_PROFILE_ID}</code>
      </p>

      <Alert className="mb-6">
        <AlertDescription>
          Using mock service layer — no backend required. Seed data is pre-loaded.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="attempts">Attempts</TabsTrigger>
        </TabsList>

        {/* Games Tab */}
        <TabsContent value="games" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Service Tests</CardTitle>
              <CardDescription>Test game operations against mock data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    handleApiCall(() => services.games.getMyGames(TUTOR_ID), {
                      userId: TUTOR_ID,
                    })
                  }
                >
                  Get My Games
                </Button>

                <div className="space-y-2">
                  <Input
                    placeholder="Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleApiCall(() => services.games.getGameById(gameId), { gameId })
                    }
                    disabled={!gameId}
                    className="w-full"
                  >
                    Get Game by ID
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    const payload = {
                      name: 'Test Game',
                      gameType: GameType.PAIRS,
                      gameData: {
                        description: 'Test pairs game',
                        items: [
                          { id: '1', leftText: 'Cat', rightText: 'Meow' },
                          { id: '2', leftText: 'Dog', rightText: 'Bark' },
                        ],
                      },
                    };
                    handleApiCall(
                      () =>
                        services.games.createGame(TUTOR_ID, {
                          name: 'Test Game',
                          gameType: GameType.PAIRS,
                          gameData: {
                            description: 'Test pairs game',
                            items: [
                              { id: '1', leftText: 'Cat', rightText: 'Meow' },
                              { id: '2', leftText: 'Dog', rightText: 'Bark' },
                            ],
                          },
                        }),
                      payload
                    );
                  }}
                >
                  Create Test Game
                </Button>

                <Button
                  onClick={() => {
                    const payload = { gameId, name: 'Updated Game Name' };
                    handleApiCall(
                      () => services.games.updateGame(gameId, { name: 'Updated Game Name' }),
                      payload
                    );
                  }}
                  disabled={!gameId}
                >
                  Update Game
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(() => services.games.duplicateGame(gameId, TUTOR_ID), { gameId })
                  }
                  disabled={!gameId}
                >
                  Duplicate Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Service Tests</CardTitle>
              <CardDescription>Test group operations against mock data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    handleApiCall(() => services.groups.getMyGroups(TUTOR_PROFILE_ID), {
                      tutorId: TUTOR_PROFILE_ID,
                    })
                  }
                >
                  Get My Groups (Tutor)
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () => services.groups.getMyGroupsAsStudent(STUDENT_PROFILE_ID),
                      { studentId: STUDENT_PROFILE_ID }
                    )
                  }
                >
                  Get My Groups (Student)
                </Button>

                <div className="space-y-2">
                  <Input
                    placeholder="Group ID"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleApiCall(() => services.groups.getGroupById(groupId), { groupId })
                    }
                    disabled={!groupId}
                    className="w-full"
                  >
                    Get Group by ID
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Join Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleApiCall(() => services.groups.getGroupByJoinCode(joinCode), {
                        joinCode,
                      })
                    }
                    disabled={!joinCode}
                    className="w-full"
                  >
                    Get Group by Join Code
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    const payload = { name: 'Test Group', ageRange: '10-12', subjectArea: 'Math' };
                    handleApiCall(
                      () =>
                        services.groups.createGroup(TUTOR_PROFILE_ID, {
                          name: 'Test Group',
                          ageRange: '10-12',
                          subjectArea: 'Math',
                        }),
                      payload
                    );
                  }}
                >
                  Create Test Group
                </Button>

                <div className="space-y-2">
                  <Label>Join Group as Student</Label>
                  <Input
                    placeholder="Join Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleApiCall(
                        () => services.groups.joinGroup(STUDENT_PROFILE_ID, joinCode),
                        { studentId: STUDENT_PROFILE_ID, joinCode }
                      )
                    }
                    disabled={!joinCode}
                    className="w-full"
                  >
                    Join Group with Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Service Tests</CardTitle>
              <CardDescription>Test assignment and student dashboard operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    handleApiCall(
                      () => services.assignments.getMyAssignments(STUDENT_PROFILE_ID),
                      { studentId: STUDENT_PROFILE_ID }
                    )
                  }
                >
                  Get My Assignments
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(() => services.assignments.getMyStats(STUDENT_PROFILE_ID), {
                      studentId: STUDENT_PROFILE_ID,
                    })
                  }
                >
                  Get My Stats
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () => services.assignments.getMyPersonalBests(STUDENT_PROFILE_ID),
                      { studentId: STUDENT_PROFILE_ID }
                    )
                  }
                >
                  Get Personal Bests
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () => services.assignments.getMyProgressTrends(STUDENT_PROFILE_ID, 30),
                      { studentId: STUDENT_PROFILE_ID, daysBack: 30 }
                    )
                  }
                >
                  Get Progress Trends
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(() => services.assignments.getMyAttempts(STUDENT_PROFILE_ID), {
                      studentId: STUDENT_PROFILE_ID,
                    })
                  }
                >
                  Get My Attempts
                </Button>

                <div className="space-y-2">
                  <Input
                    placeholder="Assignment ID"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleApiCall(
                        () =>
                          services.assignments.getAssignmentById(STUDENT_PROFILE_ID, assignmentId),
                        { studentId: STUDENT_PROFILE_ID, assignmentId }
                      )
                    }
                    disabled={!assignmentId}
                    className="w-full"
                  >
                    Get Assignment by ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attempts Tab */}
        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Game Attempt Tests</CardTitle>
              <CardDescription>Test game attempt operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Input
                    placeholder="Assignment ID"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() => {
                    const payload = {
                      studentId: STUDENT_PROFILE_ID,
                      assignmentId,
                      score: 85.5,
                      timeSpent: 120,
                      attemptData: { answers: ['correct', 'wrong', 'correct'] },
                    };
                    handleApiCall(
                      () =>
                        services.gameAttempts.saveGameAttempt(
                          STUDENT_PROFILE_ID,
                          assignmentId,
                          85.5,
                          120,
                          { answers: ['correct', 'wrong', 'correct'] }
                        ),
                      payload
                    );
                  }}
                  disabled={!assignmentId}
                >
                  Save Test Attempt
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () =>
                        services.gameAttempts.getMyAssignmentAttempts(
                          STUDENT_PROFILE_ID,
                          assignmentId
                        ),
                      { studentId: STUDENT_PROFILE_ID, assignmentId }
                    )
                  }
                  disabled={!assignmentId}
                >
                  Get My Assignment Attempts
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () =>
                        services.gameAttempts.getMyBestAttempt(STUDENT_PROFILE_ID, assignmentId),
                      { studentId: STUDENT_PROFILE_ID, assignmentId }
                    )
                  }
                  disabled={!assignmentId}
                >
                  Get My Best Attempt
                </Button>

                <Button
                  onClick={() =>
                    handleApiCall(
                      () => services.gameAttempts.getMyAttempts(STUDENT_PROFILE_ID),
                      { studentId: STUDENT_PROFILE_ID }
                    )
                  }
                >
                  Get All My Attempts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Display */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Request & Response</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestDisplay />
          <ResultDisplay />
        </CardContent>
      </Card>
    </div>
  );
}
