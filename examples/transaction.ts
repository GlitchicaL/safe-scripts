import 'dotenv/config';
import { ethers } from "ethers";
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

async function main() {
  console.log("Initializing SAFE...\n");

  // Setup SAFE API
  const apiKit = new SafeApiKit({
    chainId: 84532n
  });

  const RPC_URL = "https://sepolia.base.org";
  const SIGNER_ADDRESS = "0x830690922a56f31Cb96851951587D8A2f45C0EBA";
  const SAFE_ADDRESS = "0x0EE96B1B5d3d164D242170D0077e45CD828Db945";

  // Reference to SAFE
  const protocolKit = await Safe.init({
    provider: RPC_URL,
    signer: process.env.PRIVATE_KEY,
    safeAddress: SAFE_ADDRESS
  });

  console.log("Creating Transaction...");

  // Setup transaction
  const DESTINATION = '0x830690922a56f31Cb96851951587D8A2f45C0EBA';
  const AMOUNT = ethers.parseUnits('0.01', 'ether').toString();
  const DATA = "0x";

  const safeTransactionData: MetaTransactionData = {
    to: DESTINATION,
    data: DATA,
    value: AMOUNT
  };

  // Create a Safe transaction with the provided parameters
  const safeTransaction = await protocolKit.createTransaction({ transactions: [safeTransactionData] });

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
