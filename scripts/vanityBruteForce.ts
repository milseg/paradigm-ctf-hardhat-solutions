import { ethers } from "hardhat";

const utils = ethers.utils;
const BigNumber = ethers.BigNumber;
const abiCoder = utils.defaultAbiCoder;


// sha256(IERC1271.isValidSignature.selector + abi.encode(keccak256(abi.encodePacked("CHALLENGE_MAGIC")), signature) == IERC1271.isValidSignature.selector
const isValidSignatureSel = utils.keccak256(utils.toUtf8Bytes("isValidSignature(bytes32,bytes)")).substr(0, 10)

console.log("isValidSignatureSel:", isValidSignatureSel) //should print 0x1626ba7e


const magic = utils.solidityKeccak256(["bytes"], [utils.solidityPack(["string"], ["CHALLENGE_MAGIC"])] )//parameters
console.log(`magic ${magic.length} - ${magic} `)



let signature = BigNumber.from(2364647611); //should be valid signature 
let hexSignature = utils.hexValue(signature)
if(hexSignature.length%2 === 1) {
    hexSignature = utils.hexZeroPad(hexSignature, (hexSignature.length-1)/2 )
}

console.log("signature: ", hexSignature)

let encodedPms = abiCoder.encode(["bytes32", "bytes"], [magic, hexSignature])
let callData = utils.concat([
	isValidSignatureSel,
	encodedPms
])

const result = utils.soliditySha256(["bytes"], [callData])

console.log("result", result)

if(result.substr(0, 10) == isValidSignatureSel ) {
    console.log("valid signature")
} else {
	console.log("invalid signature")
}

/*
=== BRUTEFORCE ===
let signature = BigNumber.from(0);
while(true) {
    let hexSignature = utils.hexValue(signature)
    if(hexSignature.length%2 === 1) {
        hexSignature = utils.hexZeroPad(hexSignature, (hexSignature.length-1)/2 )
    }
    let encodedPms = abiCoder.encode(["bytes32", "bytes"], [magic, hexSignature])
    let callData = utils.concat([
    	isValidSignatureSel,
		encodedPms
    ])

    let result = utils.soliditySha256(["bytes"], [callData])

    if(result.substr(0, 10) == isValidSignatureSel ) {
        break;
    }
    signature.add(1);
}*/