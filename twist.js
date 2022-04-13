#!/usr/bin/env node

const packageJson = require("./package.json");
const semver = require("semver");
const version = packageJson.engines.node;

if (!semver.satisfies(process.version, version)) {
    const rawVersion = version.replace(/[^\d\.]*/, "");
    console.log(
        `Twist requires Node v${rawVersion} or newer and you're using ${process.version}`
    );
    process.exit(1);
}

const path = require("path");
const cwd = process.cwd();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

let srcDir = argv?.src ?? "./src";
srcDir = path.resolve(cwd, srcDir);

let outDir = argv?.out ?? "./public/js";
outDir = path.resolve(cwd, outDir);

let pathOverride = argv?.path?.trim()?.replace(/\/$/, "") ?? ".";

let config = argv?.config ?? null;
if (config !== null) {
    config = require(path.resolve(cwd, config));
} else {
    config = {};
}
if (typeof config !== "object") {
    config = {};
}

if (argv?.minify) {
    const minify = argv.minify === "false" ? false : true;
    config.minify = minify;
}

let type = "none";
if (argv?.type) {
    type = argv.type?.toString().toLowerCase();
}
const types = ["esbuild", "tsc", "bable", "none"];
if (!types.includes(type)) {
    console.log(
        `Invalid type: ${type}. Only ${types.join(", ")} are supported.`
    );
    process.exit(1);
}

const fs = require("fs");
const tempDir = path.join(__dirname, "temp");
if (fs.existsSync(tempDir)) {
    cleanup();
}
fs.mkdirSync(tempDir);

let options = {};
switch (type) {
    case "esbuild":
        options = Object.assign(
            {
                bundle: false,
                minify: true,
                format: "esm",
                target: "es2020",
            },
            config
        );
        options.outdir = tempDir;
    default:
        break;
}

const glob = require("glob");
const tsFiles = glob.sync(`${srcDir}/**/*.ts`) ?? [];
for (let i = tsFiles.length - 1; i >= 0; i--) {
    if (tsFiles[i].indexOf(".d.ts") !== -1) {
        tsFiles.splice(i, 1);
    }
}
const jsFiles = glob.sync(`${srcDir}/**/*.js`) ?? [];
const jsxFiles = glob.sync(`${srcDir}/**/*.jsx`) ?? [];
const tsxFiles = glob.sync(`${srcDir}/**/*.tsx`) ?? [];
const mjsFiles = glob.sync(`${srcDir}/**/*.mjs`) ?? [];
const cjsFiles = glob.sync(`${srcDir}/**/*.cjs`) ?? [];

let files = [];
if (type === "none") {
    files = [...jsFiles, ...cjsFile, ...mjsFiles];
} else {
    files = [
        ...tsFiles,
        ...jsFiles,
        ...jsxFiles,
        ...tsxFiles,
        ...mjsFiles,
        ...cjsFiles,
    ];
}

switch (type) {
    case "esbuild":
        options.entryPoints = files;
        const { build } = require("esbuild");
        build(options)
            .then(async () => {
                await scrub();
                if (fs.existsSync(outDir)) {
                    await fs.promises.rm(outDir, { recursive: true });
                }
                await fs.promises.mkdir(outDir, { recursive: true });
                await relocate();
                cleanup();
            })
            .catch((e) => {
                console.log(e);
                process.exit(1);
            });
    default:
        new Promise((resolve, reject) => {
            let copied = 0;
            for (let i = 0; i < files.length; i++) {
                const fileName = files[i].replace(/.*[\/\\]/, "");
                fs.copyFile(files[i], path.join(tempDir, fileName), (error) => {
                    if (error) {
                        reject(error);
                    }
                    copied++;
                    if (copied === files.length) {
                        resolve();
                    }
                });
            }
        })
            .then(async () => {
                await scrub();
                if (fs.existsSync(outDir)) {
                    await fs.promises.rm(outDir, { recursive: true });
                }
                await fs.promises.mkdir(outDir, { recursive: true });
                await relocate();
                cleanup();
            })
            .catch((error) => {
                console.log(error);
                process.exit(1);
            });
        break;
}

function scrub() {
    const { v4: uuid } = require("uuid");
    return new Promise((resolve) => {
        const files = glob.sync(`${tempDir}/**/*.js`) ?? [];
        let scrubbed = 0;
        for (let i = 0; i < files.length; i++) {
            const filePath = files[i];
            fs.readFile(filePath, (error, buffer) => {
                if (error) {
                    console.log(error);
                    process.exit(1);
                }

                let data = buffer.toString();

                /** Grab everything between the string values for the import statement */
                let importFilePaths = data.match(
                    /(?<=from[\'\"]).*?(?=[\'\"]\;)|(?<=from\s+[\'\"]).*?(?=[\'\"]\;)/g
                );
                if (importFilePaths) {
                    importFilePaths.map((path) => {
                        if (
                            new RegExp(/^(http\:\/\/)|^(https\:\/\/)/).test(
                                path
                            ) === false
                        ) {
                            /** Remove everything in the path except the file name */
                            let pathFileName = path
                                .replace(/.*[\/\\]/g, "")
                                .replace(
                                    /\.ts$|\.js$|\.mjs$|\.cjs$|\.jsx$|\.tsx$/g,
                                    ""
                                )
                                .trim();
                            data = data.replace(
                                `"${path}"`,
                                `"${pathOverride}/${pathFileName}.js"`
                            );
                            data = data.replace(
                                `'${path}'`,
                                `"${pathOverride}/${pathFileName}.js"`
                            );
                        }
                    });
                }

                const uid = uuid();
                fs.writeFile(`${tempDir}/${uid}`, data, (error) => {
                    if (error) {
                        console.log(error);
                        process.exit(1);
                    }
                    fs.copyFile(`${tempDir}/${uid}`, filePath, (error) => {
                        if (error) {
                            console.log(error);
                            process.exit(1);
                        }
                        scrubbed++;
                        if (scrubbed === files.length) {
                            resolve();
                        }
                    });
                });
            });
        }
    });
}

function relocate() {
    return new Promise((resolve) => {
        const files = glob.sync(`${tempDir}/**/*.js`) ?? [];
        if (!files.length) {
            resolve();
        }
        let relocated = 0;
        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].replace(/.*[\///]/, "").trim();
            fs.copyFile(files[i], path.join(outDir, fileName), (error) => {
                if (error) {
                    console.log(error);
                    process.exit(1);
                }
                relocated++;
                if (relocated === files.length) {
                    resolve();
                }
            });
        }
    });
}

function cleanup() {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
}
