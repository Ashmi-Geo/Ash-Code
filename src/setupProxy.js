const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/number',
    createProxyMiddleware({
      target: 'https://localhost:5000',
      changeOrigin: true,
    })
  );
};
