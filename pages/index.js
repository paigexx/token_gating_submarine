import {useWallet} from "../common/context/Wallet";
import { useEffect } from "react";
import { Navbar } from "../modules/Layout/Navbar";
import { ViewNFT } from "../modules/Nfts/ViewNFT";

export default function Home() {
  const wallet = useWallet();

  useEffect(() => {
    console.log(wallet.address)
  }, [wallet])
  return (
    <>
    <Navbar/>
    <ViewNFT/>
    </>
  )
}
