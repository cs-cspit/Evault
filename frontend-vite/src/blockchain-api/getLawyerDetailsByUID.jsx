import {ethers} from "ethers";
import config from "../backend-config.json";
import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

const getLawyerDetailsByUID = async (UID, detailsNeeded) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const connectedNetwork = await provider.getNetwork();

    const eVaultContract = new ethers.Contract(
      config[connectedNetwork.chainId].contract.address,
      eVaultMain,
      provider
    );

    const lawyerDetails = await eVaultContract.getLawyerDetailsByUID(UID);
    console.log(lawyerDetails);

    if (detailsNeeded == "all") {
      return {
        name: lawyerDetails[0],
        dateOfBirth: lawyerDetails[1],
       
        nationality: lawyerDetails[2],
        sex: lawyerDetails[3],
        contactNumber: lawyerDetails[4],
        UID: lawyerDetails[5].toString(),
  
        // associatedCaseIds: clientDetails[9].map((id) => id.toNumber()),
        walletAddress: lawyerDetails[7],
      };
    } else if (detailsNeeded == "name") {
      return {name: lawyerDetails[0]};
    } else if (detailsNeeded == "name_UID") {
      return {name: lawyerDetails[0], UID: lawyerDetails[6].toString()};
    } else if (detailsNeeded == "name_UID_walletAddress") {
      return {
        name: lawyerDetails[0],
        UID: lawyerDetails[5].toString(),
        walletAddress: lawyerDetails[7],
      };
    } else if (detailsNeeded == "walletAddress") {
      return {
        walletAddress: lawyerDetails[7],
      };
    }
  } catch (error) {
    console.error("Error while fetching client details:", error);
    throw error;
  }
};

export default getLawyerDetailsByUID;
