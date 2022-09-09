import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import {WalletProvider} from "../common/context/Wallet"
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }) {
  
const desiredChain = ChainId.Goerli

  return (
    <ThirdwebProvider desiredChainId={desiredChain}>
      <WalletProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
