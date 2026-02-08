/**
 * API Testing Page (Auth-Based)
 * Test all Supabase service functions using authenticated context
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GameType } from '@/types/game';
import { supabase } from '@/lib/supabase';

// Import auth-based services
import * as gameService from '@/services/supabase/game.service';
import * as groupService from '@/services/supabase/group.service';
import * as studentService from '@/services/supabase/student.service';
import * as attemptService from '@/services/supabase/game-attempt.service';

export default function ApiTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestPayload, setRequestPayload] = useState<any>(null);

  // Auth state
  const [authUser, setAuthUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('tutor1@test.com');
  const [authPassword, setAuthPassword] = useState('Test123!');
  const [signingIn, setSigningIn] = useState(false);

  // Form states
  const [gameId, setGameId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setAuthUser(user);
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) throw error;

      setAuthUser(data.user);
      setResult({ message: 'Signed in successfully', user: data.user });
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setResult(null);
    setError(null);
    setRequestPayload(null);
  };

  const handleApiCall = async (
    apiFunction: () => Promise<any>,
    payload?: any
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRequestPayload(payload || null);

    try {
      const data = await apiFunction();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const AuthDisplay = () => {
    if (!authUser) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            <strong>⚠️ Not Authenticated</strong>
            <br />
            Please sign in to test the API functions.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="mb-6">
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>✅ Authenticated as:</strong> {authUser.email}
              <br />
              <span className="text-xs font-mono">Auth UID: {authUser.id}</span>
              <br />
              <span className="text-xs">
                Role: <Badge>{authUser.user_metadata?.role || 'Unknown'}</Badge>
              </span>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  const SignInForm = () => {
    if (authUser) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sign In to Test</CardTitle>
          <CardDescription>Use one of your test accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="tutor1@test.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Test123!"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick sign-in options:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthEmail('tutor1@test.com');
                  setAuthPassword('Test123!');
                }}
              >
                Tutor 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthEmail('tutor2@test.com');
                  setAuthPassword('Test123!');
                }}
              >
                Tutor 2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthEmail('student1@test.com');
                  setAuthPassword('Test123!');
                }}
              >
                Student 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthEmail('student2@test.com');
                  setAuthPassword('Test123!');
                }}
              >
                Student 2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthEmail('student3@test.com');
                  setAuthPassword('Test123!');
                }}
              >
                Student 3
              </Button>
            </div>
          </div>

          <Button onClick={handleSignIn} disabled={signingIn} className="w-full">
            {signingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>
    );
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
            <pre className="max-h-96 overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
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
      <h1 className="text-3xl font-bold mb-6">Supabase API Testing (Auth-Based)</h1>

      <AuthDisplay />
      <SignInForm />

      {!authUser && (
        <Alert className="mb-6">
          <AlertDescription>
            Sign in with a test account to start testing API functions.
            <br />
            All functions now use the authenticated user automatically - no IDs needed!
          </AlertDescription>
        </Alert>
      )}

      {authUser && (
        <Tabs defaultValue="games" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attempts">Attempts</TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Service Tests</CardTitle>
                <CardDescription>
                  Test game operations (uses auth user's Tutor ID automatically)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleApiCall(
                      () => gameService.getMyGames(),
                      { authUserId: authUser.id }
                    )}
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
                      onClick={() => handleApiCall(
                        () => gameService.getGameById(gameId),
                        { gameId }
                      )}
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
                        () => gameService.createGame({
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
                        () => gameService.updateGame(gameId, { name: 'Updated Game Name' }),
                        payload
                      );
                    }}
                    disabled={!gameId}
                  >
                    Update Game
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => gameService.deleteGame(gameId),
                      { gameId }
                    )}
                    disabled={!gameId}
                    variant="destructive"
                  >
                    Delete Game
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => gameService.duplicateGame(gameId),
                      { gameId }
                    )}
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
                <CardDescription>
                  Test group operations (uses auth user automatically)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleApiCall(
                      () => groupService.getMyGroups(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get My Groups
                  </Button>

                  <div className="space-y-2">
                    <Input
                      placeholder="Group ID"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                    />
                    <Button
                      onClick={() => handleApiCall(
                        () => groupService.getGroupById(groupId),
                        { groupId }
                      )}
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
                      onClick={() => handleApiCall(
                        () => groupService.getGroupByJoinCode(joinCode),
                        { joinCode }
                      )}
                      disabled={!joinCode}
                      className="w-full"
                    >
                      Get Group by Join Code
                    </Button>
                  </div>

                  <Button
                    onClick={() => {
                      const payload = {
                        name: 'Test Group',
                        ageRange: '10-12',
                        subjectArea: 'Math',
                      };
                      handleApiCall(
                        () => groupService.createGroup({
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

                  <Button
                    onClick={() => {
                      const payload = { groupId, name: 'Updated Group Name' };
                      handleApiCall(
                        () => groupService.updateGroup(groupId, {
                          name: 'Updated Group Name',
                        }),
                        payload
                      );
                    }}
                    disabled={!groupId}
                  >
                    Update Group
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => groupService.deleteGroup(groupId),
                      { groupId }
                    )}
                    disabled={!groupId}
                    variant="destructive"
                  >
                    Delete Group
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => groupService.getMyGroupsAsStudent(),
                      { authUserId: authUser.id, role: 'STUDENT' }
                    )}
                  >
                    Get My Groups (Student)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Service Tests</CardTitle>
                <CardDescription>
                  Test student operations (uses auth user's Student ID automatically)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyGroups(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get My Groups
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyAssignments(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get My Assignments
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyStats(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get My Stats
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyAttempts(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get My Attempts
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyPersonalBests(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get Personal Bests
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => studentService.getMyProgressTrends(30),
                      { authUserId: authUser.id, daysBack: 30 }
                    )}
                  >
                    Get Progress Trends
                  </Button>

                  <div className="space-y-2 col-span-2">
                    <Input
                      placeholder="Join Code (e.g., MATH001)"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                    <Button
                      onClick={() => handleApiCall(
                        () => studentService.joinGroup(joinCode),
                        { joinCode }
                      )}
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

          {/* Attempts Tab */}
          <TabsContent value="attempts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Game Attempt Tests</CardTitle>
                <CardDescription>
                  Test game attempt operations (uses auth user's Student ID automatically)
                </CardDescription>
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
                        assignmentId,
                        score: 85.5,
                        timeSpent: 120,
                        attemptData: { answers: ['correct', 'wrong', 'correct'] }
                      };
                      handleApiCall(
                        () => attemptService.saveGameAttempt(
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
                    onClick={() => handleApiCall(
                      () => attemptService.getMyAssignmentAttempts(assignmentId),
                      { assignmentId }
                    )}
                    disabled={!assignmentId}
                  >
                    Get My Assignment Attempts
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => attemptService.getMyBestAttempt(assignmentId),
                      { assignmentId }
                    )}
                    disabled={!assignmentId}
                  >
                    Get My Best Attempt
                  </Button>

                  <Button
                    onClick={() => handleApiCall(
                      () => attemptService.getMyAttempts(),
                      { authUserId: authUser.id }
                    )}
                  >
                    Get All My Attempts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

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
