// import {ethers} from "ethers";

// import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

// import config from "../backend-config.json";

// // Define the loginAsAClient function
// const registerToEVault = async ({
//   fullName,
//   religion,
//   nationality,
//   sex,
//   dob,
//   contactNumber,
//   aadharUID,
//   pan,
//   walletAddress,
//   signingUpAs,
// }) => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const connectedNetwork = await provider.getNetwork();
//   // Create a contract instance
//   const eVaultContract = new ethers.Contract(
//     config[connectedNetwork.chainId].contract.address,
//     eVaultMain,
//     provider.getSigner()
//   );

//   let registrationTransaction;

//   try {
//     if (signingUpAs == "client") {
//       // contractInteraction
//       registrationTransaction = await eVaultContract.registerClient(
//         fullName,
//         dob,
//         religion,
//         nationality,
//         sex,
//         contactNumber,
//         parseInt(aadharUID, 10),
//         pan,
//         walletAddress
//       );
//     } else if (signingUpAs == "judge") {
//       // contractInteraction
//       registrationTransaction = await eVaultContract.registerJudge(
//         fullName,
//         dob,
//         religion,
//         nationality,
//         sex,
//         contactNumber,
//         parseInt(aadharUID, 10),
//         pan,
//         walletAddress
//       );
//     } else if (signingUpAs == "lawyer") {
//       // contractInteraction
//       registrationTransaction = await eVaultContract.registerLawyer(
//         fullName,
//         dob,
//         religion,
//         nationality,
//         sex,
//         contactNumber,
//         parseInt(aadharUID, 10),
//         pan,
//         walletAddress
//       );
//     }

//     await registrationTransaction.wait();

//     // console.log("Transaction hash:", registrationTransaction.hash);
//     // return `Successfully registred as a ${signingUpAs}`;
//     return "Registration successfull ✅";
//   } catch (error) {
//     console.error(`Can't register as a ${signingUpAs} : `, error);
//     throw error;
//   }
// };

// export default registerToEVault;
import { ethers } from "ethers";
import { abi as eVaultMain } from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";
import config from "../backend-config.json";

const registerToEVault = async ({
  fullName,
 
  nationality,
  sex,
  dob,
  contactNumber,
  aadharUID,
  
  walletAddress,
  signingUpAs,
}) => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545",31337)
 
    const signer = provider.getSigner();
    const connectedNetwork = await provider.getNetwork();

    console.log("Connected Network Chain ID:", connectedNetwork.chainId);

    // Verify the network configuration
    const networkConfig = config[connectedNetwork.chainId];
    if (!networkConfig || !networkConfig.contract || !networkConfig.contract.address) {
      throw new Error(
        `No valid contract address found for Chain ID ${connectedNetwork.chainId}. Please check your config file.`
      );
    }

    const contractAddress = networkConfig.contract.address;

    // Create a contract instance
    const eVaultContract = new ethers.Contract(contractAddress, eVaultMain, signer);

    let registrationTransaction;

    // Interact with the contract based on the user's role
    if (signingUpAs === "client") {
      registrationTransaction = await eVaultContract.registerClient(
        fullName,
        dob,
      
        nationality,
        sex,
        contactNumber,
        parseInt(aadharUID, 10),
  
        walletAddress
      );
    } else if (signingUpAs === "judge") {
      registrationTransaction = await eVaultContract.registerJudge(
        fullName,
        dob,
      
        nationality,
        sex,
        contactNumber,
        parseInt(aadharUID, 10),
     
        walletAddress
      );
    } else if (signingUpAs === "lawyer") {
      registrationTransaction = await eVaultContract.registerLawyer(
        fullName,
        dob,
   
        nationality,
        sex,
        contactNumber,
        parseInt(aadharUID, 10),
        
        walletAddress
      );
    } else {
      throw new Error("Invalid signing up role.");
    }

    // Wait for the transaction to be mined
    const receipt = await registrationTransaction.wait();

    console.log("Transaction successful:", receipt);
    return "Registration successful ✅";
  } catch (error) {
    console.error("Error during registration:", error.message || error);
    throw error;
  }
};

export default registerToEVault;
