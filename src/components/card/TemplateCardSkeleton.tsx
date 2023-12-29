import { Flex, Card, Skeleton, SkeletonText, Box, useColorModeValue } from '@chakra-ui/react';
import NavLink from '../link/NavLink';

const TemplateCardSkeleton = () => {
  const bgColor = useColorModeValue('white', 'navy.700');
  return (
    // NavLink kann ein leerer href haben oder auf eine Lade- oder Fehlerseite verlinken
    <NavLink href="#">
      <Card h="100%" py="32px" px="32px" bg={bgColor}>
        <Flex
          my="auto"
          h="100%"
          direction={'column'}
          align={{ base: 'start', xl: 'start' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Flex align="start" w="100%" mb="30px">
            <Flex ms="end">
              <Skeleton startColor="gray.300" endColor="gray.500" w="24px" h="24px" />
            </Flex>
          </Flex>
          <Box>
            <SkeletonText noOfLines={1} w="200px" fontSize="lg" mb="8px" />
            <SkeletonText noOfLines={1} w="300px" fontSize="sm" />
          </Box>
        </Flex>
      </Card>
    </NavLink>
  );
};

export default TemplateCardSkeleton;
