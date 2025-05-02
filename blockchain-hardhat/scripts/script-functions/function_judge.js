async function registerJudge(deployer, contract, judgeData) {
  const {
    name,
    dateOfBirth,
    nationality,
    sex,
    contactNumber,
    UID,
    walletAddress,
  } = judgeData;

  const registerJudgeTX = await contract
    .connect(deployer)
    .registerJudge(
      name,
      dateOfBirth,
      nationality,
      sex,
      contactNumber,
      UID,
      walletAddress
    );

  await registerJudgeTX.wait();

  console.log(`Judge [ ${name} | ${UID} ] added to blockchain. \u2705`);
}

module.exports = {
  registerJudge,
};