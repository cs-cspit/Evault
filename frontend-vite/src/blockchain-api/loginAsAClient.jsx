// import {ethers} from "ethers";

// import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

// import config from "../backend-config.json";

// // Define the loginAsAClient function
// const loginAsAClient = async (aadharUID) => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);

//   const connectedNetwork = await provider.getNetwork();

//   // Create a contract instance
//   const eVaultContract = new ethers.Contract(
//     config[connectedNetwork.chainId].contract.address,
//     eVaultMain,
//     provider.getSigner()
//   );

//   try {
//     // Ensure that the user has connected their wallet with MetaMask or other provider
//     if (!provider || !provider.getSigner) {
//       throw new Error("Please connect your wallet.");
//     }

//     // Call your contract's loginAsAClient function
//     const isClientRegistered = await eVaultContract.loginAsAClient(aadharUID);

//     // You may want to do additional checks or processing here

//     return isClientRegistered; // Return the result
//   } catch (error) {
//     console.error("Error during client login :(", error);
//     throw error;
//   }
// };

// export default loginAsAClient;
import { ethers } from "ethers";
import { abi as eVaultMain } from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";
import config from "../backend-config.json";

// Define the loginAsAClient function
const loginAsAClient = async (aadharUID) => {
  try {
    // Check if Ethereum provider (MetaMask) is available
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to continue.");
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create a provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the connected network
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Check if the network is supported
    if (!config[chainId]) {
      throw new Error(`Unsupported network. Please switch to a supported network.`);
    }

    // Get the contract address for the current network
    const contractAddress = config[chainId].contract.address;

    // Create a signer
    const signer = provider.getSigner();

    // Create a contract instance
    const eVaultContract = new ethers.Contract(
      contractAddress,
      eVaultMain,
      signer
    );

    // Validate input
    if (!aadharUID || isNaN(aadharUID)) {
      throw new Error("Invalid Aadhar UID");
    }

    // Call the login function
    const isClientRegistered = await eVaultContract.loginAsAClient(
      ethers.BigNumber.from(aadharUID)
    );

    return isClientRegistered;
  } catch (error) {
    console.error("Error during client login:", error);

    // Provide more specific error messages
    if (error.code === 'NETWORK_ERROR') {
      throw new Error("Network error. Please check your connection.");
    }

    if (error.message.includes('user rejected')) {
      throw new Error("Wallet connection was rejected. Please try again.");
    }

    // Rethrow the original error if it's not a specific case we've handled
    throw error;
  }
};

export default loginAsAClient;