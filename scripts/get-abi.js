import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Criar pasta se não existir
if (!existsSync('src/contracts')) {
  mkdirSync('src/contracts', { recursive: true });
}

// Copiar ABIs dos artifacts
const contracts = ['BBBRegular', 'InvestBet'];
const abis = {};

contracts.forEach(contractName => {
  try {
    const artifactPath = join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
    abis[contractName] = artifact.abi;
    console.log(`✅ ABI de ${contractName} copiada`);
  } catch (error) {
    console.log(`⚠️  ${contractName} não compilado ainda`);
  }
});

writeFileSync('src/contracts/abis.json', JSON.stringify(abis, null, 2));
console.log('🎉 Todas as ABIs salvas em src/contracts/abis.json!');