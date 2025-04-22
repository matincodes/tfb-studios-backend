import http from 'http';

import { config as env } from './src/config/env.js';

import app from './src/app.js';

const port = env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});