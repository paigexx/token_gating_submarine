import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';


export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, 
        options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_KEY
        }
    }, 
    walletlink: {
        package: CoinbaseWalletSDK,
        options: {
            appName: "Pinata Submarine App", 
            infuraId: process.env.NEXT_PUBLIC_INFURA_KEY,
            rpc: process.env.NEXT_PUBLIC_INFURA_URL, 
            chainId: 5, // Goerli 
            darkMode: true 
        }
    }, 
};