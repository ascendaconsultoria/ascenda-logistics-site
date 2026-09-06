import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");

if (path.dirname(output) !== root || path.basename(output) !== "dist") {
  throw new Error("Diretório de saída inválido.");
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

const publicEntries = [
  ".well-known",
  "404.html",
  "assets",
  "captacao-de-embarcadores",
  "index.html",
  "llms.txt",
  "manifest.webmanifest",
  "marketing-para-transportadoras",
  "perfil-logistico",
  "politica-de-privacidade",
  "robots.txt",
  "sitemap.xml",
  "sobre",
  "termos",
];

const excludedAssets = new Set([
  "assets/img/clientes/cliente-b.png",
  "assets/img/difference-logistics-diorama.png",
  "assets/img/hero-truck.mp4",
  "assets/img/redes-captacao-v0.png",
]);

for (const entry of publicEntries) {
  const source = path.join(root, entry);
  const destination = path.join(output, entry);
  await fs.cp(source, destination, {
    recursive: true,
    filter: (candidate) => {
      const relative = path.relative(root, candidate).replaceAll("\\", "/");
      return !excludedAssets.has(relative);
    },
  });
}

console.log(`Build estático concluído em ${path.relative(root, output)}.`);
