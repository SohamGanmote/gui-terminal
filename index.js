#!/usr/bin/env node
const readline = require("readline");
const { render } = require("./ui");
const handleKeypress = require("./keyHandler");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", handleKeypress);

render();
