import { VStack, Button, Text, Link, ButtonGroup} from "@chakra-ui/react";
import { useWallet } from "../../context/wallet"
import axios from "axios";
import { useEffect, useState} from "react";
import { LoadingSpinner } from "../Layout/LoadingSpinner";
import Confetti from 'react-confetti'
import { useWindowSize } from "../../hooks/useWindowSize";
import { LinkIcon } from "@chakra-ui/icons";

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
            confettiCountdown()
        } 
        catch (error) {
            if (error.code === 4001){
                console.log("User rejected transaction")
            }
            else{
                setDisplayError(true)
                console.log(error)
            }    
        }
        setIsLoading(false)
    }

    const confettiCountdown = () => {
        setConfettiNum(200)
        setTimeout(() => {
        setConfettiNum(0)
        }, 8000);
    }   

    return (
        <VStack justifyContent="center" alignItems="center" padding="50px 0" spacing={10}>
            {secretLink == "" && !displayError && !isLoading &&
                <>
                    <Button onClick={checkOwnership} isDisabled={!wallet.address ? true : false }>Unlock Goodies</Button>
                    <img style={{maxWidth: "40%"}} src={nftImg} alt="Sun Tan Bird" />

                </>
            }
            {!secretLink == "" && !isLoading &&
                <>
                    <Confetti width={size.width} height={size.height} numberOfPieces={confettiNum}/>
                    <Button onClick={resetView}>Go Back</Button>
                    <Text>Score! Check out this secret NFT...</Text>
                    <img style={{maxWidth: "40%"}} src={secretLink} alt="Your unlocked NFT :)" />
                </>
            }
            {displayError && !isLoading &&
                <>
                    
                    <ButtonGroup>
                        <Button onClick={resetView}>Go Back</Button>
                        <Link href="https://testnets.opensea.io/assets/goerli/0x69122862594fff95b37b8e317bf92b4185290248/0" isExternal="true" passhref="true">
                        <Button>Buy NFT Now <LinkIcon/></Button></Link>
                    </ButtonGroup>
                    <Text fontSize={"2xl"}>No goodies for you.</Text>
                    <iframe src="https://giphy.com/embed/ycqpjZz5q8PxutLefj" width="350" height="350" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/chubbiverse-cute-chubbi-chubbisaur-ycqpjZz5q8PxutLefj">via GIPHY</a></p>
                </>
            }
            {isLoading && <LoadingSpinner/>}          
        </VStack>

    )
}
