/**
 * Utility functions for generating and validating join codes
 */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters (0, O, 1, I, L)
const CODE_LENGTH = 6;

/**
 * Generate a random 6-character join code
 */
export function generateJoinCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARS.length);
    code += CHARS[randomIndex];
  }
  return code;
}

/**
 * Validate join code format
 */
export function isValidJoinCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  return code.split('').every(char => CHARS.includes(char));
}

/**
 * Format join code for display (e.g., "ABC DEF")
 */
export function formatJoinCode(code: string): string {
  if (code.length !== CODE_LENGTH) return code;
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}

/**
 * Generate shareable join link
 */
export function getJoinLink(joinCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${joinCode}`;
}
