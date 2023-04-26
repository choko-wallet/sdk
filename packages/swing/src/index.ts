import SwingSDK, { Options, Components, TransferParams, TransferRoute, TransferStatus } from '@swing.xyz/sdk'

export const initSwing = async (options?: Options): Promise<SwingSDK> => {
    const sdk = new SwingSDK(options)
    await sdk.init()
    return sdk
}

export const connectWallet = async (sdk: SwingSDK, provider: any, chainSlug: Components.Schemas.ChainSlug) => {
    await sdk.wallet.connect(provider, chainSlug)
}

export const getQuote = async (sdk: SwingSDK, transferParams: TransferParams) => {
    const quote = await sdk.getQuote(transferParams)
    return quote
}

export const transfer = async (sdk: SwingSDK, transferParams: TransferParams, transferRoute: TransferRoute) => {
    await sdk.transfer(transferRoute, transferParams)
}

export const getTransactionHistory = async (sdk: SwingSDK, address: string) => {
    return await sdk.wallet.getTransactions(address)
}

export const addTransferStatusListener = (sdk: SwingSDK, callback: (status: TransferStatus) => void) => {
    sdk.on('TRANSFER', (transfer: TransferStatus) => {
        callback(transfer)
    })
}