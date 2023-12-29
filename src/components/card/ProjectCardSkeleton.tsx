import { Flex, Card, Skeleton, SkeletonText, useColorModeValue } from '@chakra-ui/react';

const ProjectCardSkeleton = () => {
  const bgColor = useColorModeValue('white', 'navy.700');

  return (
    <Card py="32px" px="32px" bg={bgColor} >
      <Flex
        my="auto"
        h="100%"
        direction={'column'}
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        <Flex align="center" justify={'space-between'} w="100%" mb="60px">
          <Flex align="center">
            <Skeleton startColor="gray.300" endColor="gray.500" w="24px" h="24px" me="8px" />
            <SkeletonText noOfLines={1} w="110px" />
          </Flex>
          <Skeleton startColor="gray.300" endColor="gray.500" w="24px" h="24px" />
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Skeleton startColor="gray.300" endColor="gray.500" w="15px" h="15px" me="10px" />
            <SkeletonText noOfLines={1} w="150px" />
          </Flex>
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Skeleton startColor="gray.300" endColor="gray.500" w="15px" h="15px" me="10px" />
            <SkeletonText noOfLines={1} w="150px" />
          </Flex>
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Skeleton startColor="gray.300" endColor="gray.500" w="15px" h="15px" me="10px" />
            <SkeletonText noOfLines={1} w="150px" />
          </Flex>
          <Skeleton startColor="gray.300" endColor="gray.500" w="50px" h="24px" />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProjectCardSkeleton;
