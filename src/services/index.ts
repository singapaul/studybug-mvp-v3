import { mockGameService } from './mock/game.mock';
import { mockGroupService } from './mock/group.mock';
import { mockGameAttemptService } from './mock/game-attempt.mock';
import { mockAssignmentService } from './mock/assignment.mock';
import { apiGameService } from './api/game.api';
import { apiGroupService } from './api/group.api';
import { apiGameAttemptService } from './api/game-attempt.api';
import { apiAssignmentService } from './api/assignment.api';

const mode = (import.meta as any).env?.VITE_API_MODE ?? 'mock';

export const services = {
  games: mode === 'real' ? apiGameService : mockGameService,
  groups: mode === 'real' ? apiGroupService : mockGroupService,
  gameAttempts: mode === 'real' ? apiGameAttemptService : mockGameAttemptService,
  assignments: mode === 'real' ? apiAssignmentService : mockAssignmentService,
};
