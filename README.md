# Twist

A simple build tool for wrangling your ES Module static import paths.

## Install

```bash
npm i -S @codewithkyle/twist
```

## Usage

By default we will look for JavaScript/TypeScript files in the `src/` directory and will output to the `public/js` directory. If you do not provide a `--config` flag we will use the esbuild options displayed in the example below.

```json
// package.json
{
    "scripts": {
        "build": "twist --src=./path-to/source --outdir=./public/js --config=./esbuild.config.js"
    }
}
```

```javascript
// esbuild.config.js -- https://esbuild.github.io/api/
module.exports = {
    bundle: false,
    minify: true,
    format: "esm",
    target: "es2020",
}
```