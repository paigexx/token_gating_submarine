import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import {WalletProvider} from "../common/context/wallet"
import { Navbar } from "../common/components/Layout/Navbar";


function MyApp({ Component, pageProps }) {
  

  return (
      <WalletProvider>
        <ChakraProvider>
          <Navbar/>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletProvider>
  )
}

export default MyApp
