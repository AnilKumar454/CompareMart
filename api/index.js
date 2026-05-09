const app = require('../backend/server.js');

module.exports = (req, res) => {
  // Vercel strips the '/api' prefix from req.url for functions in the api directory.
  // We prepend it back so that Express routing (e.g., app.use('/api/auth')) works correctly.
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  return app(req, res);
};
