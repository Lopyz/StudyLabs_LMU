'use client';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Text,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { MdEdit } from 'react-icons/md';
import NavLink from '../link/NavLink';
import { useLanguage } from '@/contexts/LanguageContext';


export default function Default(props: {
  illustration: string | JSX.Element;
  name: string;
  description: string;
  link: string;
  edit?: string;
  action?: any;
  admin?: boolean;
}) {
  const { illustration, name, description, link, edit, admin } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const { language } = useLanguage();

  return (
    <NavLink href={link}>
      <Card h="100%" py="24px" px="24px"
        _hover={{ transform: "scale(1.01)" }}
        transition="transform 0.2s">
        <Flex
          my="auto"
          h="100%"
          direction={'column'}
          align={{ base: 'start', xl: 'start' }}
          justify={{ base: 'center', xl: 'center' }}
        >
          <Flex align="start" w="100%" mb="30px">
            <Text fontSize="34px" lineHeight={'120%'}>
              {illustration}
            </Text>
            {admin ? (
              <Flex ms="auto">
                <NavLink href={edit ? edit : '/admin/edit-schema'}>
                  <Tooltip label={language === 'DE' ? 'Klicke hier, um das Schema zu bearbeiten oder zu löschen.' : 'Click here to edit or delete the scheme.'} placement="top">

                    <Button
                      w="24px"
                      h="24px"
                      _hover={{
                        backgroundColor: "gray.200"
                      }}
                      _focus={{
                        boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)"
                      }}
                      _active={{
                        backgroundColor: "gray.300"
                      }}
                      bg="none"
                    >
                      <Icon w="28px" h="28px" as={MdEdit} color={gray} />
                    </Button>
                  </Tooltip>
                </NavLink>
              </Flex>
            ) : null}
          </Flex>
          <Box>
            <Text fontSize="lg" color={textColor} fontWeight="700" mb="8px">
              {name}
            </Text>
            <Text fontSize="sm" color={gray} fontWeight="500">
              {description}
            </Text>
          </Box>
        </Flex>
      </Card>
    </NavLink>
  );
}