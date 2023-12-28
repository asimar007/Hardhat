const { expect } = require("chai");

describe("Token Contract", function () {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    /*
    For every test case, the code inside this `beforeEach` block will be executed.
    It initializes the Token contract, gets signers (addresses), and deploys the Token contract.
    */
    beforeEach(async function () { // It is a Hook
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })

    describe("Deployment", function () {
        /*
        Test case: It checks if the owner is set correctly during contract deployment.
        */
        it("Should set the Right Owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        /*
        Test case: It checks if the total supply of tokens matches the balance of the owner after deployment.
        */
        it("total Supply Token", async function () {
            const ownerBalance = await hardhatToken.Balanceof(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    })

    describe("Transaction", function () {
        /*
        Test case: It checks if tokens can be transferred between accounts.
        */
        it("Transfer Account between Accounts", async function () {
            await hardhatToken.transferA(addr1.address, 5);
            const addr1Balance = await hardhatToken.Balanceof(addr1.address);
            expect(addr1Balance).to.equal(5);

            await hardhatToken.connect(addr1).transferA(addr2.address, 5);
            const addr2Balance = await hardhatToken.Balanceof(addr2.address);
            expect(addr2Balance).to.equal(5);
        })

        /*
        Test case: It checks if an attempt to transfer tokens without sufficient balance fails.
        */
        it("Fail if sender does not have Enough Token", async function () {
            const initBalance = await hardhatToken.Balanceof(owner.address);
            await expect(hardhatToken.connect(addr1).transferA(owner.address, 1)).to.be.revertedWith("Not Enough Token");
            expect(await hardhatToken.Balanceof(owner.address)).to.equal(initBalance);
        })

        /*
        Test case: It checks if the token balances are updated correctly after multiple transactions.
        */
        it("Updated Balance After Transaction", async function () {
            const initBalance = await hardhatToken.Balanceof(owner.address);
            await hardhatToken.transferA(addr1.address, 5);
            await hardhatToken.transferA(addr2.address, 10);

            const finalBalance = await hardhatToken.Balanceof(owner.address);
            expect(finalBalance).to.equal(initBalance - 15);

            const addr1Balance = await hardhatToken.Balanceof(addr1.address);
            expect(addr1Balance).to.equal(5);
            const addr2Balance = await hardhatToken.Balanceof(addr2.address);
            expect(addr2Balance).to.equal(10);
        })
    })
})
