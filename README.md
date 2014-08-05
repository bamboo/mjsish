# mjsish
[![build Status][travis-ci-img]][travis-ci-link]
[![dependency status][dm-status-img]][dm-status-link]
[![dev dependency status][dev-dm-status-img]][dev-dm-status-link]

[Metascript][metascript] interactive shell and IDE supporting tools.

## Setup

```
npm install -g mjsish
```

## Usage

_mjsish_ starts a vanilla metascript repl.

The repl accumulates lines until an empty line or a line ending in a semicolon is entered and then evaluates the whole input. It has basic readline support but you might get a better experience at this point by using rlwrap.

```
rlwrap mjsish --no-tty
```

_mjsish -j_ gets the repl to output the generated javascript code before evaluation.

## Todo

* when starting the repl from a nodejs package directory, _require_ should be relative to the package
* repl should remember #metaimport directives
* --metaimport command line to automatically import macros into the repl environment
* server mode
 * symbol server - watches a directory with mjs files and allow queries for symbol locations
* TAB completion
* --require command line to automatically inject modules into the repl environment

[travis-ci-img]: https://travis-ci.org/bamboo/mjsish.svg?branch=master
[travis-ci-link]: https://travis-ci.org/bamboo/mjsish
[dm-status-img]: https://david-dm.org/bamboo/mjsish.svg
[dm-status-link]: https://david-dm.org/bamboo/mjsish
[dev-dm-status-img]: https://david-dm.org/bamboo/mjsish/dev-status.svg
[dev-dm-status-link]: https://david-dm.org/bamboo/mjsish#info=devDependencies
[metascript]: https://github.com/massimiliano-mantione/metascript
