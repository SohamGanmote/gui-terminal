const fileUtils = require("./fileUtils");
const nav = require("./navigation");
const { render } = require("./ui");

function handleKeypress(str, key) {
	if (key.name === "up") nav.moveSelection(-1);
	else if (key.name === "down") nav.moveSelection(1);
	else if (key.name === "h") {
		fileUtils.showHidden = !fileUtils.showHidden;
		nav.resetSelection();
	} else if (key.name === "return") {
		nav.openSelected();
	} else if (key.name === "backspace") {
		const path = require("path");
		const parent = path.dirname(fileUtils.cwd);
		fileUtils.cwd = parent || "/";
		nav.resetSelection();
	} else if (key.name === "q" || (key.ctrl && key.name === "c")) {
		process.exit(0);
	}

	render();
}

module.exports = handleKeypress;
