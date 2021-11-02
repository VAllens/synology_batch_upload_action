const { resolve } = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    target: 'node',
    resolve: {
        fallback: {
            fs: false
        }
    },
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'dist')
    }
}
