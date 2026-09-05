const fs = require("fs");
const path = require("path");

const root = process.cwd();

const requiredFiles = [
    "index.html",
    "board.html",
    "project-details.html",
    "projects.html",
    "settings.html",
    "tasks.html",
    "team.html",
    "README.md"
];

const requiredDirectories = [
    "css",
    "js",
    "scripts",
    "docs",
    "monitoring",
    "k8s"
];

let failed = false;

function check(condition, message) {
    if (condition) {
        console.log(`PASS: ${message}`);
    } else {
        console.error(`FAIL: ${message}`);
        failed = true;
    }
}

console.log("=================================");
console.log("Project Management SaaS Tests");
console.log("=================================");

for (const file of requiredFiles) {
    check(
        fs.existsSync(path.join(root, file)),
        `Required file exists: ${file}`
    );
}

for (const directory of requiredDirectories) {
    check(
        fs.existsSync(path.join(root, directory)),
        `Required directory exists: ${directory}`
    );
}

// Validate HTML files are not empty and contain basic HTML structure.
for (const file of requiredFiles.filter(file => file.endsWith(".html"))) {
    const filePath = path.join(root, file);

    if (!fs.existsSync(filePath)) {
        continue;
    }

    const content = fs.readFileSync(filePath, "utf8");

    check(
        content.trim().length > 0,
        `${file} is not empty`
    );

    check(
        /<html[\s>]/i.test(content),
        `${file} contains an HTML document`
    );
}

// Check JavaScript directory.
const jsDirectory = path.join(root, "js");

if (fs.existsSync(jsDirectory)) {
    const jsFiles = fs
        .readdirSync(jsDirectory)
        .filter(file => file.endsWith(".js"));

    check(
        jsFiles.length > 0,
        "JavaScript source files exist"
    );
}

// Check CSS directory.
const cssDirectory = path.join(root, "css");

if (fs.existsSync(cssDirectory)) {
    const cssFiles = fs
        .readdirSync(cssDirectory)
        .filter(file => file.endsWith(".css"));

    check(
        cssFiles.length > 0,
        "CSS source files exist"
    );
}

console.log("=================================");

if (failed) {
    console.error("Tests FAILED.");
    process.exit(1);
}

console.log("All tests PASSED.");