'use client';
// Chakra imports
import {
  Flex,
  useColorModeValue,
  Text,
  Icon,
  Checkbox,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { IoMdTime } from 'react-icons/io';
import { MdOutlineAssessment } from 'react-icons/md';
import { IoEllipsisHorizontal, IoPersonCircleOutline } from 'react-icons/io5';
import { useLanguage } from '@/contexts/LanguageContext';
import TransparentMenu from '@/components/menu/TransparentMenu';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Default(props: {
  id: string;
  title: string;
  username: string;
  grandTotalPoints: string;
  grandTotalAchievablePoints: string;
  time: string;
  onDelete?: () => void;
  onEdit?: () => void;
  admin?: boolean;
  onSelectFile?: (fileId: string, isSelected: boolean) => void;
  onDownload?: () => void;
  selectedFiles: string[];
}) {
  const { language } = useLanguage();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    props.onSelectFile && props.onSelectFile(props.id, e.target.checked);
  }

  const { title, time, username, grandTotalPoints, grandTotalAchievablePoints } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');


  useEffect(() => {
    if (props.selectedFiles) {
      setIsChecked(props.selectedFiles.includes(props.id));
    }
  }, [props.selectedFiles, props.id]);

  const router = useRouter();
  const handleCardClick = () => {
    router.push({
      pathname: '/review',
      query: { fileId: props.id }
    });
  };


  return (
    <Card py="32px" px="32px"
      cursor="pointer"
      onClick={handleCardClick}
      _hover={{ transform: "scale(1.02)", zIndex: 10 }}
      transition="all 0.2s" >
      <Flex
        my="auto"
        h="100%"
        direction={'column'}
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        <Flex align="center" justify={'space-between'} w="100%" mb="60px" onClick={(e) => e.stopPropagation()}>
          <Flex align="center">
            <Icon as={RiFileExcel2Fill} w="24px" h="24px" me="8px" />
            <Text fontSize="lg" color={textColor} fontWeight="700" wordBreak="break-word">
              {title}
            </Text>
          </Flex>
          <Checkbox
            colorScheme={'green'}
            isChecked={isChecked}
            onChange={handleCheckboxChange}
            title={language === 'DE' ? 'Auswählen' : 'Select'}
          />
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Icon w="15px" h="15px" me="10px" as={IoPersonCircleOutline} color={gray} />
            <Text me="20px" fontSize="sm" color={gray} fontWeight="500">
              {username}
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Icon w="15px" h="15px" me="10px" as={MdOutlineAssessment} color={gray} />
            <Text me="20px" fontSize="sm" color={gray} fontWeight="500">
              {grandTotalPoints}/{grandTotalAchievablePoints} {language === 'DE' ? 'Punkte' : 'Points'}
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Icon w="15px" h="15px" me="10px" as={IoMdTime} color={gray} />
            <Text me="20px" fontSize="sm" color={gray} fontWeight="500">
              {time}
            </Text>
          </Flex>
          <TransparentMenu
            fileId={props.id}
            onEditClick={props.onEdit}
            onDownloadClick={props.onDownload}
            onDeleteClick={props.onDelete}
            display="flex"
            alignItems="center"
            justifyContent="center"
            maxH="max-content"
            title={language === 'DE' ? 'Mehr Optionen' : 'More Options'}
            icon={
              <Icon
                w="24px"
                h="24px"
                mb="-5px"
                as={IoEllipsisHorizontal}
                color={gray}
                fill={gray}
              />
            }
          />
        </Flex>
      </Flex>
    </Card>

  );
}
