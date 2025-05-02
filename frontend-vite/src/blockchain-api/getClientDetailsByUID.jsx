import {ethers} from "ethers";
import config from "../backend-config.json";
import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

const getClientDetailsByUID = async (UID, detailsNeeded) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const connectedNetwork = await provider.getNetwork();

    const eVaultContract = new ethers.Contract(
      config[connectedNetwork.chainId].contract.address,
      eVaultMain,
      provider
    );

    const clientDetails = await eVaultContract.getClientDetailsByUID(UID);

    if (detailsNeeded == "all") {
      return {
        name: clientDetails[0],
        dateOfBirth: clientDetails[1],
      
        nationality: clientDetails[2],
        sex: clientDetails[3],
        contactNumber: clientDetails[4],
        UID: clientDetails[5].toString(),
       
        // associatedLawyers: clientDetails[7],
        // associatedCaseIds: clientDetails[9].map((id) => id.toNumber()),
        walletAddress: clientDetails[7],
      };
    } else if (detailsNeeded == "walletAddress") {
      return {
        walletAddress: clientDetails[7],
      };
    } else if (detailsNeeded == "name_UID_walletAddress") {
      return {
        name: clientDetails[0],
        UID: clientDetails[5].toString(),
        walletAddress: clientDetails[7],
      };
    }
  } catch (error) {
    console.error("Error while fetching client details:", error);
    throw error;
  }
};

export default getClientDetailsByUID;
