const fileUtils = require("./fileUtils");
const nav = require("./navigation");

function clear() {
	process.stdout.write("\x1b[2J\x1b[H");
}

function render() {
	clear();
	const items = fileUtils.getItems();
	const height = process.stdout.rows || 24;

	console.log(`📂 File Browser - ${fileUtils.cwd}\n`);

	items.forEach((f, i) => {
		const marker = i === nav.selected ? "▶ " : "  ";
		const name = fileUtils.displayName(f);
		if (i === nav.selected) {
			console.log(marker + "\x1b[7m" + name + "\x1b[0m");
		} else {
			console.log(marker + name);
		}
	});

	process.stdout.write(`\x1b[${height};1H\x1b[2K`);
	const selectedItem = nav.getSelected();
	const info = selectedItem ? fileUtils.getItemInfo(selectedItem) : "";

	process.stdout.write(
		"\x1b[1;34m[↑/↓] Move\x1b[0m | " +
			"\x1b[1;32m[Enter] Open\x1b[0m | " +
			"\x1b[1;33m[Backspace] Up\x1b[0m | " +
			"\x1b[36m[h] See hidden files/folders\x1b[0m | " +
			"\x1b[1;31m[q] Quit\x1b[0m" +
			(info ? "  |  " + info : "")
	);
	process.stdout.write("\x1b[0m");
}

module.exports = { render, clear };
