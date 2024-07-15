// import express from 'express';
// import path from 'path';
// // Import the createServer function from Vite's node API
// import { createServer as createViteServer } from 'vite';
// import { createProxyMiddleware } from 'http-proxy-middleware'; // Import the package


// const app = express();
// const PORT = process.env.PORT || 5173;
// const isProduction = process.env.NODE_ENV === 'production';

// app.use('/api-a', createProxyMiddleware({ target: 'https://ea.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));
// app.use('/api-b', createProxyMiddleware({ target: 'https://eb.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));
// app.use('/api-c', createProxyMiddleware({ target: 'https://ec.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));
// app.use('/api-d', createProxyMiddleware({ target: 'https://ed.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));
// app.use('/api-e', createProxyMiddleware({ target: 'https://ee.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));
// app.use('/api-f', createProxyMiddleware({ target: 'https://ef.netmagcdn.com:2228/hls-playback/', changeOrigin: true }));


// async function startServer() {
//   if (!isProduction) {
//     // In development mode, use Vite's server for middleware
//     const vite = await createViteServer({
//       server: { middlewareMode: true},
//     });
//     app.use(vite.middlewares);
//   } else {
//     // In production mode, serve static files
//     app.use(express.static(path.join(__dirname, 'dist')));

//     // Handle SPA fallback
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//     });
//   }

//   // Start the server
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// }

// startServer();