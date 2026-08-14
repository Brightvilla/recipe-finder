#!/usr/bin/env node
/**
 * check.js — a small project health-check CLI for The Recipe Box.
 *
 * Run before every commit/submission with:  npm run check
 *
 * It doesn't replace real testing — it's a fast, repeatable sanity pass
 * that catches the kind of small issues (leftover console.logs, a stale
 * README, an unused .env.example) that are easy to miss by eye but easy
 * for a grader to spot.
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";

const results = []; // { name, pass, detail }

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
}

function section(title) {
  console.log(`\n${BOLD}${title}${RESET}`);
}

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString();
}

function walk(dir, exts, ignore = ["node_modules", "dist", "venv", ".git"]) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    if (ignore.includes(entry)) continue;
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      files = files.concat(walk(full, exts, ignore));
    } else if (exts.includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------
// 1. Build & lint
// ---------------------------------------------------------------------
section("Build & Lint");

try {
  run("npm run build");
  record("Production build succeeds", true);
} catch (err) {
  record("Production build succeeds", false, err.stdout?.toString().slice(-400));
}

try {
  const out = run("npm run lint");
  const hasErrors = /\d+ errors?/.test(out) && !/0 errors/.test(out);
  record("Lint has zero errors", !hasErrors, hasErrors ? out.slice(-400) : "");
} catch (err) {
  record("Lint has zero errors", false, err.stdout?.toString().slice(-400));
}

// ---------------------------------------------------------------------
// 2. Source hygiene
// ---------------------------------------------------------------------
section("Source Hygiene");

const srcFiles = existsSync(join(ROOT, "src"))
  ? walk(join(ROOT, "src"), [".js", ".jsx"])
  : [];

const leftoverLogs = [];
const todoMarkers = [];
for (const file of srcFiles) {
  const content = readFileSync(file, "utf-8");
  const relative = file.replace(ROOT + "/", "");
  if (/console\.(log|debug)\(/.test(content)) {
    leftoverLogs.push(relative);
  }
  if (/\b(TODO|FIXME|XXX)\b/.test(content)) {
    todoMarkers.push(relative);
  }
}

record(
  "No leftover console.log/debug in src/",
  leftoverLogs.length === 0,
  leftoverLogs.join(", ")
);
record(
  "No unresolved TODO/FIXME markers in src/",
  todoMarkers.length === 0,
  todoMarkers.join(", ")
);

// ---------------------------------------------------------------------
// 3. Documentation
// ---------------------------------------------------------------------
section("Documentation");

const readmePath = join(ROOT, "README.md");
if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, "utf-8");
  const requiredSections = [
    ["Setup", /##.*setup/i],
    ["Tech stack / technologies used", /##.*(tech|stack)/i],
    ["API reference or endpoints", /##.*(api|endpoint)/i],
  ];
  for (const [label, pattern] of requiredSections) {
    record(`README documents: ${label}`, pattern.test(readme));
  }
  record("README is a substantive length (300+ words)", readme.split(/\s+/).length > 300);
} else {
  record("README.md exists", false);
}

record(".env.example present (no real secrets committed)", existsSync(join(ROOT, ".env.example")));
record(".gitignore present", existsSync(join(ROOT, ".gitignore")));

// ---------------------------------------------------------------------
// 4. Git hygiene
// ---------------------------------------------------------------------
section("Git Hygiene");

try {
  const isRepo = run("git rev-parse --is-inside-work-tree").trim() === "true";
  record("Git repository initialized", isRepo);

  if (isRepo) {
    const log = run('git log --oneline -n 50 2>/dev/null || echo ""');
    const commitCount = log.trim() ? log.trim().split("\n").length : 0;
    record(
      "More than one commit (incremental history, not a single dump)",
      commitCount > 1,
      `${commitCount} commit(s) found`
    );

    const status = run("git status --porcelain");
    record("No uncommitted changes at time of check", status.trim() === "", status.trim());
  }
} catch {
  record("Git repository initialized", false, "Not a git repo yet — run `git init`");
}

// ---------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------
section("Summary");

let passed = 0;
for (const { name, pass, detail } of results) {
  const icon = pass ? `${GREEN}✔${RESET}` : `${RED}✘${RESET}`;
  console.log(`  ${icon} ${name}`);
  if (!pass && detail) {
    console.log(`     ${YELLOW}${detail.toString().trim().slice(0, 200)}${RESET}`);
  }
  if (pass) passed += 1;
}

const total = results.length;
const pct = Math.round((passed / total) * 100);
const color = pct === 100 ? GREEN : pct >= 80 ? YELLOW : RED;

console.log(`\n${BOLD}${color}${passed}/${total} checks passed (${pct}%)${RESET}\n`);

process.exit(passed === total ? 0 : 1);
