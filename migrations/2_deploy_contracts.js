var Card = artifacts.require("./Card.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Card);
};
