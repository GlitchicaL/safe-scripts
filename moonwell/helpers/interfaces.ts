import { ethers } from "ethers";

// USDC
export const USDC_ABI = [
  "function approve(address spender,uint256 value) returns (uint)",
];

export const USDC_INTERFACE = new ethers.Interface(JSON.stringify(USDC_ABI));

// MOONWELL USDC
export const MOONWELL_USDC_ABI = [
  "function mint(uint mintAmount) returns (uint)",
];

export const MOONWELL_USDC_INTERFACE = new ethers.Interface(JSON.stringify(MOONWELL_USDC_ABI));