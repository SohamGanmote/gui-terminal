const path = require("path");
const { spawnSync } = require("child_process");
const fs = require("fs");
const fileUtils = require("./fileUtils");

let selected = 0;

function moveSelection(delta) {
	const items = fileUtils.getItems();
	selected = (selected + delta + items.length) % items.length;
}

function openSelected() {
	const items = fileUtils.getItems();
	const choice = items[selected];
	if (!choice) return;

	if (choice === "[Logout]") {
		process.stdout.write("\x1b[2J\x1b[H");
		process.exit(0);
	} else if (choice === ".. (Go Up)") {
		const parent = path.dirname(fileUtils.cwd);
		fileUtils.cwd = parent || "/";
		selected = 0;
	} else {
		const full = path.join(fileUtils.cwd, choice);
		if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
			fileUtils.cwd = full;
			selected = 0;
		} else if (fs.existsSync(full) && fs.statSync(full).isFile()) {
			const textExt = [
				".txt",
				".js",
				".json",
				".md",
				".py",
				".sh",
				".log",
				".ts",
				".yaml",
				".yml",
				".ini",
				".conf",
				".css",
				".html",
			];
			if (textExt.includes(path.extname(full).toLowerCase())) {
				process.stdin.setRawMode(false);
				spawnSync("nano", [full], { stdio: "inherit" });
				process.stdin.setRawMode(true);
			} else {
				console.log(`⚠️ Cannot open non-text file: ${choice}`);
				console.log("Press any key to return...");
			}
		}
	}
}

function resetSelection() {
	selected = 0;
}

function getSelected() {
	return fileUtils.getItems()[selected];
}

module.exports = {
	moveSelection,
	openSelected,
	resetSelection,
	getSelected,
	get selected() {
		return selected;
	},
	set selected(v) {
		selected = v;
	},
};
