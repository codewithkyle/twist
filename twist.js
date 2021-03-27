#!/usr/bin/env node

const packageJson = require("./package.json");
const semver = require("semver");
const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, "");
    console.log(`Twist requires Node v${rawVersion} or newer and you're using ${process.version}`);
    process.exit(1);
}

const path = require("path");
const cwd = process.cwd();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

let srcDir = argv.src ?? "./src";
srcDir = path.resolve(cwd, srcDir);

let outDir = argv.output ?? "./public/js";
outDir = path.resolve(cwd, outDir);

let config = argv.config ?? null;
if (config !== null){
    config = require(path.resolve(cwd, config));
}

const fs = require("fs");
const tempDir = path.join(__dirname, "temp");
if (fs.existsSync(tempDir)){
    fs.rmdirSync(tempDir, {recursive: true});
}
fs.mkdirSync(tempDir);

const esbuildOptions = config ?? {
    bundle: false,
    minify: true,
    format: "esm",
    target: "es2020",
};
esbuildOptions.outdir = tempDir;

const glob = require("glob");
const tsFiles = glob.sync(`${srcDir}/**/*.ts`) ?? [];
const jsFiles = glob.sync(`${srcDir}/**/*.js`) ?? [];
const files = [...tsFiles, ...jsFiles];
esbuildOptions.entryPoints = files;

const { build } = require('esbuild');
build(esbuildOptions)
.then(async () => {
    if (fs.existsSync(outDir)){
        await fs.promises.rmdir(outDir, {recursive: true});
    }
    await fs.promises.mkdir(outDir, {recursive: true});
    await relocate();
    cleanup();
})
.catch((e) => {
    console.log(e);
    process.exit(1);
});

function relocate(){
    return new Promise((resolve) => {
        const files = glob.sync(`${tempDir}/**/*.js`) ?? [];
        if (!files.length){
            resolve();
        } 
        let relocated = 0;
        for (let i = 0; i < files.length; i++){
            const fileName = files[i].replace(/.*[\///]/, "").trim();
            fs.copyFile(files[i], path.join(outDir, fileName), (error) => {
                if (error){
                    console.log(error);
                    process.exit(1);
                }
                relocated++;
                if (relocated === files.length){
                    resolve();
                }
            });
        }
    });
    
}

function cleanup(){
    fs.rmdirSync(tempDir, {recursive: true});
}
