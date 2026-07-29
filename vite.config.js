import path, {dirname} from "path"
import vue from "@vitejs/plugin-vue"
import {defineConfig, loadEnv} from "vite"
import Inspect from 'vite-plugin-inspect';
import vueDevTools from 'vite-plugin-vue-devtools';
import {fileURLToPath} from "url";
import eslintPlugin from "vite-plugin-eslint";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default ({mode}) => {
    const env = loadEnv(mode, process.cwd());
    console.log('环境变量', env)
    return defineConfig({
        base: mode === 'production' ? '/daka-eagle-eye/' : '/',
        plugins: [
            vue(),
            Inspect(),
            vueDevTools({componentInspector: false}),
            eslintPlugin({
                // 关键的一个设置 否则每次都要重新启动才能检查
                cache: false,
                // 检查的文件
                include: ["src/*.vue", "src/**/*.vue", "src/*.js", "src/**/*.js", "src/*.jsx", "src/**/*.jsx"],
                // 引发错误
                emitError: true,
                // 不显示plugin的那个长错误
                failOnError: true
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: Number(env.VITE_SERVER_PORT),
            host: true,
            proxy: {},
        },
    });
}
