import 'dotenv/config';
import { ethers } from "ethers";
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

// Import constants
import { USDC, MOONWELL_USDC } from "../helpers/addresses";
import { USDC_INTERFACE, MOONWELL_USDC_INTERFACE } from "../helpers/interfaces";
import { USDC_APPROVE, MOONWELL_USDC_MINT } from "../helpers/signatures";

async function main() {
  console.log("Initializing SAFE...\n");

  // Setup SAFE API
  const apiKit = new SafeApiKit({
    chainId: 8453n
  });

  const RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${process.env.BASE_ALCHEMY_API_KEY}`;
  const SIGNER_ADDRESS = process.env.BASE_SIGNER_ADDRESS || "";
  const SAFE_ADDRESS = process.env.BASE_SAFE_ADDRESS || "";

  // Reference to SAFE
  const protocolKit = await Safe.init({
    provider: RPC_URL,
    signer: process.env.BASE_SIGNER_KEY,
    safeAddress: SAFE_ADDRESS
  });

  console.log("Creating Transaction...");

  // Setup transactions
  const AMOUNT = ethers.parseUnits('1', 6).toString();

  const approveParameters = [MOONWELL_USDC, AMOUNT];
  const approveData = USDC_INTERFACE.encodeFunctionData(USDC_APPROVE, approveParameters);

  const mintParameters = [AMOUNT];
  const mintData = MOONWELL_USDC_INTERFACE.encodeFunctionData(MOONWELL_USDC_MINT, mintParameters);

  // Approve
  const safeApproveTransactionData: MetaTransactionData = {
    to: USDC,
    data: approveData,
    value: "0"
  };

  // Mint
  const safeMintTransactionData: MetaTransactionData = {
    to: MOONWELL_USDC,
    data: mintData,
    value: "0"
  };

  // Create a Safe transaction with the provided parameters
  const safeTransaction = await protocolKit.createTransaction({ transactions: [safeApproveTransactionData, safeMintTransactionData] });

  // Deterministic hash based on transaction parameters
  const safeTxHash = await protocolKit.getTransactionHash(safeTransaction);

  // Sign transaction to verify that the transaction is coming from owner 1
  const senderSignature = await protocolKit.signHash(safeTxHash);

  console.log("Proposing Transaction...");

  await apiKit.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: SIGNER_ADDRESS,
    senderSignature: senderSignature.data,
  });
}

main();
