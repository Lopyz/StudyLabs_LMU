'use client';
// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { HorizonLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {

  let logoColor = useColorModeValue('navy.700', 'white');
  
  const router = useRouter();

  const navigateToMyProjects = () => {
    router.push('/my-tasks');
  };

  return (
    <Flex alignItems="center" flexDirection="column" style={{ cursor: 'pointer' }}> 
      <HorizonLogo h="65px" w="220px" my="10px" color={logoColor} onClick={navigateToMyProjects} />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;