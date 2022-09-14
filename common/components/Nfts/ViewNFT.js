import { VStack, Button, Image, Text, Link} from "@chakra-ui/react";
import { useWallet } from "../../context/wallet"
import axios from "axios";
import { useEffect, useState} from "react";
import { LoadingSpinner } from "../Layout/LoadingSpinner";
import Confetti from 'react-confetti'
import { useWindowSize } from "../../hooks/useWindowSize";


export const ViewNFT = (props) => {
    const {nftImg} = props
    const size = useWindowSize();
    const wallet = useWallet()
    const [displaySecret, setDisplaySecret] = useState(false)
    const [displayError, setDisplayError] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)
    const [secretLink, setSecretLink] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [confettiNum, setConfettiNum] = useState()

    useEffect(() => {
        resetView()
    }, [wallet.address])

    const resetView = () => {
        setDisplaySecret(false)
        setDisplayError(false)
        setDisplaySuccess(false)
        setIsLoading(false)
        setSecretLink()
    }

    const checkOwnership = async() => {
        setIsLoading(true)
        try {
            const {data} = await axios.get('api/checkOwnership/', {
                params: { contractAddress: process.env.NEXT_PUBLIC_CONTRACT_JKIDS, tokenId: 0, userAddress: wallet.address }
            });
            if(data.isOwned){
                setSecretLink(data.submarineLink)
                setDisplaySuccess(true)
            }
            else{
                setDisplayError(true)
            }
        } catch (error) {
            console.error("Error", error)
        }
        setDisplaySecret(true)
        setIsLoading(false)
        confettiCountdown()
    }

    const confettiCountdown = () => {
        setConfettiNum(200)
        setTimeout(() => {
        setConfettiNum(0)
        }, 8000);
    }   

    return (
        <VStack justifyContent="center" alignItems="center" h="100vh" padding="5px 0" spacing={5}>
            {!displaySecret && !isLoading &&
                <>
                    <Button onClick={checkOwnership} isDisabled={!wallet.address ? true : false }>Unlock Goodies</Button>
                    <Image w={500} h={500} src={nftImg} alt="Sun Tan Bird"/>
                </>
            }
            {displaySuccess && !isLoading &&
                <>
                    <Confetti width={size.width} height={size.height} numberOfPieces={confettiNum}/>
                    <Button onClick={resetView}>Go Back</Button>
                    <Image w={500} h={500} src={secretLink}/>
                </>
            }
            {displayError && !isLoading &&
                <>
                    <Button onClick={resetView}>Go Back</Button>
                    <Text fontSize={"2xl"}>No goodies for you.</Text>
                    <Link href="https://testnets.opensea.io/assets/goerli/0x69122862594fff95b37b8e317bf92b4185290248/0" passhref="true">Buy Now</Link>
                </>
            }
            {isLoading && <LoadingSpinner/>}          
        </VStack>

    )
}
