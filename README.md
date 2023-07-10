# Twist

A simple build tool for wrangling your ES Module static import paths.

## Install

```bash
npm i -S @codewithkyle/twist
```

## Usage

By default we will look for JavaScript/TypeScript files in the `src/` directory and will output to the `public/js` directory. If you do not provide a `--config` flag we will use the default options based on the transpiler you've selected.

You can also provide the `--path` flag if you need to remap your imports to a CDN/external URL.

```bash
twist --src=./path-to/source --out=./public/js --type=esbuild --config=./esbuild.config.js --path='https://cdn.example.com/'
```

If you are using dynamic imports you can add the `--dynamic` flag.

### Build Types

-   `none` the source code (JavaScript) will only be scrubbed & relocated.
-   `tsc` the source code will be transpiled using the `typescript` package before being scrubbed and relocated.
-   `esbuild` the source code will be transpiled using the `esbuild` package before being scrubbed and relocated.
-   `babel` the source code will be transpired using the `@babel/core` pacakge before being scrubbed and relocated.

> **Note:** this library uses peer dependencies. You must install `typescript`, `esbuild`, or `@babel/core` to transpile the source code.
