import { VStack, Button, HStack, Spinner, Image, Text } from "@chakra-ui/react";
import { useWallet } from '../../common/context/Wallet';
import axios from "axios";
import { useEffect, useState} from "react";
import {submarine} from "../../services/Submarine"

export const ViewNFT = () => {
    const wallet = useWallet()
    const [nftData, setNftData] = useState([])
    const [isOwned, setIsOwned]  = useState(false)
    const [displaySub, setDisplaySub] = useState(false)
    const [secretLink, setSecretLink] = useState("")

    useEffect(() => {
        const getNftData = () => {
            const baseURL = `https://eth-goerli.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTsForCollection`;
            const url = `${baseURL}?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_JKIDS}&withMetadata=true`;
            const config = {
                method: 'get',
                url: url,
            };
            axios(config)
            .then(response => setNftData(response["data"].nfts))
            .catch(error => console.log(error));
        }
        getNftData()    
    },[])

    useEffect(() => {
        resetView()
    }, [wallet.address])

    const checkOwnership = () => {
        const tokenId = 0
        const baseURL = `https://eth-goerli.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getOwnersForToken`;
        const url = `${baseURL}?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_JKIDS}&tokenId=${tokenId}`;
        const config = {
            method: 'get',
            url: url,
        };
        axios(config)
            .then(response  => {
                let data = response.data
                if (data.owners.includes(wallet.address.toLowerCase())) {
                    setIsOwned(true)
                    getSubmarinedLink()
                }
                else{setIsOwned(false)}
                setDisplaySub(true)
            })
            .catch(error => console.log(error));
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

    const resetView = () => {
        setIsOwned(false)
        setDisplaySub(false)
        setSecretLink()
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
                <HStack>
                    {!displaySub ? 
                        nftData.length > 0 ?
                        <Image w={500} h={500} src={nftData[0].media[0].gateway}/>
                        :
                        <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='pink.500'
                        size='xl'
                        />
                    :
                    <>
                        {isOwned ? 
                        <>
                            <Image w={500} h={500} src={secretLink}/>
                        </>
                        :
                        <>
                            <Text fontSize={"2xl"}>No goodies for you :/</Text>
                        </>
                        }
                    </>  
                    }             
                </HStack>
            </VStack>
        </VStack>
        </>
    )
}