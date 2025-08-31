const fs = require("fs");
const path = require("path");

let cwd = process.env.HOME;
let showHidden = false;

function formatBytes(bytes) {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let n = bytes;
	let u = 0;
	while (n >= 1024 && u < units.length - 1) {
		n /= 1024;
		u++;
	}
	return `${n.toFixed(n < 10 && u > 0 ? 1 : 0)} ${units[u]}`;
}

function getItems() {
	let items = [];
	try {
		items = fs.readdirSync(cwd);
	} catch {
		items = [];
	}

	if (!showHidden) {
		items = items.filter((f) => !f.startsWith("."));
	}

	items.sort();
	items.unshift(".. (Go Up)");

	if (cwd === "/" || cwd === "/home" || /^\/home\/[^/]+$/.test(cwd)) {
		items.push("[Logout]");
	}
	return items;
}

function displayName(f) {
	if (f === "[Logout]") return "🔴 Logout";
	if (f === ".. (Go Up)") return "<== Back";

	const full = path.join(cwd, f);
	if (!fs.existsSync(full)) return f;

	const stat = fs.statSync(full);
	const isHidden = path.basename(f).startsWith(".");

	if (stat.isDirectory()) {
		return isHidden
			? "\x1b[2;34m📁 " + f + "\x1b[0m"
			: "\x1b[1;34m📁 " + f + "\x1b[0m";
	} else {
		return isHidden
			? "\x1b[2;37m📄 " + f + "\x1b[0m"
			: "\x1b[0;37m📄 " + f + "\x1b[0m";
	}
}

function getItemInfo(f) {
	if (f === "[Logout]") return "Logout from session";
	if (f === ".. (Go Up)") return "Go to parent folder";

	const full = path.join(cwd, f);
	if (!fs.existsSync(full)) return "";

	const stat = fs.statSync(full);
	if (stat.isDirectory()) {
		let count = 0;
		try {
			count = fs.readdirSync(full).length;
		} catch {}
		return `Folder • ${count} items`;
	} else if (stat.isFile()) {
		return `File • ${formatBytes(stat.size)}`;
	}
	return "";
}

module.exports = {
	get cwd() {
		return cwd;
	},
	set cwd(v) {
		cwd = v;
	},
	get showHidden() {
		return showHidden;
	},
	set showHidden(v) {
		showHidden = v;
	},
	getItems,
	displayName,
	getItemInfo,
	formatBytes,
};
