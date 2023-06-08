import path from "path";
import viteCompression from "vite-plugin-compression";
import eslintPlugin from "vite-plugin-eslint";

export default (mode) => ({
    plugins: [
        viteCompression({ filter: /\.(js|css|map)$/, algorithm: "gzip", ext: ".gz" }),
        viteCompression({ filter: /\.(js|css|map)$/, algorithm: "brotliCompress", ext: ".br" }),
        eslintPlugin({ cache: true }),
    ],

    sourcemap: mode === "development",

    build: {
        outDir: "build",
        sourcemap: mode === "development",
        minify: !mode === "development",
        brotliSize: false,
        emptyOutDir: true,
    },

    optimizeDeps: {
        include: ["lodash-es"],
        allowNodeBuiltins: true,
    },

    resolve: {
        alias: [{ find: /^@\//, replacement: path.resolve(__dirname, "./src/") + "/" }],
    },

    server: {
        proxy: {
            // Allows us to run the proxy server independent of the content, and still
            // get full-service.
            "/api/": {
                target: "http://localhost:3001/",
                changeOrigin: true,
            },
            "/images/": {
                target: "http://localhost:3001/",
            },
        },
    },
});
