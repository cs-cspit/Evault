import { ethers } from "ethers";
import EVaultMain from "../../../blockchain-hardhat/artifacts/contracts/EVault_Main.sol/EVault_Main.json";
import config from "../backend-config.json";

const getAllClients = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const connectedNetwork = await provider.getNetwork();
    
    const contract = new ethers.Contract(
      config[connectedNetwork.chainId].contract.address,
      EVaultMain.abi,
      provider
    );

    // Get all client UIDs
    const clientUIDs = await contract.getAllClients();
    const clients = [];

    // Fetch details for each client
    for (const uid of clientUIDs) {
      try {
        const details = await contract.getClientDetailsByUID(uid);
        if (details && details.name && details.name !== "") {
          clients.push({
            uid: uid.toString(),
            name: details.name,
            walletAddress: details.walletAddress
          });
        }
      } catch (error) {
        console.error(`Error fetching details for client ${uid}:`, error);
      }
    }

    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export default getAllClients;
