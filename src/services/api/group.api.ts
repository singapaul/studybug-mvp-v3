import type { GroupService } from '../interface';

export const apiGroupService: GroupService = {
  getMyGroups: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  getGroupById: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  getGroupByJoinCode: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  createGroup: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  updateGroup: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  deleteGroup: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  removeStudentFromGroup: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  getMyGroupsAsStudent: async () => { throw new Error('Not implemented - connect to Bun backend'); },
  joinGroup: async () => { throw new Error('Not implemented - connect to Bun backend'); },
};
