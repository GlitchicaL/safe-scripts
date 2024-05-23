import 'dotenv/config';
import { ethers } from "ethers";

async function main() {
  console.log("Creating Transaction...\n");

  // Setup transaction
  const AMOUNT = ethers.parseUnits('250', 6).toString();
  const MOONWELL_USDC_ABI = [
    "function mint(uint mintAmount) returns (uint)",
  ];

  const MOONWELL_USDC_INTERFACE = new ethers.Interface(JSON.stringify(MOONWELL_USDC_ABI));

  const signature = "mint(uint)";
  const parameters = [AMOUNT];
  const data = MOONWELL_USDC_INTERFACE.encodeFunctionData(signature, parameters);

  console.log(data);
}

main();
