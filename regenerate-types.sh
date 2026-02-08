#!/bin/bash

# Extract project ID from .env.local
PROJECT_ID=$(grep VITE_SUPABASE_URL .env.local | cut -d'/' -f3 | cut -d'.' -f1)

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Could not find VITE_SUPABASE_URL in .env.local"
  echo ""
  echo "Please run manually with your project ID:"
  echo "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts"
  exit 1
fi

echo "🔍 Found project ID: $PROJECT_ID"
echo "📝 Generating TypeScript types from Supabase..."
echo ""

# Generate types
supabase gen types typescript --project-id "$PROJECT_ID" > src/types/database.types.ts

if [ $? -eq 0 ]; then
  echo "✅ Types generated successfully!"
  echo "📁 File: src/types/database.types.ts"
  echo ""
  echo "📊 Summary:"
  wc -l src/types/database.types.ts
  echo ""
  echo "🔨 Now run: npm run build"
else
  echo "❌ Failed to generate types"
  echo ""
  echo "Troubleshooting:"
  echo "1. Make sure you're logged in: supabase login"
  echo "2. Check your project ID is correct"
  echo "3. Verify the migration completed successfully"
  exit 1
fi
