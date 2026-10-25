/**
 * End-to-end test in a real Zotero, fully isolated from the user's setup:
 * a temp profile and temp data directory, the built XPI, a test harness
 * plugin, and a local mock OpenAI-compatible SSE server.
 *
 * Usage: npm run test:e2e   (env ZOTERO_BIN overrides the Zotero binary)
 */
import { spawn, execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const ZOTERO_BIN = process.env.ZOTERO_BIN || process.env.ZOTERO_PLUGIN_ZOTERO_BIN_PATH || "D:/programs/zotero.exe";
const XPI = path.join(root, ".scaffold/build/zotero-ai-reader.xpi");
const TIMEOUT_MS = 180_000;

if (!existsSync(ZOTERO_BIN)) throw new Error(`Zotero not found at ${ZOTERO_BIN}; set ZOTERO_BIN`);
if (!existsSync(XPI)) throw new Error(`Build first: ${XPI} missing`);

const tmp = mkdtempSync(path.join(os.tmpdir(), "zair-e2e-"));
const profile = path.join(tmp, "profile");
const dataDir = path.join(tmp, "data");
const outFile = path.join(tmp, "results.json");
const logFile = path.join(tmp, "zotero.log");
const pdfFile = path.join(tmp, "test.pdf");
mkdirSync(path.join(profile, "extensions"), { recursive: true });
mkdirSync(dataDir);

// ---- mock OpenAI-compatible server ----
const requests = [];
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", async () => {
    requests.push({ method: req.method, url: req.url, auth: req.headers.authorization, body });
    if (process.env.E2E_VERBOSE) console.log(`mock: ${req.method} ${req.url} auth=${req.headers.authorization}`);
    if (req.method !== "POST" || req.url !== "/v1/chat/completions") {
      res.writeHead(404).end("not found");
      return;
    }
    if (req.headers.authorization !== "Bearer test-key") {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: "Invalid API key (mock)" } }));
      return;
    }
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
    for (const piece of ["你好", "，", "世界"]) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`);
      await new Promise((r) => setTimeout(r, 400));
    }
    res.end("data: [DONE]\n\n");
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const mockURL = `http://127.0.0.1:${server.address().port}`;

// ---- one-page PDF with real text ----
function makePDF(text) {
  const stream = `BT /F1 18 Tf 72 720 Td (${text}) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objs.map((o, i) => {
    const at = pdf.length;
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
    return at;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}
writeFileSync(pdfFile, makePDF("Hello world. This is the end-to-end test document."), "latin1");

// ---- update XPI: same plugin, different archive, like a real upgrade ----
const updateXPI = path.join(tmp, "update.xpi");
{
  // Append a stored (uncompressed) entry so the zip's layout and size change
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(readFileSync(process.env.E2E_UPDATE_XPI || XPI));
  zip.file("content/e2e-update-marker.txt", "x".repeat(50_000) + Date.now());
  writeFileSync(updateXPI, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

// ---- profile ----
const userPrefs = {
  "extensions.zotero.dataDir": dataDir,
  "extensions.zotero.useDataDir": true,
  "extensions.autoDisableScopes": 0,
  "extensions.enabledScopes": 15,
  "xpinstall.signatures.required": false,
  "extensions.update.enabled": false,
  "app.update.enabled": false,
  "extensions.zotero.sync.autoSync": false,
  "extensions.zotero.automaticScraperUpdates": false,
  "extensions.zotero.firstRun2": false,
  "intl.locale.requested": "zh-CN",
  "zair.e2e.out": outFile,
  "zair.e2e.pdf": pdfFile,
  "zair.e2e.mock": mockURL,
  "zair.e2e.xpi": updateXPI,
};
writeFileSync(
  path.join(profile, "user.js"),
  Object.entries(userPrefs)
    .map(([k, v]) => `user_pref(${JSON.stringify(k)}, ${JSON.stringify(v)});`)
    .join("\n") + "\n",
);
copyFileSync(process.env.E2E_INSTALL_XPI || XPI, path.join(profile, "extensions", "zotero-ai-reader@claude.ai.xpi"));
// A proxy file (contents = directory path) loads the harness unpacked
writeFileSync(path.join(profile, "extensions", "zair-e2e@test.local"), path.join(here, "harness"));

// ---- run Zotero ----
console.log(`Temp dir: ${tmp}\nMock API: ${mockURL}\nStarting Zotero...`);
const log = openSync(logFile, "w");
const zotero = spawn(ZOTERO_BIN, ["-profile", profile, "-no-remote", "-ZoteroDebugText", "-purgecaches"], {
  stdio: ["ignore", log, log],
});

// zotero.exe may hand off to a relaunched process and exit right away, so
// its exit code says nothing; wait for the harness's results file instead.
const started = Date.now();
while (!existsSync(outFile) && Date.now() - started < TIMEOUT_MS) {
  await new Promise((r) => setTimeout(r, 500));
}
await new Promise((r) => setTimeout(r, 3000));
killTestZotero();
server.close();

/** Kill only Zotero processes started with our temp profile, never the user's. */
function killTestZotero() {
  if (process.platform !== "win32") {
    zotero.kill();
    return;
  }
  const marker = path.basename(tmp).replace(/'/g, "");
  try {
    execFileSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Get-CimInstance Win32_Process -Filter "Name='zotero.exe'" | ` +
          `Where-Object { $_.CommandLine -like '*${marker}*' } | ` +
          `ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`,
      ],
      { stdio: "ignore" },
    );
  } catch {
    // Already gone
  }
}

// ---- report ----
const report = existsSync(outFile)
  ? JSON.parse(readFileSync(outFile, "utf-8"))
  : { results: [{ name: "harness wrote results", ok: false, detail: "no results file (timeout or crash)" }], consoleErrors: [] };

const chat = requests.filter((r) => r.url === "/v1/chat/completions");
const first = chat[0] ? JSON.parse(chat[0].body) : null;
report.results.push(
  { name: "mock got requests at /v1/chat/completions", ok: chat.length >= 2, detail: `${chat.length} requests` },
  { name: "request asks for streaming", ok: first?.stream === true, detail: JSON.stringify(first?.stream) },
  { name: "request sends model and auth", ok: first?.model === "mock-model" && chat[0].auth === "Bearer test-key", detail: first?.model },
  {
    name: "system prompt carries paper title",
    ok: first?.messages?.[0]?.role === "system" && first.messages[0].content.includes("E2E Paper"),
    detail: first?.messages?.[0]?.content?.slice(0, 120),
  },
);

let failed = 0;
for (const r of report.results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `\n      ${String(r.detail ?? "").replace(/\n/g, "\n      ")}`}`);
}
if (report.consoleErrors.length) {
  console.log(`\nConsole messages mentioning the plugin (${report.consoleErrors.length}):`);
  for (const e of report.consoleErrors) console.log("  - " + e.replace(/\n/g, " ").slice(0, 400));
}
console.log(`\n${report.results.length - failed}/${report.results.length} passed`);

if (failed || process.env.KEEP_E2E) {
  console.log(`Kept for inspection: ${tmp} (Zotero log: ${logFile})`);
} else {
  rmSync(tmp, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
