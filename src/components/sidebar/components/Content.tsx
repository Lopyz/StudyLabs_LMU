'use client';
// chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  SkeletonCircle,
  SkeletonText
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
//   Custom components
import { NextAvatar } from '@/components/image/Avatar';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';
//import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { FiLogOut } from 'react-icons/fi';
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import { useLanguage } from '../../../../src/contexts/LanguageContext';

// FUNCTIONS

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const { routes, setApiKey } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');
  const { signOut } = useClerk(); // Der Clerk hook, um die signOut Funktion zu bekommen
  const router = useRouter(); // Initialisieren Sie den useRouter Hook

  const handleSignOut = async () => {
    try {
      await signOut(() => {
        router.push('/sign-in');
        localStorage.removeItem("hasClosedChangelog");
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const { language } = useLanguage();
  const { user } = useClerk();

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links routes={routes} />
        </Box>
      </Stack>
      <Box mt="60px" width={'100%'} display={'flex'} justifyContent={'center'}>
        <SidebarCard />
      </Box>
      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        {user && user.imageUrl ? (
          <NextAvatar h="34px" w="34px" src={user.imageUrl} me="10px" />
        ) : (
          <SkeletonCircle size="34px" marginEnd="10px" />
        )}
        {user ? (
          <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
            {user.username}
          </Text>
        ) : (
          <SkeletonText width="100px" noOfLines={1} marginEnd="10px" />
        )}
        
        <Button
          ml="34px"
          onClick={handleSignOut} // Fügen Sie den onClick-Handler hinzu
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
          title={language === 'DE' ? 'Ausloggen' : 'Log Out'}
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;