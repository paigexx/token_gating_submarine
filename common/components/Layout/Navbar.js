import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Stack,
    useColorMode,
    HStack, 
    Text
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { truncateAddress } from '../../utils/utils';
import { useWallet } from "../../context/wallet"
import { LoginBttn } from '../Auth/LoginBttn';


export const Navbar =() => {
    const { colorMode, toggleColorMode } = useColorMode();
    const wallet = useWallet()
    return (
        <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box>
                <HStack>
                    <Text>{`Connection Status: `}</Text>
                    {wallet.address ? (
                    <CheckCircleIcon color="green" />
                    ) : (
                    <WarningIcon color="#cd5700" />
                    )}
                </HStack>
                <HStack>
                    {wallet.address && 
                        <Text>{`Account: ${truncateAddress(wallet.address)}`}</Text>
                    }
                </HStack>
            </Box>
            <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                    <LoginBttn/>
                    <Button onClick={toggleColorMode}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </Stack>
            </Flex>
            </Flex>
        </Box>
        </>
    );
}