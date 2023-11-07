const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
        target: 'http://165.22.73.102:8000',
        changeOrigin: true,
        })
    );
};