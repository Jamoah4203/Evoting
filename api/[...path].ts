import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../server/index';

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!app) {
    app = createServer();
  }

  // Ensure the path starts with /api
  if (!req.url?.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }

  return app(req, res);
}
