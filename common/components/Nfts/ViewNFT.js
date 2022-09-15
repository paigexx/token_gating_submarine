import { VStack, Button, Text, Link} from "@chakra-ui/react";
import { useWallet } from "../../context/wallet"
import axios from "axios";
import { useEffect, useState} from "react";
import { LoadingSpinner } from "../Layout/LoadingSpinner";
import Confetti from 'react-confetti'
import Image from "next/image";
import { useWindowSize } from "../../hooks/useWindowSize";

export const ViewNFT = (props) => {
    const {nftImg} = props
    const size = useWindowSize();
    const wallet = useWallet()
    const [displayError, setDisplayError] = useState(false)
    const [secretLink, setSecretLink] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [confettiNum, setConfettiNum] = useState()

    useEffect(() => {
        resetView()
        console.log("provider", wallet.provider)
        console.log("signer", wallet.signer)
    }, [wallet.address])

    const resetView = () => {
        setDisplayError(false)
        setIsLoading(false)
        setSecretLink("")
    }

    const checkOwnership = async() => {
        setIsLoading(true)
        try {
            const messageToSign = await axios.get("/api/checkOwnership")
            const signedData = await wallet.provider.send('personal_sign', [
                JSON.stringify(messageToSign.data), 
                wallet.address, 
                messageToSign.data]
            )   
            const res = await axios.post("/api/checkOwnership", {
                address: wallet.address,
                signature: signedData, 
                tokenId: 0
            });
            const secret_url = res.data;
            setSecretLink(secret_url);
        } 
        catch (error) {
            displayError(true)
            console.log(error)
        }
        confettiCountdown()
        setIsLoading(false)
    }
    
    
    const confettiCountdown = () => {
        setConfettiNum(200)
        setTimeout(() => {
        setConfettiNum(0)
        }, 8000);
    }   

    return (
        <VStack justifyContent="center" alignItems="center" h="100vh" padding="5px 0" spacing={10}>
            {secretLink == "" && !isLoading &&
                <>
                    <Button onClick={checkOwnership} isDisabled={!wallet.address ? true : false }>Unlock Goodies</Button>
                    <Image width={500} height={500} src={nftImg} alt="Sun Tan Bird"/>
                </>
            }
            {!secretLink == "" && !isLoading &&
                <>
                    <Confetti width={size.width} height={size.height} numberOfPieces={confettiNum}/>
                    <Button onClick={resetView}>Go Back</Button>
                    <Image width={500} height={500} src={secretLink} priority={true}/>
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
