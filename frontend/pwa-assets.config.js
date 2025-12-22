import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

export const manifestForPlugIn = {
  registerType:'prompt',
  includeAssests:['favicon.ico', "apple-touch-icon-180x180.png", "masked-icon-512x512.png", "pwa-192x192.png", "pwa-512x512.png"],
  manifest:{
    name:"EOD Map Viewer",
    short_name:"EOD Map Viewer",
    description:"Interactive Earth Observation dashboard that visualizes real-world geospatial data",
    icons:[{
      src: '/pwa-192x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'/pwa-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: '/apple-touch-icon-180x180.png',
      sizes:'180x180',
      type:'image/png',
      purpose:'apple touch icon',
    },
    {
      src: '/maskable_icon-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable',
    }
  ],
  theme_color:'#171717',
  background_color:'#f0e7db',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  images: ['public/logo.png']
})