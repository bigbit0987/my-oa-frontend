// postcss.config.js
export default {
    plugins: {
        '@tailwindcss/postcss': {}, // 按照 ADR-006 指引配置
        'autoprefixer': {},
    },
}