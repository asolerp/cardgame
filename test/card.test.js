const Card = artifacts.require("Card");

const chai = require("./setupchai")
const expect = chai.expect;

contract("Card", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;
    
    let contract

    beforeEach(async() => {
        contract = await Card.deployed();
    })

    it("deploys successfully", async () => {
        const address = contract.address;
        expect(address).to.be.not.equal('')
        expect(address).to.be.not.equal(0x0)
        expect(address).to.be.not.equal(null)
        return expect(address).to.be.not.equal(undefined)
    });

    it("has a name", async () => {
        const name =  contract.name()
        expect(name).to.be.eventually.equal('CardGame')
    })

    it("has a symbol", async () => {
        const name =  contract.symbol()
        expect(name).to.be.eventually.equal('CARDGAME')
    })

    it("mint and add metadata new card", async () => {
        const newMintedCart = await contract.awardItem(recipient, 'Qmd5EKJ3aGYQ5w1jZqfr5Kjpvjtc1bmTEcZQps3QcJVWPo', 'ipfs://Qmd5EKJ3aGYQ5w1jZqfr5Kjpvjtc1bmTEcZQps3QcJVWPo')
        console.log(newMintedCart.receipt.logs)
    })

  });
  