import { VStack, Button, HStack, Image, Text, Link} from "@chakra-ui/react";
import { useWallet } from "../../context/wallet"
import axios from "axios";
import { useEffect, useState} from "react";
import {submarine} from "../../utils/submarine";
import { LoadingSpinner } from "../Layout/LoadingSpinner";

export const ViewNFT = (props) => {
    const {nftImg} = props
    const wallet = useWallet()
    const [isOwned, setIsOwned]  = useState(false)
    const [displaySub, setDisplaySub] = useState(false)
    const [secretLink, setSecretLink] = useState("")

    useEffect(() => {
        resetView()
    }, [wallet.address])

    const resetView = () => {
        setIsOwned(false)
        setDisplaySub(false)
        setSecretLink()
    }

    const checkOwnership = async() => {
        try {
            const {data} = await axios.get('api/getNftOwners/', {
                params: { contractAddress: process.env.NEXT_PUBLIC_CONTRACT_JKIDS, tokenId: 0, userAddress: wallet.address }
            });
            if(data.isOwned){
                setIsOwned(true)
                getSubmarinedLink()
            }
            else {
                setIsOwned(false)
            }
            setDisplaySub(true)
        } catch (error) {
            console.error(error)
        }
    }

    const getSubmarinedLink= async() => {
        const cid = process.env.NEXT_PUBLIC_PINATA_CID;
        const foundContent = await submarine.getSubmarinedContentByCid(cid);
        const folder = foundContent.items[0];
        const folderId = folder.id;
        const timeInSeconds = 3600 //one hour
        const link = await submarine.generateAccessLink(timeInSeconds, folderId, cid);
        setSecretLink(link)       
        
    }

    return (
        <>
        <VStack justifyContent="center" alignItems="center" h="100vh">
            <HStack>
                {!displaySub ?
                <Button onClick={checkOwnership} isDisabled={!wallet.address ? true : false }>Unlock Goodies</Button>
                :
                <Button onClick={resetView}>Go Back</Button>
                }
            </HStack>
            <VStack justifyContent="center" alignItems="center" padding="10px 0">
                {!displaySub ? 
                    nftImg != undefined ?
                    <Image w={500} h={500} src={nftImg} alt="Sun Tan Bird"/>
                    :
                    <LoadingSpinner/>
                :
                <>
                    {isOwned ? 
                    <>
                        <Image w={500} h={500} src={secretLink}/>
                    </>
                    :
                    <>
                    <Text fontSize={"2xl"}>No goodies for you.</Text>
                        <Link href="https://testnets.opensea.io/assets/goerli/0x69122862594fff95b37b8e317bf92b4185290248/0" passhref="true">Buy Now</Link>
                    </>
                    }
                </>  
                }             
            </VStack>
        </VStack>
        </>
    )
}
