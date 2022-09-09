import {createContext, useContext, useState} from "react";

const WalletContext = createContext({
    setAddress: (address, provider, network) => {
    }, address: "", provider: null, network: ""
});

export const useWallet = () => useContext((WalletContext));

export const WalletProvider = (props) => {
    const setWalletContext = (address, provider, network) => {
        setWallet({...wallet, address, provider,  network})
    }
    const [wallet, setWallet] = useState({setAddress: setWalletContext});

    return <WalletContext.Provider value={wallet}>
        {props.children}
    </WalletContext.Provider>
}