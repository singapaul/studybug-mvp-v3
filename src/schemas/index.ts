/**
 * Central export for all validation schemas
 */

// Group schemas
export {
  createGroupSchema,
  updateGroupSchema,
  type CreateGroupFormData,
  type UpdateGroupFormData,
} from './group.schema';

// Game schemas
export {
  createGameSchema,
  gameBaseSchema,
  pairsItemSchema,
  pairsGameDataSchema,
  flashcardItemSchema,
  flashcardsGameDataSchema,
  multipleChoiceOptionSchema,
  multipleChoiceQuestionSchema,
  multipleChoiceGameDataSchema,
  splatItemSchema,
  splatGameDataSchema,
  swipeItemSchema,
  swipeGameDataSchema,
  type CreateGameFormData,
} from './game.schema';

// Assignment schemas
export {
  createAssignmentSchema,
  updateAssignmentSchema,
  type CreateAssignmentFormData,
  type UpdateAssignmentFormData,
} from './assignment.schema';

// Join group schemas
export { joinGroupSchema, type JoinGroupFormData } from './join-group.schema';

// Settings schemas
export {
  profileSettingsSchema,
  notificationSettingsSchema,
  themeSettingsSchema,
  contactSupportSchema,
  passwordChangeSchema,
  type ProfileSettingsFormData,
  type NotificationSettingsFormData,
  type ThemeSettingsFormData,
  type ContactSupportFormData,
  type PasswordChangeFormData,
} from './settings.schema';
