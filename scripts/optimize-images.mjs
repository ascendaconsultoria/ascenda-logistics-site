import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const root = process.cwd();
const files = [
  "assets/img/difference-logistics-diorama-v2.png",
  "assets/img/redes-captacao-painel.png",
  "assets/img/shipper-industries.png",
  "assets/img/shipper-distributors.png",
  "assets/img/shipper-ecommerce.png",
  "assets/img/shipper-international.png",
  "assets/img/difference-icons/operacao.png",
  "assets/img/difference-icons/perfil.png",
  "assets/img/difference-icons/filtro.png",
  "assets/img/difference-icons/match.png",
  "assets/img/difference-icons/oportunidade.png",
  "assets/img/clientes/tpl-logistica-case.png",
  "assets/img/clientes/solucao-case.png",
  "assets/img/clientes/dgi-cargo.png",
  "assets/img/clientes/logiflex.png",
  "assets/img/clientes/nextlog.png",
  "assets/img/clientes/brasil-pressa.png",
  "assets/img/clientes/transnasci.png",
  "assets/img/clientes/tpl-logistica.png",
  "assets/img/clientes/solucao.png",
  "assets/img/operations/carga-fechada.png",
  "assets/img/operations/fracionado-recorrente.png",
  "assets/img/operations/ocupacao-rotas.png",
  "assets/img/operations/operacoes-mercosul.png",
  "assets/img/operations/distribuicao-last-mile.png",
  "assets/img/operations/armazenagem-distribuicao.png",
  "assets/img/operations/refrigerado-congelado.png",
  "assets/img/operations/quimicos-perigosos.png",
  "assets/img/operations/farmaceutico-saude.png",
  "assets/img/operations/conteineres-portuario.png",
  "assets/img/operations/cargas-especiais-projeto.png",
  "assets/img/operations/cargas-alto-valor.png"
];

const browser = await chromium.launch();
const page = await browser.newPage();
let originalBytes = 0;
let optimizedBytes = 0;

try {
  for (const relativeFile of files) {
    const sourcePath = path.join(root, relativeFile);
    const outputPath = sourcePath.replace(/\.png$/i, ".webp");
    const source = await fs.readFile(sourcePath);
    const quality = relativeFile.includes("operations/") ? 0.84 : 0.9;
    const base64 = await page.evaluate(
      async ({ data, quality: imageQuality }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas.toDataURL("image/webp", imageQuality).split(",")[1];
      },
      { data: source.toString("base64"), quality },
    );
    const optimized = Buffer.from(base64, "base64");
    await fs.writeFile(outputPath, optimized);
    originalBytes += source.byteLength;
    optimizedBytes += optimized.byteLength;
    console.log(
      `${relativeFile} -> ${path.relative(root, outputPath)} (${Math.round((1 - optimized.byteLength / source.byteLength) * 100)}% menor)`,
    );
  }

  const videoPath = path.join(root, "assets/img/hero-truck-optimized.mp4");
  const posterPath = path.join(root, "assets/img/hero-truck-poster.webp");
  const video = await fs.readFile(videoPath);
  const posterBase64 = await page.evaluate(async (data) => {
    const element = document.createElement("video");
    element.muted = true;
    element.preload = "auto";
    element.src = `data:video/mp4;base64,${data}`;
    await new Promise((resolve, reject) => {
      element.addEventListener("loadedmetadata", resolve, { once: true });
      element.addEventListener("error", reject, { once: true });
    });
    element.currentTime = Math.min(1, element.duration / 2);
    await new Promise((resolve, reject) => {
      element.addEventListener("seeked", resolve, { once: true });
      element.addEventListener("error", reject, { once: true });
    });
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth;
    canvas.height = element.videoHeight;
    canvas.getContext("2d").drawImage(element, 0, 0);
    return canvas.toDataURL("image/webp", 0.88).split(",")[1];
  }, video.toString("base64"));
  const poster = Buffer.from(posterBase64, "base64");
  await fs.writeFile(posterPath, poster);
  console.log(
    `assets/img/hero-truck-optimized.mp4 -> assets/img/hero-truck-poster.webp (${(poster.byteLength / 1024).toFixed(0)} KB)`,
  );
} finally {
  await browser.close();
}

console.log(
  `Total: ${(originalBytes / 1024 / 1024).toFixed(2)} MB -> ${(optimizedBytes / 1024 / 1024).toFixed(2)} MB`,
);
