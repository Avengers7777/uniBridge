// Vercel Serverless Function Entry Point
// Using dynamic import to handle ESM modules properly

let appHandler = null;

async function getApp() {
  if (!appHandler) {
    const { default: app } = await import('../backend/server.js');
    appHandler = app;
  }
  return appHandler;
}

export default async function handler(req, res) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
