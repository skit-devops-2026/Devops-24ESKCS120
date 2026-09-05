const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = process.cwd();
const buildDir = path.join(root, "build");

function removeDirectory(directory) {
    if (fs.existsSync(directory)) {
        fs.rmSync(directory, {
            recursive: true,
            force: true
        });
    }
}

function copyDirectory(source, destination) {
    if (!fs.existsSync(source)) {
        return;
    }

    fs.cpSync(source, destination, {
        recursive: true
    });
}

console.log("=================================");
console.log("Building Project Management SaaS");
console.log("=================================");

// Clean previous build.
removeDirectory(buildDir);
fs.mkdirSync(buildDir, { recursive: true });

// Copy application files.
const htmlFiles = fs
    .readdirSync(root)
    .filter(file => file.endsWith(".html"));

for (const file of htmlFiles) {
    fs.copyFileSync(
        path.join(root, file),
        path.join(buildDir, file)
    );
}

copyDirectory(
    path.join(root, "css"),
    path.join(buildDir, "css")
);

copyDirectory(
    path.join(root, "js"),
    path.join(buildDir, "js")
);

// Get current Git commit SHA.
let commit = "unknown";

try {
    commit = execSync(
        "git rev-parse --short HEAD",
        { encoding: "utf8" }
    ).trim();
} catch {
    console.warn("Could not determine Git commit SHA.");
}

// Generate health endpoint file.
const health = {
    status: "ok",
    commit: commit
};

fs.writeFileSync(
    path.join(buildDir, "health.json"),
    JSON.stringify(health, null, 2) + "\n"
);

// Verify build.
if (!fs.existsSync(path.join(buildDir, "index.html"))) {
    console.error("Build FAILED: build/index.html was not generated.");
    process.exit(1);
}

if (!fs.existsSync(path.join(buildDir, "health.json"))) {
    console.error("Build FAILED: build/health.json was not generated.");
    process.exit(1);
}

console.log(`Build completed successfully.`);
console.log(`Commit: ${commit}`);
console.log(`Output: ${buildDir}`);