import {Spinner, VStack, Text} from "@chakra-ui/react";


export const LoadingSpinner = () => {
    return (
        <>
            <VStack>
                <Spinner
                    speed='0.65s'
                    thickness='4px'
                    emptyColor='gray.200'
                    color='pink.500'
                    size='xl'
                />
                <Text>Fetching top secret goodies..</Text>
            </VStack>
        </>
    )
}