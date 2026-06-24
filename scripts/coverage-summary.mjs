import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const outputIndex = process.argv.indexOf("--output");
const outputPath =
  outputIndex === -1 ? ".coverage/coverage-summary.md" : process.argv[outputIndex + 1];
const thresholdIndex = process.argv.indexOf("--threshold");
const threshold = thresholdIndex === -1 ? 90 : Number.parseFloat(process.argv[thresholdIndex + 1]);

const metricNames = ["statements", "branches", "functions", "lines"];

function findCoverageFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".turbo") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findCoverageFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === "coverage-final.json") {
      files.push(fullPath);
    }
  }

  return files;
}

function emptyTotals() {
  return Object.fromEntries(metricNames.map((name) => [name, { covered: 0, total: 0 }]));
}

function percent(metric) {
  return metric.total === 0 ? 100 : (metric.covered / metric.total) * 100;
}

function formatPercent(metric) {
  return `${percent(metric).toFixed(2)}%`;
}

function addMetric(target, metric, covered, total) {
  target[metric].covered += covered;
  target[metric].total += total;
}

function fileLineCoverage(fileCoverage) {
  const lines = new Map();

  for (const [statementId, statement] of Object.entries(fileCoverage.statementMap ?? {})) {
    const line = statement.start?.line;

    if (!line) {
      continue;
    }

    lines.set(line, (lines.get(line) ?? 0) + (fileCoverage.s?.[statementId] ?? 0));
  }

  return {
    covered: [...lines.values()].filter((count) => count > 0).length,
    total: lines.size,
  };
}

function summarizeCoverage(coverage) {
  const totals = emptyTotals();

  for (const fileCoverage of Object.values(coverage)) {
    const statements = Object.values(fileCoverage.s ?? {});
    addMetric(
      totals,
      "statements",
      statements.filter((count) => count > 0).length,
      statements.length,
    );

    const functions = Object.values(fileCoverage.f ?? {});
    addMetric(totals, "functions", functions.filter((count) => count > 0).length, functions.length);

    const branches = Object.values(fileCoverage.b ?? {}).flat();
    addMetric(totals, "branches", branches.filter((count) => count > 0).length, branches.length);

    const lines = fileLineCoverage(fileCoverage);
    addMetric(totals, "lines", lines.covered, lines.total);
  }

  return totals;
}

function mergeTotals(target, source) {
  for (const metric of metricNames) {
    target[metric].covered += source[metric].covered;
    target[metric].total += source[metric].total;
  }
}

function projectName(coverageFile) {
  return path.relative(cwd, path.dirname(path.dirname(coverageFile)));
}

function statusFor(totals) {
  return metricNames.every((metric) => percent(totals[metric]) >= threshold) ? "PASS" : "WARN";
}

function markdownTable(rows, totals) {
  const lines = [
    "<!-- belot-coverage-summary -->",
    "## Coverage",
    "",
    `Generated from Vitest coverage. Threshold: ${threshold.toFixed(0)}%.`,
    "",
    "| Scope | Lines | Statements | Branches | Functions | Status |",
    "| --- | ---: | ---: | ---: | ---: | --- |",
    ...rows.map(({ name, totals: rowTotals }) => {
      return `| ${name} | ${formatPercent(rowTotals.lines)} | ${formatPercent(
        rowTotals.statements,
      )} | ${formatPercent(rowTotals.branches)} | ${formatPercent(
        rowTotals.functions,
      )} | ${statusFor(rowTotals)} |`;
    }),
    `| **Total** | **${formatPercent(totals.lines)}** | **${formatPercent(
      totals.statements,
    )}** | **${formatPercent(totals.branches)}** | **${formatPercent(
      totals.functions,
    )}** | **${statusFor(totals)}** |`,
    "",
  ];

  return `${lines.join("\n")}\n`;
}

const coverageFiles = ["apps", "packages"]
  .flatMap((workspaceDir) => findCoverageFiles(path.join(cwd, workspaceDir)))
  .filter((file) => file.endsWith(path.join("coverage", "coverage-final.json")));

if (coverageFiles.length === 0) {
  console.error("No coverage-final.json files found. Run coverage before generating the summary.");
  process.exit(1);
}

const rows = [];
const totals = emptyTotals();

for (const coverageFile of coverageFiles.sort()) {
  const coverage = JSON.parse(readFileSync(coverageFile, "utf8"));
  const rowTotals = summarizeCoverage(coverage);

  rows.push({
    name: projectName(coverageFile),
    totals: rowTotals,
  });
  mergeTotals(totals, rowTotals);
}

const markdown = markdownTable(rows, totals);
const resolvedOutputPath = path.resolve(cwd, outputPath);
const outputDir = path.dirname(resolvedOutputPath);

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

writeFileSync(resolvedOutputPath, markdown);
console.log(markdown);

if (statusFor(totals) === "WARN") {
  console.error(`Coverage below ${threshold.toFixed(0)}% threshold. Failing CI.`);
  process.exit(1);
}
