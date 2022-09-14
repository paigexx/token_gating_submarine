import {useWallet} from "../common/context/wallet"
import { useEffect } from "react";
import { ViewNFT } from "../common/components/Nfts/ViewNFT";


export default function Home({nftImg}) {
  const wallet = useWallet();

  useEffect(() => {
    console.log(wallet.address)
  }, [wallet])
  return (
    <>
    <ViewNFT nftImg={nftImg}/>
    </>
  )
}


export const getStaticProps = async () => {
  const sdk = require('api')('@alchemy-docs/v1.0#u2rm9ol7vhuzf7');
  sdk.server('https://eth-goerli.g.alchemy.com/nft/v2');
  const res = await sdk.getNFTMetadata({
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_JKIDS,
    tokenId: '0',
    refreshCache: 'false',
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY
  })
  const nftImg = res.media[0].gateway
  return {
      props: {
          nftImg,
      },
  };
};