import { defineConfig } from "vite"
import { ViteEjsPlugin } from "vite-plugin-ejs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { glob } from "glob"
import htmlPurge from "vite-plugin-purgecss"
import postcssPresetEnv from "postcss-preset-env"

import liveReload from "vite-plugin-live-reload"

function moveOutputPlugin() {
  return {
    name: "move-output",
    enforce: "post",
    apply: "build",
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith("pages/")) {
          const newFileName = fileName.slice("pages/".length)
          bundle[fileName].fileName = newFileName
        }
      }
    }
  }
}

export default defineConfig({
  // base 的寫法：
  // base: '/Repository 的名稱/'
  base: "/hxsl-glasses-official-website/",
  plugins: [
    liveReload(["./layout/**/*.ejs", "./pages/**/*.ejs", "./pages/**/*.html"]),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    htmlPurge({}),
    postcssPresetEnv({
      stage: 3,
      features: {
        "logical-properties-and-values": false,
        "opacity-percentage": true
      }
    })
  ],
  server: {
    // 啟動 server 時預設開啟的頁面
    open: "pages/index.html"
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync("pages/**/*.html")
          .map((file) => [
            path.relative(
              "pages",
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url))
          ])
      )
    },
    outDir: "dist"
  }
})
