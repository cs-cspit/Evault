const {ethers} = require("hardhat");

const {
  judge1,
  judge2,
  lawyer1,
  lawyer2,
  lawyer3,
  client1,
  client2,
  client3,
  legalCase1,
  legalCase2,
  legalCase3,
} = require("../assets/test-deploy-data.json");

const {registerJudge} = require("./script-functions/function_judge");
const {
  registerLawyer,
  verifyLawyerRegistration,
} = require("./script-functions/function_lawyer");
const {
  registerClient,
  verifyClientRegistration,
} = require("./script-functions/function_client");
const {
  registerLegalCase,
  getLegalCaseDetails,
} = require("./script-functions/function_legalcase");

async function main() {
  console.log("Deploying E-Vault Main Contract...");
  const [deployer] = await ethers.getSigners();

  const EVaultMain = await ethers.getContractFactory("EVault_Main");
  const eVaultMain = await EVaultMain.deploy();
  await eVaultMain.deployed();

  console.log(`Contract deployed to: ${eVaultMain.address}`);

  // Register judges
  console.log("\nRegistering judges...");
  await registerJudge(deployer, eVaultMain, judge1);
  await registerJudge(deployer, eVaultMain, judge2);

  // Register lawyers
  console.log("\nRegistering lawyers...");
  await registerLawyer(deployer, eVaultMain, lawyer1);
  await registerLawyer(deployer, eVaultMain, lawyer2);
  await registerLawyer(deployer, eVaultMain, lawyer3);

  // Verify lawyer registration
  console.log("\nVerifying lawyer registration...");
  await verifyLawyerRegistration(eVaultMain, lawyer1);
  await verifyLawyerRegistration(eVaultMain, lawyer2);
  await verifyLawyerRegistration(eVaultMain, lawyer3);

  // Register clients
  console.log("\nRegistering clients...");
  await registerClient(deployer, eVaultMain, client1);
  await registerClient(deployer, eVaultMain, client2);
  await registerClient(deployer, eVaultMain, client3);

  // Verify client registration
  console.log("\nVerifying client registration...");
  await verifyClientRegistration(eVaultMain, client1);
  await verifyClientRegistration(eVaultMain, client2);
  await verifyClientRegistration(eVaultMain, client3);

  // Register legal cases
  console.log("\nRegistering legal cases...");
  await registerLegalCase(deployer, eVaultMain, legalCase1);
  await registerLegalCase(deployer, eVaultMain, legalCase2);
  await registerLegalCase(deployer, eVaultMain, legalCase3);

  // Verify case registration
  console.log("\nVerifying case registration...");
  await getLegalCaseDetails(eVaultMain, 1); // Case IDs start from 0
  await getLegalCaseDetails(eVaultMain, 2);
  await getLegalCaseDetails(eVaultMain, 3);

  console.log("\nDeployment and setup completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });