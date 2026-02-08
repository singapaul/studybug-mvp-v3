# Using Supabase Types

## Overview

Supabase generates TypeScript types directly from your database schema, providing full type safety for all database operations.

## Files

- `src/types/database.types.ts` - Auto-generated from Supabase schema
- `src/types/database.helpers.ts` - Convenience type helpers
- `src/lib/supabase.ts` - Typed Supabase client

## Regenerating Types

When you change your database schema, regenerate types:

```bash
# Using project ID from your Supabase URL
supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts

# Or if you have a local project linked:
supabase gen types typescript --local > src/types/database.types.ts
```

## Usage Examples

### Basic Table Types

```typescript
import type { Tables, Inserts, Updates } from '@/types/database.helpers';

// Get the row type for a table
type Game = Tables<'Game'>;
type Student = Tables<'Student'>;

// Get insert type (some fields optional like id, createdAt)
type GameInsert = Inserts<'Game'>;

// Get update type (all fields optional)
type GameUpdate = Updates<'Game'>;
```

### Using with Supabase Queries

```typescript
import { supabase } from '@/lib/supabase';
import type { Game, GameInsert } from '@/types/database.helpers';

// The query is fully typed
const { data, error } = await supabase
  .from('Game')
  .select('*')
  .eq('tutorId', tutorId);

// data is automatically typed as Game[]
if (data) {
  data.forEach((game: Game) => {
    console.log(game.name); // ✅ Fully typed
    // console.log(game.invalid); // ❌ TypeScript error
  });
}

// Insert with type checking
const newGame: GameInsert = {
  tutorId: 'tutor-123',
  name: 'Math Quiz',
  gameType: 'MULTIPLE_CHOICE',
  gameData: JSON.stringify({ questions: [] }),
  // id, createdAt, updatedAt are optional (auto-generated)
};

await supabase.from('Game').insert(newGame);
```

### Using Enum Types

```typescript
import type { GameType, Role, SubscriptionStatus } from '@/types/database.helpers';

// Enum types are automatically extracted
const gameType: GameType = 'FLASHCARDS'; // ✅
// const gameType: GameType = 'INVALID'; // ❌ TypeScript error

const role: Role = 'TUTOR' | 'STUDENT';
const status: SubscriptionStatus = 'FREE' | 'PREMIUM' | 'TRIAL';
```

### Complex Queries with Joins

```typescript
import { supabase } from '@/lib/supabase';

const { data } = await supabase
  .from('Game')
  .select(`
    *,
    tutor:Tutor(*),
    assignments:Assignment(
      *,
      group:Group(*)
    )
  `)
  .eq('id', gameId)
  .single();

// data is automatically typed with nested relationships
if (data) {
  console.log(data.name); // Game name
  console.log(data.tutor?.subscriptionStatus); // Tutor status
  console.log(data.assignments[0]?.group?.name); // Group name
}
```

### Type-Safe Service Functions

```typescript
import { supabase } from '@/lib/supabase';
import type { GameInsert, Game } from '@/types/database.helpers';

export async function createGame(input: GameInsert): Promise<Game> {
  const { data, error } = await supabase
    .from('Game')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data; // Already typed as Game
}
```

## Benefits

1. **Auto-completion** - IDE suggests all table columns and their types
2. **Type Safety** - Catch errors at compile time, not runtime
3. **Refactoring** - Rename database columns and TypeScript will show all places to update
4. **Documentation** - Types serve as inline documentation for your schema
5. **Relationships** - Nested query types reflect your foreign key relationships

## Best Practices

1. **Regenerate after schema changes** - Run `supabase gen types` after any database migration
2. **Use helper types** - Import from `database.helpers.ts` for cleaner code
3. **Type your functions** - Always type service function inputs/outputs
4. **Avoid `any`** - Use proper types instead of `any` for Supabase results
5. **Handle nulls** - Database types include `| null` for nullable columns

## Example Migration

Before (untyped):
```typescript
const { data } = await supabase
  .from('Game')
  .select('*');

// data is 'any[]' - no type safety
data?.forEach((game: any) => {
  console.log(game.name);
});
```

After (typed):
```typescript
import type { Game } from '@/types/database.helpers';

const { data } = await supabase
  .from('Game')
  .select('*');

// data is 'Game[]' - fully typed
data?.forEach((game) => {
  console.log(game.name); // ✅ Auto-complete works
  console.log(game.tutorId); // ✅ All fields typed
});
```
