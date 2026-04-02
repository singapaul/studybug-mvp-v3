/**
 * StudyBug Bun Backend Server (Scaffold)
 *
 * This server is a placeholder scaffold. All API routes are stubbed and
 * return 501 Not Implemented until the real implementation is wired up.
 *
 * Run with:   bun run server/index.ts
 * Dev mode:   bun run dev:server (uses --watch)
 */

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL ?? 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function notImplemented(route: string): Response {
  return json({ error: 'Not implemented', route }, 501);
}

const server = Bun.serve({
  port: PORT,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (path === '/health' && method === 'GET') {
      return json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // ── Auth routes ──────────────────────────────────────────────
    if (path === '/api/auth/login' && method === 'POST') {
      return notImplemented('POST /api/auth/login');
    }
    if (path === '/api/auth/logout' && method === 'POST') {
      return notImplemented('POST /api/auth/logout');
    }
    if (path === '/api/auth/me' && method === 'GET') {
      return notImplemented('GET /api/auth/me');
    }

    // ── Game routes ──────────────────────────────────────────────
    if (path === '/api/games' && method === 'GET') {
      return notImplemented('GET /api/games');
    }
    if (path === '/api/games' && method === 'POST') {
      return notImplemented('POST /api/games');
    }
    if (path.match(/^\/api\/games\/[^/]+$/) && method === 'GET') {
      return notImplemented(`GET ${path}`);
    }
    if (path.match(/^\/api\/games\/[^/]+$/) && method === 'PATCH') {
      return notImplemented(`PATCH ${path}`);
    }
    if (path.match(/^\/api\/games\/[^/]+$/) && method === 'DELETE') {
      return notImplemented(`DELETE ${path}`);
    }
    if (path.match(/^\/api\/games\/[^/]+\/duplicate$/) && method === 'POST') {
      return notImplemented(`POST ${path}`);
    }

    // ── Group routes ─────────────────────────────────────────────
    if (path === '/api/groups' && method === 'GET') {
      return notImplemented('GET /api/groups');
    }
    if (path === '/api/groups' && method === 'POST') {
      return notImplemented('POST /api/groups');
    }
    if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'GET') {
      return notImplemented(`GET ${path}`);
    }
    if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'PATCH') {
      return notImplemented(`PATCH ${path}`);
    }
    if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'DELETE') {
      return notImplemented(`DELETE ${path}`);
    }
    if (path === '/api/groups/join' && method === 'POST') {
      return notImplemented('POST /api/groups/join');
    }
    if (path.match(/^\/api\/groups\/[^/]+\/members\/[^/]+$/) && method === 'DELETE') {
      return notImplemented(`DELETE ${path}`);
    }

    // ── Assignment routes ────────────────────────────────────────
    if (path === '/api/assignments' && method === 'POST') {
      return notImplemented('POST /api/assignments');
    }
    if (path.match(/^\/api\/assignments\/[^/]+$/) && method === 'DELETE') {
      return notImplemented(`DELETE ${path}`);
    }
    if (path === '/api/student/assignments' && method === 'GET') {
      return notImplemented('GET /api/student/assignments');
    }
    if (path.match(/^\/api\/student\/assignments\/[^/]+$/) && method === 'GET') {
      return notImplemented(`GET ${path}`);
    }
    if (path === '/api/student/stats' && method === 'GET') {
      return notImplemented('GET /api/student/stats');
    }
    if (path === '/api/student/personal-bests' && method === 'GET') {
      return notImplemented('GET /api/student/personal-bests');
    }
    if (path === '/api/student/progress-trends' && method === 'GET') {
      return notImplemented('GET /api/student/progress-trends');
    }

    // ── Game attempt routes ──────────────────────────────────────
    if (path === '/api/attempts' && method === 'POST') {
      return notImplemented('POST /api/attempts');
    }
    if (path === '/api/attempts' && method === 'GET') {
      return notImplemented('GET /api/attempts');
    }
    if (path.match(/^\/api\/attempts\/[^/]+$/) && method === 'GET') {
      return notImplemented(`GET ${path}`);
    }

    // 404 fallback
    return json({ error: 'Not found', path }, 404);
  },
});

console.log(`StudyBug server running at http://localhost:${server.port}`);
