import { VStack, Button, HStack, Spinner, Image, Text } from "@chakra-ui/react";
import { useWallet } from '../../common/context/Wallet';
import axios from "axios";
import { useEffect, useState} from "react";

export const ViewNFT = () => {
    const wallet = useWallet()
    const [nftData, setNftData] = useState([])
    const baseURL = `https://eth-goerli.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTsForCollection`;
    const url = `${baseURL}?contractAddress=${process.env.NEXT_PUBLIC_CONTRACT_JKIDS}&withMetadata=true`;
    const config = {
        method: 'get',
        url: url,
    };

    useEffect(() => {
        axios(config)
        .then(response => {
            console.log(JSON.stringify(response['data'], null, 2)),
            setNftData(response["data"].nfts)
        }
            )
        .catch(error => console.log(error));
    },[])

    return (
        <>
        <VStack justifyContent="center" alignItems="center" h="100vh">
            <HStack>
                <Button isDisabled={!wallet.address ? true : false }>Unlock Goodies</Button>
            </HStack>
            <VStack justifyContent="center" alignItems="center" padding="10px 0">
                <HStack>
                    {nftData.length > 0 ?
                    <Image w={500} h={500} src={nftData[0].media[0].gateway} alt={nftData[0].description}/>
                    :
                    <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='pink.500'
                    size='xl'
                    />
                    }                  
                </HStack>
            </VStack>
        </VStack>
        </>
    )
}