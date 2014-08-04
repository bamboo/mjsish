# mjsish
[![Build Status](https://travis-ci.org/bamboo/mjsish.svg?branch=master)](https://travis-ci.org/bamboo/mjsish)

[Metascript](https://github.com/massimiliano-mantione/metascript) interactive shell and IDE supporting tools.

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
