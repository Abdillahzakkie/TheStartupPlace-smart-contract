const hre = require("hardhat");
require("dotenv/config");

async function main() {
	const Token = await ethers.getContractFactory("TheStartUpPlace");

	this.token = await Token.deploy();
	await this.token.deployed();
	const _baseURL = "https://rinkeby.etherscan.io/address/";
	console.log(`TheStartUpPlace deployed to: ${_baseURL}/${this.token.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
