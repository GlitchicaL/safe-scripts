import 'dotenv/config';
import Safe from '@safe-global/protocol-kit';

async function main() {
    console.log("Initializing Ethers...\n");

    const RPC_URL = "https://sepolia.base.org";
    const SAFE_ADDRESS = "0x0EE96B1B5d3d164D242170D0077e45CD828Db945";

    // Reference to SAFE
    const protocolKit = await Safe.init({
        provider: RPC_URL,
        signer: process.env.PRIVATE_KEY,
        safeAddress: SAFE_ADDRESS
    });

    const balance = await protocolKit.getBalance();

    console.log(`Balance of ${SAFE_ADDRESS}: ${balance}`);
}

main();