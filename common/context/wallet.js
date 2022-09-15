import {createContext, useContext, useState} from "react";

const WalletContext = createContext({
    setAddress: (address, signer, provider) => {
    }, address: "", signer: null, provider: null
});

export const useWallet = () => useContext((WalletContext));

export const WalletProvider = (props) => {
    const setWalletContext = (address, signer, provider) => {
        setWallet({...wallet, address, signer,  provider})
    }
    const [wallet, setWallet] = useState({setAddress: setWalletContext});

    return <WalletContext.Provider value={wallet}>
        {props.children}
    </WalletContext.Provider>
}
