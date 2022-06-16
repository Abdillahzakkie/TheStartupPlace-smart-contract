const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv/config");

const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const toWei = (_amount) => ethers.utils.parseEther(_amount.toString());
const fromWei = (_amount) =>
	parseFloat(ethers.utils.formatEther(_amount.toString()));

describe("TheStartUpPlace", function () {
	let deployer, user1, user2;
	beforeEach(async () => {
		[deployer, user1, user2] = await ethers.getSigners();
		const TheStartUpPlace = await ethers.getContractFactory("TheStartUpPlace");
		this.contract = await TheStartUpPlace.connect(deployer).deploy();
	});

	describe("deployment", () => {
		it("should deploy contract properly", async () => {
			expect(this.contract.address).not.null;
			expect(this.contract.address).not.undefined;
		});

		it("should set name properly", async () => {
			expect(await this.contract.name()).to.equal("The StartUp Place");
		});

		it("should set symbol properly", async () => {
			expect(await this.contract.symbol()).to.equal("TSUP");
		});

		it("should set decimals properly", async () => {
			expect(parseInt(await this.contract.decimals())).to.equal(18);
		});

		it("should validate initial owner balance to be 1M TSUP", async () => {
			expect(fromWei(await this.contract.balanceOf(deployer.address))).to.equal(
				1_000_000
			);
		});
	});

	describe("approve", () => {
		it("should approve user1 to spend 10K TSUP", async () => {
			const _amount = toWei(10_000);
			await this.contract.approve(user1.address, _amount);
			expect(
				await this.contract.allowance(deployer.address, user1.address)
			).to.equal(_amount);
		});

		it("should reject if recipient address is ZERO_ADDRESS", async () => {
			await expect(
				this.contract.connect(deployer).approve(ZERO_ADDRESS, toWei(10_000))
			).to.be.revertedWith("TheStartUpPlace: token approval to ZERO_ADDRESS");
		});

		it("should emit Approval event", async () => {
			await expect(
				this.contract.connect(deployer).approve(user1.address, toWei(1))
			)
				.to.emit(this.contract, "Approval")
				.withArgs(deployer.address, user1.address, toWei(1));
		});
	});

	describe("transfer", () => {
		beforeEach(async () => {});

		it("should transfer token between accounts", async () => {
			await expect(() =>
				this.contract.connect(deployer).transfer(user1.address, toWei(1))
			).to.changeTokenBalances(
				this.contract,
				[deployer, user1],
				[toWei(-1), toWei(1)]
			);
		});

		it("should reject if recipient address is ZERO_ADDRESS", async () => {
			await expect(
				this.contract.connect(deployer).transfer(ZERO_ADDRESS, toWei(1))
			).to.be.revertedWith("TheStartUpPlace: token transfer to ZERO_ADDRESS");
		});

		it("should reject if sender balance is insufficient", async () => {
			await expect(
				this.contract.connect(user1).transfer(user2.address, toWei(1))
			).to.be.revertedWith("TheStartUpPlace: insufficient balance");
		});

		it("should emit Transfer event", async () => {
			await expect(
				this.contract.connect(deployer).transfer(user1.address, toWei(1))
			)
				.to.emit(this.contract, "Transfer")
				.withArgs(deployer.address, user1.address, toWei(1));
		});
	});

	describe("transferFrom", () => {
		beforeEach(async () => {
			// set approval
			await this.contract.connect(deployer).approve(user1.address, toWei(1));
		});

		it("should transfer token properly between accounts", async () => {
			await expect(() =>
				this.contract
					.connect(user1)
					.transferFrom(deployer.address, user1.address, toWei(1))
			).to.changeTokenBalances(
				this.contract,
				[deployer, user1],
				[toWei(-1), toWei(1)]
			);
		});

		it("should reject if allowance is zero", async () => {
			await expect(
				this.contract
					.connect(user1)
					.transferFrom(user2.address, user1.address, toWei(1))
			).to.be.revertedWith("TheStartUpPlace: amount exceeds allowance");
		});
	});
});
