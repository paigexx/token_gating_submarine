import { ViewNFT } from "../common/components/Nfts/ViewNFT";
import { Navbar } from "../common/components/Layout/Navbar";
import { VStack } from "@chakra-ui/react";



export default function Home({nftImg}) {

  return (
    <>
      <Navbar/>
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