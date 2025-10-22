// export-src-to-md.js
// Convierte el contenido de ./src (Angular) a Markdown para NotebookLM.
// Modo 1: un solo archivo .md con todo (--single)
// Modo 2: un .md por subcarpeta de src (--per-folder) [recomendado]
// Opciones:
//   --src=./src                  Carpeta fuente (por defecto ./src)
//   --out=./notebooklm-export    Carpeta de salida (por defecto ./notebooklm-export)
//   --excludeTests               Excluye *.spec.ts
//   --maxChars=900000            Trocea archivos .md si exceden este tamaño aprox.
//   --single                     Genera un único archivo all-in-one.md
//   --per-folder                 Genera un .md por subcarpeta inmediata de src

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const arg = (name, def) => {
  const a = args.find(x => x.startsWith(`--${name}=`));
  if (a) return a.split("=")[1];
  return args.includes(`--${name}`) ? true : def;
};

const SRC_DIR = path.resolve(arg("src", "./src"));
const OUT_DIR = path.resolve(arg("out", "./notebooklm-export"));
const EXCLUDE_TESTS = !!arg("excludeTests", false);
const MAX_CHARS = parseInt(arg("maxChars", "900000"), 10); // ~1MB aprox
const MODE_SINGLE = !!arg("single", false);
const MODE_PER_FOLDER = !!arg("per-folder", false) || !MODE_SINGLE;

const EXT_MAP = {
  ".ts": "ts",
  ".tsx": "tsx",
  ".js": "js",
  ".jsx": "jsx",
  ".html": "html",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".json": "json",
  ".md": "md",
  ".yml": "yaml",
  ".yaml": "yaml"
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      // ignora carpetas no útiles
      if (["node_modules", "dist", ".angular", ".git"].includes(entry)) continue;
      walk(full, list);
    } else {
      const ext = path.extname(entry);
      if (!EXT_MAP[ext]) continue; // solo texto/código
      if (EXCLUDE_TESTS && entry.endsWith(".spec.ts")) continue;
      list.push(full);
    }
  }
  return list;
}

function relFromSrc(p) {
  return path.relative(SRC_DIR, p).split(path.sep).join("/");
}

function fence(ext) {
  return EXT_MAP[ext] || "";
}

function chunkWrite(basePath, header, content, maxChars) {
  // Escribe content en uno o varios archivos si supera el límite
  if (content.length <= maxChars) {
    fs.writeFileSync(basePath, header + content, "utf8");
    return [basePath];
  }
  const files = [];
  let i = 1;
  for (let start = 0; start < content.length; start += maxChars) {
    const end = Math.min(start + maxChars, content.length);
    const part = content.slice(start, end);
    const partPath = basePath.replace(/\.md$/, `.${String(i).padStart(2, "0")}.md`);
    fs.writeFileSync(partPath, header + part, "utf8");
    files.push(partPath);
    i++;
  }
  return files;
}

function toSlug(s) {
  return s.toLowerCase()
    .replace(/[^\w\-\/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

function exportSingle(files) {
  const outFile = path.join(OUT_DIR, "all-in-one.md");
  let header = `# Angular src export\n\n> Generado desde: \`${SRC_DIR}\`\n\n`;
  let body = "";

  for (const file of files) {
    const rel = relFromSrc(file);
    const ext = path.extname(file);
    const lang = fence(ext);
    const code = fs.readFileSync(file, "utf8");
    body += `\n## File: \`${rel}\`\n\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
  }

  ensureDir(OUT_DIR);
  const written = chunkWrite(outFile, header, body, MAX_CHARS);
  console.log(`✅ Generado: ${written.join(", ")}`);
}

function groupByTopFolder(files) {
  const groups = {};
  for (const file of files) {
    const rel = relFromSrc(file);
    const seg = rel.split("/")[0] || "root";
    groups[seg] = groups[seg] || [];
    groups[seg].push(file);
  }
  return groups;
}

function exportPerFolder(files) {
  const groups = groupByTopFolder(files);
  ensureDir(OUT_DIR);
  const written = [];

  for (const [folder, list] of Object.entries(groups)) {
    const slug = toSlug(folder) || "root";
    const outFile = path.join(OUT_DIR, `${slug}.md`);
    let header = `# ${folder}\n\n> Generado desde: \`${SRC_DIR}/${folder}\`\n\n`;
    let body = "";

    // Ordena para lectura estable
    list.sort((a, b) => relFromSrc(a).localeCompare(relFromSrc(b)));

    for (const file of list) {
      const rel = relFromSrc(file);
      const ext = path.extname(file);
      const lang = fence(ext);
      const code = fs.readFileSync(file, "utf8");
      body += `\n## File: \`${rel}\`\n\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }

    const filesWritten = chunkWrite(outFile, header, body, MAX_CHARS);
    written.push(...filesWritten);
  }
  console.log(`✅ Generados (${written.length}):\n - ${written.join("\n - ")}`);
}

function main() {
  if (!fs.existsSync(SRC_DIR) || !fs.statSync(SRC_DIR).isDirectory()) {
    console.error(`❌ No se encontró la carpeta src en: ${SRC_DIR}`);
    process.exit(1);
  }

  const files = walk(SRC_DIR);
  if (files.length === 0) {
    console.warn("⚠️ No se encontraron archivos de texto/código soportados.");
    return;
  }

  ensureDir(OUT_DIR);
  if (MODE_SINGLE) {
    exportSingle(files);
  } else {
    exportPerFolder(files);
  }
}

main();
