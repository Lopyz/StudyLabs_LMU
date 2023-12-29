'use client';
// Chakra imports
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorModeValue,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import {
  MdDownload,
  MdEdit,
  MdDelete,
} from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import React from 'react';
import { useRouter } from 'next/router';

export default function Banner(props: {
  icon: JSX.Element | string;
  fileId: string;
  onDeleteClick?: (fileId: string) => void;
  onDownloadClick?: (fileId: string) => void;
  onEditClick?: (fileId: string) => void;
  [x: string]: any;
}) {
  const { icon, fileId, onDeleteClick, onDownloadClick, onEditClick } = props;
  const { language } = useLanguage();
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const bgColor = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('navy.700', 'white');
  const textHover = useColorModeValue({ color: 'navy.700', bg: 'unset' }, { color: 'gray.500', bg: 'unset' });
  const bgList = useColorModeValue('white', 'whiteAlpha.100');
  const bgShadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');

  const router = useRouter();

  const handleCardClick = () => {
    router.push({
      pathname: '/review',
      query: { fileId }
    });
  };

  return (
    <>
      <Menu isOpen={isOpen1} onClose={onClose1}>
        <MenuButton onClick={(e) => { e.stopPropagation(); onOpen1(); }} title={language === 'DE' ? 'Optionen anzeigen' : 'Show more options'}>
          {icon}
        </MenuButton>
        <MenuList
          w="150px"
          minW="unset"
          maxW="150px !important"
          border="transparent"
          backdropFilter="blur(63px)"
          bg={bgList}
          boxShadow={bgShadow}
          borderRadius="20px"
          p="15px"
        >
          <MenuItem
            onClick={(e) => { e.stopPropagation(); props.onDownloadClick && props.onDownloadClick(props.fileId); }}
            transition="0.2s linear"
            color={textColor}
            _hover={textHover}
            p="0px"
            borderRadius="8px"
            _active={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}
            mb="10px"
          >
            <Flex align="center">
              <Icon as={MdDownload} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                {language === 'DE' ? 'Datei herunterladen' : 'Download file'}
              </Text>
            </Flex>
          </MenuItem>
          <MenuItem
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            transition="0.2s linear"
            p="0px"
            borderRadius="8px"
            color={textColor}
            _hover={textHover}
            _active={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}
            mb="10px"
          >
            <Flex align="center">
              <Icon as={FaEye} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                {language === 'DE' ? 'Feedback anzeigen' : 'View feeback'}
              </Text>
            </Flex>
          </MenuItem>
          <MenuItem
            onClick={(e) => { e.stopPropagation(); props.onEditClick && props.onEditClick(props.fileId); }}
            transition="0.2s linear"
            p="0px"
            borderRadius="8px"
            color={textColor}
            _hover={textHover}
            _active={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}
            mb="10px"
          >
            <Flex align="center">
              <Icon as={MdEdit} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                {language === 'DE' ? 'Überschrift bearbeiten' : 'Edit title'}
              </Text>
            </Flex>
          </MenuItem>
          <MenuItem
            onClick={(e) => { e.stopPropagation(); props.onDeleteClick && props.onDeleteClick(props.fileId); }}
            transition="0.2s linear"
            color={textColor}
            _hover={textHover}
            p="0px"
            borderRadius="8px"
            _active={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}
          >
            <Flex align="center">
              <Icon as={MdDelete} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                {language === 'DE' ? 'Datei löschen' : 'Delete file'}
              </Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}