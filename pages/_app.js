import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import {WalletProvider} from "../common/context/wallet"

function MyApp({ Component, pageProps }) {
  

  return (
      <WalletProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
  )
}

export default MyApp
