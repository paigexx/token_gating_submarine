import { useEffect, useState } from "react";
import {Button} from "@chakra-ui/react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import {providerOptions} from "../../common/config/providers"
import {useWallet} from "../../common/context/Wallet";

export const LoginBttn = () => {
    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState()
    const [account, setAccount] = useState();
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [web3Modal, setWeb3Modal] = useState()
    const wallet = useWallet();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const web3modal = new Web3Modal({
            network: "goerli", 
            cacheProvider: true, 
            providerOptions 
        })
        setWeb3Modal(web3modal);
        }
    }, []);

    const connectWallet = async () => {
        try {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const accounts = await library.listAccounts();
        const network = await library.getNetwork();
        if (accounts){
            setAccount(accounts[0]);
            wallet.setAddress(accounts[0], library.getSigner(), library);
        } 
        setProvider(provider)
        setLibrary(library)
        setChainId(network.chainId);

        } catch (error) {
        setError(error);
        }
    };

    const refreshState = () => {
        wallet.setAddress("", null, "")
        setAccount();
        setChainId();
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        refreshState();
    };

    useEffect(() => {
        if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
            console.log("accountsChanged", accounts);
            if (accounts){
                setAccount(accounts[0])
                wallet.setAddress(accounts[0], library.getSigner(), library);
            } 
        };
        const handleChainChanged = (_hexChainId) => {
            setChainId(_hexChainId);
        };
        const handleDisconnect = () => {
            console.log("disconnect", error);
            disconnect();
        };

        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);

        return () => {
            if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("disconnect", handleDisconnect);
            }
        };
        }
    }, [provider]);

    return (
        <>
            {!account ? (
                <Button onClick={connectWallet}>Connect Wallet</Button>
            ) : (
                <Button onClick={disconnect}>Disconnect</Button>
            )}
        </>
    );
}