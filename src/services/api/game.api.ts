import type { GameService } from '../interface';

export const apiGameService: GameService = {
  getMyGames: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  getGameById: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  getMyGamesByType: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  createGame: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  updateGame: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  deleteGame: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  isGameAssigned: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  duplicateGame: async () => { throw new Error('Not implemented - connect to Bun backend'); },
};
