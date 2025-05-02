import {ethers} from "ethers";
import {abi as eVaultMain} from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";

import config from "../backend-config.json";

const registerNewCase = async ({
  UIDOfParty1,
  UIDOfParty2,
  caseSubject,
  associatedLawyers,
}) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const connectedNetwork = await provider.getNetwork();
  
  console.log("Connected to network:", connectedNetwork);
  console.log("Using contract address:", config[connectedNetwork.chainId].contract.address);

  const eVaultContract = new ethers.Contract(
    config[connectedNetwork.chainId].contract.address,
    eVaultMain,
    provider.getSigner()
  );

  try {
    // Ensure UIDs are valid numbers and convert to strings first
    const party1UID = ethers.BigNumber.from(UIDOfParty1.toString());
    const party2UID = ethers.BigNumber.from(UIDOfParty2.toString());

    // Ensure we have a case subject
    if (!caseSubject || caseSubject.trim() === "") {
      throw new Error("Case subject cannot be empty");
    }

    // Ensure associatedLawyers is an array and convert to BigNumber
    const parsedLawyers = Array.isArray(associatedLawyers) 
      ? associatedLawyers.map(lawyer => ethers.BigNumber.from(lawyer.toString()))
      : [];

    console.log("Checking client existence for UIDs:", { 
      party1UID: party1UID.toString(), 
      party2UID: party2UID.toString() 
    });

    // First check if both clients exist
    try {
      const client1 = await eVaultContract.getClientDetailsByUID(party1UID);
      const client2 = await eVaultContract.getClientDetailsByUID(party2UID);
      
      console.log("Found clients:", {
        client1: { name: client1.name, uid: client1.UID.toString() },
        client2: { name: client2.name, uid: client2.UID.toString() }
      });

      // Also check if the lawyers exist
      for (const lawyer of parsedLawyers) {
        const lawyerDetails = await eVaultContract.getLawyerDetailsByUID(lawyer);
        console.log("Found lawyer:", {
          name: lawyerDetails.name,
          uid: lawyerDetails.UID.toString()
        });
      }
    } catch (error) {
      console.error("Error checking participants:", error);
      if (error.reason) {
        throw new Error(`Contract error: ${error.reason}`);
      } else if (error.message) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error("One or more participants do not exist in the system");
      }
    }

    console.log("Registering case with params:", {
      party1UID: party1UID.toString(),
      party2UID: party2UID.toString(),
      caseSubject,
      parsedLawyers: parsedLawyers.map(l => l.toString())
    });

    const tx = await eVaultContract.registerLegalCase(
      party1UID,
      party2UID,
      caseSubject,
      parsedLawyers,
      { gasLimit: 500000 } // Add explicit gas limit
    );

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    const caseRegisteredEvent = receipt.events.find(
      (event) => event.event === "CaseRegistered"
    );

    if (caseRegisteredEvent) {
      const caseId = caseRegisteredEvent.args.caseId.toNumber();
      return `Case registered with ID: ${caseId} `;
    } else {
      throw new Error(
        "Case registration event not found in the transaction receipt"
      );
    }
  } catch (error) {
    console.error("Error registering the legal case: ", {
      message: error.message,
      reason: error.reason,
      code: error.code,
      data: error.data,
      transaction: error.transaction
    });
    throw error;
  }
};

export default registerNewCase;
