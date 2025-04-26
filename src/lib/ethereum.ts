import { ethers } from 'ethers';
import ABI from "@/../contracts/certificate.json";

// Initialize provider, wallet, and contract
let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contract: ethers.Contract;
try {
  provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY!, provider);
  contract = new ethers.Contract(
    process.env.CERTIFICATE_CONTRACT_ADDRESS!,
    ABI,
    wallet
  );
} catch (error) {
  console.log(error);
}

export { provider, wallet, contract };