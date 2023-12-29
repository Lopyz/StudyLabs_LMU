/*eslint-disable*/

import Card from '@/components/card/Card';
import {
  Flex,
  useColorModeValue,
  Box,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Tooltip,
  Text,


} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';
import { MdOutlineAssessment } from 'react-icons/md';

type ExcelDataType = {
  exercise_id: string;
  exercise_text: string;
  solution_student: string;
  points_achieved: number;
  points_achievable: number;
  feedback: string;
};

export default function Home(props: { apiKeyApp: string }) {
  const { language } = useLanguage();

  const [excelData, setExcelData] = useState<any[]>([]);;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.200', '#2C2C2E');
  const bgColor = useColorModeValue('white', 'navy.700');

  const router = useRouter();
  const goBack = () => { router.push('/my-projects'); };
  const [isLoading, setIsLoading] = useState(true); // Ladezustand

  // -------------- File Management --------------
  const [filename, setFilename] = useState<string>('');
  const [grandTotalPoints, setGrandTotalPoints] = useState<string>('');
  const [grandTotalAchievablePoints, setGrandTotalAchievablePoints] = useState<string>('');

  useEffect(() => {
    const { fileId } = router.query;

    if (fileId) {
      setIsLoading(true); // Setze den Ladezustand auf 'wahr', bevor der Abruf beginnt
      fetch(`/api/db/project/getData?fileId=${fileId}`)
        .then((res) => res.json())
        .then((data) => {
          const filteredData = data.data.filter((item: any) => item.solution_student && item.solution_student.trim() !== '');
          setExcelData(filteredData); // Speichern der Daten für die Tabelle
          setFilename(data.filename);
          setGrandTotalPoints(data.grandTotalPoints);
          setGrandTotalAchievablePoints(data.grandTotalAchievablePoints);
          setIsLoading(false);
        })
        .catch((error) => console.error('Error:', error));
      setIsLoading(false);
    }
  }, [router.query]);

  // -------------- Scrollbar --------------


  const tabListRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };


  // -------------- Frontend Compoenent --------------

  return (
    <Flex
      direction="column"
      position="relative"
      mt={{ base: '100px', md: '0px', xl: '0px' }}
    >
      <Flex
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        justify="center"
        direction={{ base: 'column', md: 'column' }}
        maxW="1434px"
      >
        <Card
          w="100%"
          mb="20px"
        >
          <Flex
            align="center"
            direction='column'
            mb="10px"
          >
            <Text
              fontSize="xl"
              color={textColor}
              fontWeight="700"
              mb="5px"
            >
              {filename}
            </Text>
            <Flex
              alignItems="center"
              fontSize={'30px'}
              color={textColor}
              fontWeight="800"
              mb="10px"
            >
              <MdOutlineAssessment size="1em" />
              <Text
                fontSize="md"
                fontWeight={'700'}
                mr={2}

              >
                {language === 'DE' ? 'Ergebnisse' : 'Results'}
              </Text>
            </Flex>
            <Text
              fontSize={'16px'}
              color="gray.500"
              fontWeight="500"
              ml={2}
            >
              {language === 'DE' ? 'Erreichte Punktzahl:' : 'Achieved Score:'} {grandTotalPoints}/{grandTotalAchievablePoints} {language === 'DE' ? 'Punkte' : 'Points'}
            </Text>
          </Flex>
        </Card>


        <Tabs isFitted variant="enclosed">
          <Flex justify="center" align="center">
            <Button onClick={scrollLeft} marginRight="10px" bg={bgColor} boxShadow="base">
              <ChevronLeftIcon />
            </Button>
            <Tooltip label={language === 'DE' ? 'Nutze dein Pfeiltasten oder die Button zum navigieren' : 'Use your arrow keys or the buttons to navigate'} placement="top" hasArrow>
              <TabList ref={tabListRef} overflowY="hidden" overflowX="hidden" bg={bgColor} boxShadow="base" mb="5px" borderRadius={"5px"}>

                {/*  // -------------- Custom Tab 2 -------------- */}

                <Tab
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="500"
                  sx={{
                    _selected: {
                      color: '#3556CB',
                      borderColor: 'inherit',
                    }
                  }}>Komplette Korrektur</Tab>

                {/*  // -------------- Dynmaische Aufgaben -------------- */}

                {excelData.map((item, index) => (
                  <Tab
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="500"
                    sx={{
                      _selected: {
                        color: '#3556CB',
                        borderColor: 'inherit',
                      }
                    }}
                    key={index}>{item.exercise_id}</Tab>
                ))}
              </TabList>
            </Tooltip>
            <Button onClick={scrollRight} marginLeft="10px" bg={bgColor} boxShadow="base">
              <ChevronRightIcon />
            </Button>
          </Flex>
          <TabPanels>

            {/*  // -------------- Tab 2 - Volle Tabelle -------------- */}

            <TabPanel>
              <Card overflowX="auto">
                <ChakraTable
                  variant="simple"
                >
                  <Thead>
                    <Tr>
                      <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Aufgabe</Th>
                      <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Aufgabenstellung</Th>
                      <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Deine Lösung</Th>
                      <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"} >Punkte</Th>
                      <Th borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Dein Feedback</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {excelData.map((item, index) => (
                      <Tr
                        key={index}
                      >
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" borderColor="gray.200" background={bgColor} fontSize={{ base: "sm", md: "md" }}>{item.exercise_id}</Td>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.exercise_text}</Td>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.solution_student}</Td>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }} >{item.points_achieved}/{item.points_achievable}</Td>
                        <Td py={4} px={5} verticalAlign="top" className="td-hover" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}><ReactMarkdown>{item.feedback}</ReactMarkdown></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </ChakraTable>
              </Card>
            </TabPanel>

            {/*  // -------------- Tab 3-... - Einzelne aufgaben -------------- */}

            {excelData.map((item, index) => (
              <TabPanel key={index}>
                <Card overflowX="auto">
                  <ChakraTable
                    variant="simple"
                  >
                    <Thead>
                      <Tr>
                        <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Aufgabenstellung</Th>
                        <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Deine Lösung</Th>
                        <Th borderRight="1px" borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>Punkte</Th>
                        <Th borderColor="gray.200" color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={"center"} >Dein Feedback</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.exercise_text}</Td>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.solution_student}</Td>
                        <Td py={4} px={3} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.points_achieved}/{item.points_achievable}</Td>
                        <Td py={4} px={5} verticalAlign="top" className="td-hover" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}><ReactMarkdown>{item.feedback}</ReactMarkdown></Td>
                      </Tr>
                    </Tbody>
                  </ChakraTable>
                </Card>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}