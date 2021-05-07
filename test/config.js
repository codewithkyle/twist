module.exports = {
    bundle: false,
    minify: true,
    format: "esm",
    target: "es2020",
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    loader: {
        '.jsx': 'jsx'
    }
}