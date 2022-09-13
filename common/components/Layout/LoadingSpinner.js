import {Spinner} from "@chakra-ui/react";


export const LoadingSpinner = () => {
    return (
        <>
            <Spinner
                speed='0.65s'
                thickness='4px'
                emptyColor='gray.200'
                color='pink.500'
                size='xl'
            />
        </>
    )
}