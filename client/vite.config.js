// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// console.log(import.meta.env.REACT_APP_BACKENDURI);

  export default defineConfig({
    server: {
      host: '0.0.0.0',
      port: 4562,
      allowedHosts: ['role-panel-1.onrender.com'],
      proxy: {
        '/api': {
          target: "https://role-panel-1.onrender.com",
          changeOrigin: true,
          secure: false,
        },
      },
        
    },
    plugins: [react()],
});