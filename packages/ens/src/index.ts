import ethers from 'ethers'
import { serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { resolveProperties } from "@ethersproject/properties";

// We assume that the you have the ownership of this ENS name
const ROOT_ENS_NAME = "chokotest.eth"
const ROOT_ENS_NAME_HASH = ethers.utils.namehash(ROOT_ENS_NAME)
const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
const ENS_ABI = [
    "function setSubnodeOwner(bytes32 node, bytes32 label, address owner)",
    "function owner(bytes32 node) external view returns (address)",
    "function setOwner(bytes32 node, address owner)"
]

export async function registerENSName (provider: ethers.providers.Provider, newName: string, owner: string, transactionOption: any): Promise<string> {
    const subNode = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(newName))

    const ens = new ethers.Contract(ENS_REGISTRY_ADDRESS, ENS_ABI, provider);
    const populatedTx = await ens.populateTransaction.setSubnodeOwner(ROOT_ENS_NAME_HASH, subNode, owner, transactionOption)
    const unsignedTx = await resolveProperties(populatedTx)
    if (unsignedTx.from != null) {
        delete unsignedTx.from;
    }
    
    return serialize(<UnsignedTransaction>unsignedTx)
}

export async function resolveENSAddress (provider: ethers.providers.Provider, ensName: string): Promise<string> {
    return await provider.resolveName(ensName);
}