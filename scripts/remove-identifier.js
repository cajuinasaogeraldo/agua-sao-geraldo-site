import fs from "node:fs/promises";
import path from "node:path";

async function walk(dir, list = []) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      await walk(full, list);
    } else if (item.name.endsWith(".Identifier")) {
      list.push(full);
    }
  }
  return list;
}

(async () => {
  try {
    const files = await walk(process.cwd());
    if (!files.length) {
      console.log("✅ Nenhum arquivo .identifier encontrado.");
      return;
    }

    console.log(`🗑️ Encontrados ${files.length} arquivos .identifier, removendo...`);

    for (const file of files) {
      try {
        await fs.rm(file);
        console.log(`✔️  Removido: ${file}`);
      } catch (err) {
        console.error(`❌ Erro ao remover ${file}:`, err.message);
      }
    }

    console.log("🎉 Todos os arquivos foram processados.");
  } catch (err) {
    console.error("❌ Erro ao percorrer diretórios:", err.message);
  }
})();
