require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv/config");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

module.exports = {
	networks: {
		hardhat: {},
		rinkeby: {
			url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY],
			gasPrice: 10000000000,
		},
	},
	solidity: {
		compilers: [{ version: "0.8.13" }],
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: true,
		currency: "USD",
		coinmarketcap: process.env.COIN_MARKET_CAP_API_KEY,
		gasPriceApi:
			"https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
		showTimeSpent: true,
	},
};
