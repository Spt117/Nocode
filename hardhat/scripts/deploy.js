const hre = require("hardhat");
const { readFileSync, writeFileSync } = require("fs");

async function main() {
    const jsonToObject = JSON.parse(
        readFileSync("../src/contrats/address.json")
    );

    console.log("Début du déploiement !");
    const NoCodeERC20 = await hre.ethers.getContractFactory("NoCodeERC20");
    console.log("Déploiement en cours !");
    const noCodeERC20 = await NoCodeERC20.deploy();
    console.log("Déploiement en phase terminale !");
    await noCodeERC20.deployed();
    console.log("Le contrat est déployé à l'adresse: " + noCodeERC20.address);

    const network = hre.ethers.provider._network;
    const data = { name: network.name, address: noCodeERC20.address };

    jsonToObject.networks[network.chainId] = data;
    jsonToObject.history.push(data);
    writeFileSync(
        "../src/contrats/address.json",
        JSON.stringify(jsonToObject, null, 4),
        async (err) => {
            if (err) {
                // eslint-disable-next-line no-undef
                await _log("Error:" + err);
            }
        }
    );
    console.log("Déploiement sauvegardé ici: ../src/contrats/address.json");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
