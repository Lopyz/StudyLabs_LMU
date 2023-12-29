import React from 'react';
import { Box, Skeleton, Flex, useColorModeValue } from '@chakra-ui/react';

const CardSkeleton: React.FC = () => {
    const bgColor = useColorModeValue('white', 'navy.700');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

    return (
        <Box
            bg={bgColor}
            w="100%"
            h={{ base: "65px", md: "75px", lg: "100px" }}
            p={4}
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            boxShadow={"md"}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.2s"
        >
            <Flex direction="column" align="center" justify="center" h="100%">
                <Skeleton height="20px" width="80%" />
                <Skeleton height="15px" width="60%" mt="4" />
            </Flex>
        </Box>
    );
};

export default CardSkeleton;