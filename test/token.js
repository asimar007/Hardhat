const { expect } = require("chai");

describe("Token Contract", function () {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    /*
    1. For Every Test case this for line always exicute to reduce the code.
    2. It's use Mocha Framework.
    */
    beforeEach(async function () { // It is a Hook
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })

    describe("Deployment", function () {
        it("Should set the Right Owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })

        it("total Supply Token", async function () {
            const ownerBalance = await hardhatToken.Balanceof(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    })

    describe("Transaction", function () {
        it("Transfer Account between Accounts", async function () {
            await hardhatToken.transferA(addr1.address, 5);
            const addr1Balance = await hardhatToken.Balanceof(addr1.address);
            expect(addr1Balance).to.equal(5);

            await hardhatToken.connect(addr1).transferA(addr2.address, 5);
            const addr2Balance = await hardhatToken.Balanceof(addr2.address);
            expect(addr2Balance).to.equal(5);
        })

        it("Fail if sender have does not have Enough Token", async function () {
            const initBalance = await hardhatToken.Balanceof(owner.address);
            await expect(hardhatToken.connect(addr1).transferA(owner.address, 1)).to.be.revertedWith("Not Enough Token");
            expect(await hardhatToken.Balanceof(owner.address)).to.equal(initBalance);
        })

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