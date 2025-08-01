import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    server: isDev
      ? {
          https: {
            key: fs.readFileSync('./certs/infracod.local-key.pem'),
            cert: fs.readFileSync('./certs/infracod.local.pem'),
          }
        }
      : {},
  };
});
