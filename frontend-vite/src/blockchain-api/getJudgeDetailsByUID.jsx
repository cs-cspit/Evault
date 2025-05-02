import {ethers} from "ethers";
import config from "../backend-config.json";
import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

const getJudgeDetailsByUID = async (UID, detailsNeeded) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const connectedNetwork = await provider.getNetwork();

    const eVaultContract = new ethers.Contract(
      config[connectedNetwork.chainId].contract.address,
      eVaultMain,
      provider
    );

    const judgeDetails = await eVaultContract.getJudgeDetailsByUID(UID);
    console.log("judgeDetails", judgeDetails);

    if (detailsNeeded == "all") {
      return {
        name: judgeDetails[0],
        dateOfBirth: judgeDetails[1],
     
        nationality: judgeDetails[2],
        sex: judgeDetails[3],
        contactNumber: judgeDetails[4],
        UID: judgeDetails[5].toString(),
    
        // associatedCaseIds: lawyerDetails[8].map((id) => id.toNumber()),
        walletAddress: judgeDetails[7],
      };
    } else if (detailsNeeded == "name_UID") {
      return {name: judgeDetails[0], UID: judgeDetails[5].toString()};
    } else if (detailsNeeded == "name_UID_walletAddress") {
      return {
        name: judgeDetails[0],
        UID: judgeDetails[5].toString(),
        walletAddress: judgeDetails[7],
      };
    } else if (detailsNeeded == "walletAddress") {
      return {
        walletAddress: judgeDetails[7],
      };
    }
  } catch (error) {
    console.error("Error while fetching client details:", error);
    throw error;
  }
};

export default getJudgeDetailsByUID;
