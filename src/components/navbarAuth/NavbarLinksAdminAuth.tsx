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
} from '@chakra-ui/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
//import APIModal from '@/components/apiModal';
import NavLink from '../link/NavLink';
import routes from '@/routes';
import { useState } from 'react';
import { userAgent } from 'next/server';
import {IoInformationCircleOutline} from 'react-icons/io5';
export default function HeaderLinks(props: {
  secondary: boolean;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
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
      bg={menuBg}
      flexWrap='nowrap'
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
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
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      {/* <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            w="40px"
            h="40px"
            borderRadius={'50%'}
          />
          <IoInformationCircleOutline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            size="2em"
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
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
         <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color={textColor}
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                Zur Homepage
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
          </Menu> */}
    </Flex>
  );
}
