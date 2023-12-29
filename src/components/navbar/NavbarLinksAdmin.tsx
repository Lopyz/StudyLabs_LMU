'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  SkeletonCircle
} from '@chakra-ui/react';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
//import APIModal from '@/components/apiModal';
import NavLink from '../link/NavLink';
import routes from '@/routes';
import { useClerk } from '@clerk/nextjs';
import { useAdminProtectionFrontend } from '@/utils/adminProtectionFrontend';
import { useRouter } from 'next/router';
import { NextAvatar } from '@/components/image/Avatar';
import { useState, useEffect } from 'react';
export default function HeaderLinks(props: {
  secondary: boolean;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Modee
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(44, 44, 44, 0.18)',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut } = useClerk();
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

  function EnhancedSidebar() {
    const isAdmin = useAdminProtectionFrontend();
    const [isAdminChecked, setIsAdminChecked] = useState(false);

    useEffect(() => {
      setIsAdminChecked(true);
    }, [isAdmin]);

    const accessibleRoutes = routes.filter(route => {
      if (route.name === 'Admin Konsole' || route.name === 'Admin Console') {
        return isAdmin;
      }
      return true;
    });

    if (!isAdminChecked) {
      return null;
    }

    return (
      <SidebarResponsive routes={accessibleRoutes} />
    )
  }

  const handleLangChange = (lang: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem('isReloading', 'true');
      window.localStorage.setItem("language", lang);
      window.location.reload();
    }
  };

  return (
    <Flex
      w='auto'
      alignItems="center"
      flexDirection="row"
      justifyContent="flex-end"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', sm: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* <SearchBar
      mb={() => {
        if (secondary) {
          return { base: '10px', md: 'unset' };
        }
        return 'unset';
      }}
      me="10px"
      borderRadius="30px"
    /> */}
      <EnhancedSidebar />
      {/* <APIModal setApiKey={setApiKey} /> */}

      <Menu >
        <MenuButton as={Button} p="0px" variant="unstyled" title={language === 'DE' ? 'Sprache' : 'Language'}>
          {language}
        </MenuButton>
        <MenuList bg={menuBg} borderRadius={"15px"} p={1} minW="0" w={'100px'}>
          {language === 'EN' && (
            <MenuItem onClick={() => handleLangChange('DE')} _hover={hoverButton} justifyContent={"center"} bg={menuBg} >
              <Text textAlign="center" fontSize="m" fontWeight="500" ml="5px">
                Deutsch
              </Text>
            </MenuItem>
          )}
          {language === 'DE' && (
            <MenuItem onClick={() => handleLangChange('EN')} _hover={hoverButton} justifyContent={"center"} bg={menuBg}>
              <Text textAlign="center" fontSize="m" fontWeight="500" ml="5px">
                Englisch
              </Text>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
        title={language === 'DE' ? 'Erscheinungsbild' : 'Appearance'}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          {user && user.imageUrl ? (
            <NextAvatar h="34px" w="34px" src={user.imageUrl} me="10px" />
          ) : (
            <SkeletonCircle size="34px" marginEnd="10px" />
          )}
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
            </Text>
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {user?.username}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            {/* <NavLink href="/settings">
             <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  {language === 'DE' ? 'Mein Profil' : 'My Profile'}
                </Text>
              </MenuItem> 
            </NavLink>
            <NavLink href="https://zavi-ai.de">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  {language === 'DE' ? 'Zur Hompage' : 'Go To Homepage'}
                </Text>
              </MenuItem>
            </NavLink> */}
            <MenuItem
              onClick={handleSignOut} // Fügen Sie den onClick-Handler hinzu
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                {language === 'DE' ? 'Ausloggen' : 'Log Out'}
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
