import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api-a':{
        target:'https://ea.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-a/,'')
      },
      '/api-b':{
        target:'https://eb.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-b/,'')
      },
      '/api-c':{
        target:'https://ec.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-c/,'')
      },
      '/api-d':{
        target:'https://ed.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-d/,'')
      },
      '/api-e':{
        target:'https://ee.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-e/,'')
      },
      '/api-f':{
        target:'https://ef.netmagcdn.com:2228/hls-playback/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-f/,'')
      },
      '/api-sub':{
        target:'https://s.megastatics.com/subtitle/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-sub/,'')
      },
      '/api-thumb':{
        target:'https://s.megastatics.com/thumbnails/',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api-thumb/,'')
      }
    }
  }
});
