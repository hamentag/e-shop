import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const serverPort = process.env.PORT || 3000;
const serverChatPort = process.env.CHAT_PORT || 5000;

console.log(`api need to be running on port ${serverPort}`);
console.log(`chat need to be running on port ${serverChatPort}`);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://localhost:${serverPort}`,
      '/chat': `http://localhost:${serverChatPort}`
    }
  }
})
