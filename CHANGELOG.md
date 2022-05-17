# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] - 2022-05-17

### Fixed

-   unresolved promise bug
-   `clean/` directory name conflict with internal folder structures
-   fixed directory read error bug

### Removed

-   unused `uuid` dependency

## [2.0.0] - 2022-04-13

### Added

-   new build types ([#10](https://github.com/codewithkyle/twist/issues/10))
    -   esbuild
    -   babel
    -   tsc (TypeScript)
    -   none

### Removed

-   [esbuild](https://esbuild.github.io/) dependency ([#10](https://github.com/codewithkyle/twist/issues/10))

## [1.5.1] - 2021-12-21

### Fixed

-   minify flag bug ([#9](https://github.com/codewithkyle/twist/issues/9))

## [1.5.0] - 2021-11-06

### Added

-   `--minify` flag support ([#8](https://github.com/codewithkyle/twist/issues/8))
-   custom configs are now applied to the default config instead of replacing it (required to support future flags)

### Updated

-   esbuild from v0.8 to v0.13

## [1.4.0] - 2021-09-12

### Added

-   optional `path` flag allows developers to remap imports to a CDN or external URL

### Fixed

-   TypeScript declaration file bug ([#6](https://github.com/codewithkyle/twist/issues/6))

## [1.3.1] - 2021-07-13

### Fixed

-   TypeScript declaration file bug ([#5](https://github.com/codewithkyle/twist/issues/5))

## [1.3.0] - 2021-05-29

### Added

-   support for the `--skip-build` flag ([#4](https://github.com/codewithkyle/twist/issues/4))

### Updated

-   esbuild to [v0.12.5](https://github.com/evanw/esbuild/releases/tag/v0.12.5)

### Fixed

-   single quote static import statements where not being scrubbed correctly
-   now scrubbing mjs, cjs, jsx, and tsx file extensions from static import paths

## [1.2.0] - 2021-05-26

### Updated

-   esbuild to [v0.12.3](https://github.com/evanw/esbuild/releases/tag/v0.12.3)

## [1.1.0] - 2021-05-07

### Added

-   support for the following file formats:
    -   `.jsx`
    -   `.tsx`
    -   `.mjs`
    -   `.cjs`

## [1.0.1] - 2021-04-09

### Fixed

-   import path scrubbing bug

## [1.0.0] - 2021-03-27

### Added

-   basic static import scrubbing
-   esbuild config override flag
-   source directory override flag
-   output directory override flag

[unreleased]: https://github.com/codewithkyle/twist/compare/v2.0.2...HEAD
[2.0.2]: https://github.com/codewithkyle/twist/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/codewithkyle/twist/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/codewithkyle/twist/compare/v1.5.1...v2.0.0
[1.5.1]: https://github.com/codewithkyle/twist/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/codewithkyle/twist/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/codewithkyle/twist/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/codewithkyle/twist/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/codewithkyle/twist/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codewithkyle/twist/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codewithkyle/twist/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/codewithkyle/twist/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/codewithkyle/twist/releases/tag/v1.0.0
