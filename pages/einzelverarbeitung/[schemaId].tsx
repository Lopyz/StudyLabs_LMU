/*eslint-disable*/
import Card from '@/components/card/Card';
import { Einzelverarbeitung, OpenAIModel, TaskType, ExcelDataType } from '@/types/types';
import { Button, Flex, Text, Textarea, useColorModeValue, useToast, Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, Icon, IconButton, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, useBoolean, List, ListItem, FormLabel, Select } from '@chakra-ui/react';
import { ChevronLeftIcon, CopyIcon, ChevronRightIcon, WarningIcon, InfoOutlineIcon, ArrowForwardIcon, ArrowBackIcon, DownloadIcon, CloseIcon, CheckCircleIcon, AttachmentIcon } from '@chakra-ui/icons';
import { MdOutlineAssessment } from 'react-icons/md';
import { BiSelectMultiple } from 'react-icons/bi';
import { IoChatbubblesOutline } from "react-icons/io5";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useClerk } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';

import { useLanguage } from '../../src/contexts/LanguageContext';
import { useUser } from '@/contexts/userContext';
import { useGetSchema } from '@/hooks/useGetSchema';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import CardSkeleton from '@/components/card/CardSkeleton';

import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import ProgressBar from '@/components/ProgressBar';
import Chat from '@/components/chat';
import { useDropzone } from 'react-dropzone';
import copy from 'copy-to-clipboard';

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useClerk();
  const clerkId = user?.id;
  const username = user?.username;
  const toast = useToast();

  const [solution_student, setsolution_student] = useState<string[]>([]);
  const [output, setoutput] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo-16k');
  const [loading, setLoading] = useState<boolean>(false);
  const { setRefetchUser } = useUser();
  const { schemaId } = router.query;
  const saveSchemaID: string = Array.isArray(schemaId) ? schemaId[0] : schemaId || '';
  const [uuid, setUuid] = useState<string>('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [excelData, setExcelData] = useState<ExcelDataType[]>([]);
  const [originId, setOriginId] = useState<string>('');
  const [filename, setFilename] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [name, setName] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);
  const [showChatBox, setShowChatBox] = useBoolean(false);
  const [showUploadBox, setShowUploadBox] = useBoolean(false);
  const [activeChatTabIndex, setActiveChatTabIndex] = useState(0);
  const [prevIsTranslating, setPrevIsTranslating] = useState(isTranslating);
  const [timerToastActive1, setTimerToastActive1] = useState<boolean>(false);
  const [timerToastActive2, setTimerToastActive2] = useState<boolean>(false);
  let timerToastId1: NodeJS.Timeout;
  let timerToastId2: NodeJS.Timeout;


  // -------------- Farben --------------

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'navy.700');
  const hoverButton = useColorModeValue({ bg: 'gray.100' }, { bg: 'whiteAlpha.100' });

  // -------------- Colours für Tabelle --------------

  const colorStopsLight = [{ offset: 0, color: '#3556CB', opacity: 0.9 }, { offset: 100, color: '#A3C2FA', opacity: 0.9 }];
  const colorStopsDark = [{ offset: 0, color: '#2D455C', opacity: 0.9 }, { offset: 100, color: '#3556CB', opacity: 0.9 }];
  const colorStops = useColorModeValue(colorStopsLight, colorStopsDark);
  const defaultOpacity = 0;
  const white = '#FFFFFF';
  const lightGreen = '#00E396';
  const blue = '#3556CB';
  const baseGradient = (color: string, opacity: number) => [{ offset: 0, color, opacity: 1, }, { offset: 100, color, opacity, },];


  // -------------- Data Fetch --------------

  const { data, isLoading } = useGetSchema();

  useEffect(() => {
    if (data && data.name) {
      setName(data.name);
    }
  }, [data]);

  // -------------- Timer 60Sek 120sek --------------

  useEffect(() => {
    if (isTranslating && !timerToastActive1) {
      timerToastId1 = setTimeout(() => {
        toast({
          title: language === 'DE' ? "Bitte warten, hohe Auslastung." : "Please wait, high capacity utilisation.",
          position: 'top',
          status: 'info',
          isClosable: true,
        });
        setTimerToastActive1(true);
      }, 60000);
    }

    if (isTranslating && !timerToastActive2) {
      timerToastId2 = setTimeout(() => {
        toast({
          title: language === 'DE' ? "Falls die Anfrage noch länger als eine Minute dauert, bitte Seite neu laden und erneut versuchen." : "If the request takes longer than a minute, please reload the page and try again.",
          position: 'top',
          status: 'info',
          duration: 10000,
          isClosable: true,
        });
        setTimerToastActive2(true);
      }, 120000);
    }

    if (!isTranslating && (timerToastActive1 || timerToastActive2)) {
      setTimerToastActive1(false);
      setTimerToastActive2(false);
    }

    return () => {
      clearTimeout(timerToastId1);
      clearTimeout(timerToastId2);
    };
  }, [isTranslating]);


  // -------------- Main API Handler --------------

  const handleTranslate = async () => {

    console.log(`Using Model: ${model}`);
    setIsTranslating(true);
    setLoading(true);
    setoutput('');

    const controller = new AbortController();
    const body: Einzelverarbeitung = {
      solution_student,
      model,
      clerkId,
      schemaId: schemaId as string,
      //@ts-ignore
      username,
      schemaName: name,
    };

    // -------------- Fetch --------------

    const response = await fetch('/api/einzelverarbeitungAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body), // Der Body enthält jetzt die Clerk ID
    });

    if (!response.ok) {
      setLoading(false);
      if (response.status === 403) {
        toast({
          title: language === 'DE' ? "Du hast leider keine Anfragen mehr" : "You have no more requests left",
          position: 'top',
          status: 'error',
          isClosable: true,
        });
        router.replace(router.asPath);
        return; // Frühzeitiger Abbruch, damit der !data Fehler nicht ausgelöst wird
      } else {
        toast({
          title: language === 'DE' ? "Irgendwas ist schief gelaufen" : "Something went wrong",
          position: 'top',
          status: 'error',
          isClosable: true,
        });
        return;
      }
    }

    if (!data) {
      setLoading(false);
      toast({
        title: language === 'DE' ? "Irgendwas ist schief gelaufen" : "Something went wrong",
        position: 'top',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    setoutput(data);
    setIsTranslating(false);
    setLoading(false);
    setRefetchUser(prevState => !prevState);
  };

  // -------------- Excel Daten Fetchen --------------

  const getExcelData = async (): Promise<ExcelDataType[]> => {
    const res = await fetch(`/api/db/data/getRawExcelData?clerkId=${clerkId}&tasks=${selectedTasks.join(',')}`);
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const { data, filename: receivedFilename, id: receivedOriginId } = await res.json();

    setFilename(receivedFilename);
    setOriginId(receivedOriginId);
    return data;
  };

  useEffect(() => {
    if (output) {
      getExcelData().then(data => {
        setExcelData(data);
        setLoading(false);
      })
        .catch(err => {
          console.error('Error fetching excel data:', err);
        });
    }
  }, [output]);

  const [totalAchievedPoints, setTotalAchievedPoints] = useState(0);

  useEffect(() => {
    let totalPoints = 0;
    excelData.forEach(item => {
      totalPoints += Number(item.points_achieved);
    });
    setTotalAchievedPoints(totalPoints);
  }, [excelData]);

  // -------------- Input Value Handler --------------

  const [isTextareaEmpty, setIsTextareaEmpty] = useState(true);
  const [isFilled, setIsFilled] = useState<boolean[]>(new Array(exercises.length).fill(false));


  const handleChange = (event: any, index: number) => {
    if (!selectedTasks.includes(index)) return;

    const updatedSolutions = [...solution_student];
    updatedSolutions[index] = event.target.value;
    setsolution_student(updatedSolutions);

    const updatedIsFilled = [...isFilled];
    updatedIsFilled[index] = !!event.target.value.trim();
    setIsFilled(updatedIsFilled);
  };

  const [areAllSelectedFilled, setAreAllSelectedFilled] = useState(false);

  useEffect(() => {
    setAreAllSelectedFilled(selectedTasks.every((index) => isFilled[index]));
  }, [isFilled, selectedTasks]);


  // -------------- Grid Selection --------------

  const toggleSelection = (index: number) => {
    const newSelectedTasks = [...selectedTasks];
    const taskIndex = newSelectedTasks.indexOf(index);

    if (taskIndex !== -1) {
      newSelectedTasks.splice(taskIndex, 1);

      const updatedSolutions = [...solution_student];
      updatedSolutions.splice(index, 1);
      setsolution_student(updatedSolutions);

      const updatedIsFilled = [...isFilled];
      updatedIsFilled.splice(index, 1);
      setIsFilled(updatedIsFilled);

      setIsTextareaEmpty(true);  // setzt isTextareaEmpty auf wahrend
    } else {
      newSelectedTasks.push(index);
      newSelectedTasks.sort((a, b) => a - b);
    }

    setSelectedTasks(newSelectedTasks);
  };

  // -------------- Grid select all--------------

  const toggleSelectAllTasks = () => {
    if (selectedTasks.length === data?.data.length) {
      setSelectedTasks([]);
    } else {
      const allTaskIndexes = data?.data.map((_: any, index: any) => index);
      setSelectedTasks(allTaskIndexes);
    }
  };
  // -------------- Tab Routing --------------

  const goToNextTab = () => {
    setTabIndex((prevIndex) => prevIndex + 1);
  };
  const goToPreviousTab = () => {
    setTabIndex((prevIndex) => prevIndex - 1);
  };
  const resetTabs = () => {
    setTabIndex((prevIndex) => prevIndex - 2);
    router.replace(router.asPath);
  };

  // -------------- Total Points Calculation --------------

  const calculateTotalPoints = () => {
    let totalPoints = 0;
    selectedTasks.forEach(index => {
      totalPoints += data.data[index].points_achievable;
    });
    return totalPoints;
  };

  // -------------- Chat Context --------------

  const [chatContext, setChatContext] = useState({
    exercise_id: '',
    exercise_text: '',
    solution_student: '',
    feedback: '',
    solution_correct: '',
    points_achieved: 0,
    points_achievable: 0,
  });

  // -------------- Chat Prompt --------------

  const handleChatPrompt = (row: ExcelDataType) => {
    setChatContext({
      exercise_text: row.exercise_text,
      solution_student: row.solution_student,
      feedback: row.feedback,
      solution_correct: row.solution_correct,
      points_achieved: row.points_achieved,
      points_achievable: row.points_achievable,
      exercise_id: row.exercise_id
    });
    setUuid(uuidv4());
  };

  // -------------- Scrolling für die Tabs in Window 3 --------------

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

  // -------------- Chat Button Animation nach 5 Sekkunden--------------

  useEffect(() => {
    if (prevIsTranslating && !isTranslating) {
      const timer = setTimeout(() => {
        setShowChatButton(true);

        // Entfernter innerer setTimeout, der den Button ausblendet

      }, 3000);

      return () => clearTimeout(timer);
    }
    setPrevIsTranslating(isTranslating);
  }, [isTranslating]);


  // -------------- Chat Button Hover Effekte--------------

  const textVariants = {
    hidden: {
      width: 0,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
    visible: {
      width: 'auto',
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  // -------------- Texte für die Ausgabe --------------

  const [hasConfettiBeenLaunched, setHasConfettiBeenLaunched] = useState(false);

  const launchConfetti = () => {
    if (!hasConfettiBeenLaunched) {
      confetti({
        particleCount: 100,
        spread: 500,
        origin: { y: 0.56, x: 0.56 },
        zIndex: 1000
      });
      setHasConfettiBeenLaunched(true); // Setze den Status auf true, nachdem die Animation gestartet wurde
    }
  };


  const getProgressText = (percentageAchieved: number) => {
    const roundedPercentage = Math.round(percentageAchieved);
    switch (true) {
      case (roundedPercentage >= 100):
        launchConfetti();
        return "Perfekt! Du hast alle Aufgaben mit 100% korrekt gelöst. Deine Vorbereitung und dein Verständnis sind beeindruckend.";
      case (roundedPercentage >= 90):
        launchConfetti();
        return "Ausgezeichnet! Du hast " + roundedPercentage + "% der Aufgaben richtig. Du bist sehr gut vorbereitet.";
      case (roundedPercentage >= 80):
        launchConfetti();
        return "Sehr gut! Mit " + roundedPercentage + "% hast du den Großteil der Aufgaben korrekt gelöst. Fast perfekt!";
      case (roundedPercentage >= 70):
        return "Gut gemacht! Du hast " + roundedPercentage + "% erreicht. Dein Verständnis ist stark. Noch ein bisschen Feinschliff!";
      case (roundedPercentage >= 60):
        return "Solide Leistung! Mit " + roundedPercentage + "% hast du mehr als die Hälfte richtig. Bleibe am Ball!";
      case (roundedPercentage >= 50):
        return "Guter Ansatz! Du hast " + roundedPercentage + "%, korrekt. Überprüfe die Fehler und lerne daraus.";
      case (roundedPercentage >= 40):
        return "Ein Anfang! Mit " + roundedPercentage + "% gibt es noch Verbesserungspotenzial. Nutze das Feedback, um zu lernen.";
      case (roundedPercentage >= 30):
        return "Weiter so! Du hast " + roundedPercentage + "% erreicht. Analysiere, wo du noch lernen kannst.";
      case (roundedPercentage >= 20):
        return "Erste Schritte! Mit " + roundedPercentage + "% bist du gestartet. Schau dir die Lösungen genau an, um zu verbessern.";
      case (roundedPercentage >= 10):
        return "Angefangen! Du hast " + roundedPercentage + "% erreicht. Nutze dies als Lernchance, um dich zu steigern.";
      default:
        return "Beginn deiner Reise! Auch mit " + roundedPercentage + "%, ist jeder Schritt ein Lernfortschritt. Gib nicht auf!";
    }
  };

  // -------------- Donut Chart Data --------------

  const totalPoints = calculateTotalPoints();
  const percentageAchieved = totalPoints > 0 ? (totalAchievedPoints / totalPoints) * 100 : 0;
  const DonutChartData = [percentageAchieved, 100 - percentageAchieved];

  // -------------- Donut Chart Styling --------------

  const DonutChartOptions = {
    labels: ['Erreichte Punkte', 'Verbleibende Punkte'],
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1750,
        animateGradually: {
          enabled: true,
          delay: 650,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 1250,
        },
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              formatter: () => `${Math.round(percentageAchieved)}%`,
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.3,
        opacityTo: 0.9,
        colorStops: [
          baseGradient(lightGreen, 0.8),
          baseGradient(blue, 0.8),
        ],
      },
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  // -------------- Bar Chart Data --------------

  const FeedbackBarChartData = [
    {
      name: 'Maximale Punkte',
      data: excelData.map((item: { points_achievable: any; }) => item.points_achievable),
    },
    {
      name: 'Erreichte Punkte',
      data: excelData.map((item: { points_achieved: any; }) => item.points_achieved),
    },
  ];

  // -------------- Bar Chart Styling --------------

  const FeedbackBarChartOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1650,
        animateGradually: {
          enabled: true,
          delay: 625,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 1250,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '50%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      categories: excelData.map(item => `${item.exercise_id}`),
      title: {
        text: 'Aufgabe-ID',
        style: {
          fontWeight: 'bold',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Punkte',
        style: {
          colors: '#2D455C',
          fontWeight: 'bold',
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: any) => `${val} Punkte`,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.3,
        opacityTo: 0.9,
        colorStops: [
          baseGradient('#3556CB', defaultOpacity),
          baseGradient(lightGreen, 0.2),
        ],
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  const SolutionCard = ({ label, content }: { label: string, content: string }) => {
    const handleCopy = () => {
      copy(content);
    };

    return (
      <Card borderWidth="1px" p={4} mb={4} whiteSpace="pre-wrap" textAlign={'left'}>
        <Box overflow="auto" fontSize="sm">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="4" fontSize={'md'}>
            <Box flex="1" textAlign="center">
              <Text fontWeight='bold'>{language === 'DE' ? 'Aufgabe' : 'Task'} {label}</Text>
            </Box>
            <Button colorScheme="green" onClick={handleCopy}><CopyIcon /></Button>
          </Box>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Card>
    );
  };


  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solutions, setSolutions] = useState<SolutionWithLabel[]>([]);

  type SolutionWithLabel = {
    label: string;
    content: string;
  };

  // Function to extract solutions from HTML content
  const extractSolutionsFromRmd = (rmdContent: string) => {
    console.log('Parsing RMD content to extract solutions...');
    const extractedSolutions: SolutionWithLabel[] = [];

    // Split the content by lines and iterate through them
    const lines = rmdContent.split(/\r?\n/);
    let isSolution = false;
    let isTask = false;
    let currentSolution: SolutionWithLabel = { label: "", content: "" };

    lines.forEach((line) => {
      if (line.startsWith('### Lösung')) {
        // Start of a solution
        isSolution = true;
        isTask = false;
      } else if (isTask && line.trim() === "") {
        // Empty line after task label, stop recording task
        isTask = false;
      } else if (line.startsWith('##')) {
        // Possible start of task or end of solution (e.g., "## a)")
        if (isSolution) {
          // End of a solution
          isSolution = false;
          extractedSolutions.push(currentSolution);
          currentSolution = { label: "", content: "" };
        }
        // Check if this line represents a task
        const taskMatch = line.match(/^##\s([a-z])\)/i);
        if (taskMatch) {
          isTask = true;
          currentSolution.label = taskMatch[1]; // Store the task label
        }
      } else if (isSolution) {
        // Inside a solution block
        currentSolution.content += (currentSolution.content === "" ? "" : "\n") + line;
      }
    });

    // Check if the last solution was not added (EOF case)
    if (isSolution && currentSolution.content !== "") {
      extractedSolutions.push(currentSolution);
    }

    console.log('Extracted Solutions:', extractedSolutions);
    setSolutions(extractedSolutions.map(s => ({ label: s.label, content: s.content })));
  };

  // Function to handle file drop event
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Dropped files:', acceptedFiles);
    const file = acceptedFiles[0];
    if (file) {
      console.log(`Processing file: ${file.name}`);
      setUploadedFile(file);
      file.text().then(extractSolutionsFromRmd)
        .catch(err => console.error('Error reading file text:', err));
    }
  }, []);

  const removeFile = () => {
    setUploadedFile(null); // Reset the uploaded file state
    setSolutions([]); // Reset the solutions state
  };


  // Setup for react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.Rmd', '.rmd'] },
  });

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      mt={{ base: '100px', md: '0px', xl: '0px' }}
    >
      <Flex
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        maxW="100%"
        justify="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Tabs
          variant='soft-rounded'
          align='center'
          minW="100%"
          maxW="100%"
          index={tabIndex}
          onChange={setTabIndex}
        >
          <TabPanels>

            {/*  // -------------- Window 1 - Select Tasks -------------- */}

            <TabPanel
              minH="80vH"
              maxW="716px"
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
                    fontWeight={'700'}
                    mb="5px"
                  >
                    {language === 'DE' ? `Wähle deine Aufgaben aus (${selectedTasks.length} ausgewählt)` : `Choose your tasks (${selectedTasks.length} selected)`}
                  </Text>
                  <Flex
                    align="center"
                  >
                    <Text
                      fontSize="md"
                      fontWeight={'700'}
                      mr={2}
                    >
                      {language === 'DE' ? `Maximal erreichbare Punktzahl: ${calculateTotalPoints()}` : `Total achievable Points ${calculateTotalPoints()}`}
                    </Text>
                    <Tooltip
                      placement="top"
                      label={language === 'DE' ? 'Mit der aktuellen Auswahl kannst du diese Punktzahl maximal erreichen.' : 'With the current selection, you can achieve this score at most.'}
                    >
                      <InfoOutlineIcon
                        cursor="pointer"
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
                <Text
                  fontSize="md"
                  color="gray.500"
                  fontWeight="500"
                >
                  {(language === 'DE' ? 'Wähle zunächst die Aufgaben aus, die du bearbeiten möchtest.' : 'First, select the tasks you would like to edit.')}
                </Text>
              </Card>
              <Tooltip
                placement="top"
                label={language === 'DE' ? 'Alle Aufgaben auswählen' : 'Select all task'}
              >
                <Button
                  alignSelf="center"
                  h="44px"
                  bg={bgColor}
                  borderColor={`${borderColor} !important`}
                  borderRadius="15px"
                  border="1px solid"
                  _hover={hoverButton}
                  onClick={toggleSelectAllTasks}
                >
                  {language === 'DE' ? 'Alle Aufgaben auswählen' : 'Select all'}
                  <Icon
                    color={textColor}
                    as={BiSelectMultiple}
                    ml="5px"
                  />
                </Button>
              </Tooltip>
              <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(4, 1fr)" }}
                gap={4}
                mt="20px"
                mb="40px"
              >
                {isLoading ? (
                  Array.from({ length: 12 }, (_, index) => <CardSkeleton key={`skeleton-${index}`} />)
                ) : (
                  Array.isArray(data?.data) && data.data.map((task: TaskType, index: number) => (
                    <Tooltip
                      placement="top"
                      key={`tooltip-${index}`}
                      whiteSpace="pre-wrap"
                      label={task.exercise_text}
                      shouldWrapChildren
                    >
                      <Card
                        key={`card-${index}`}
                        border={selectedTasks.includes(index) ? '2px solid #38A169' : 'none'} // Hier ändern Sie den Rahmen
                        w="100%"
                        h={{ base: "65px", md: "75px", lg: "100px" }}
                        p={4}
                        fontSize={{ base: "xs", md: "sm", lg: "md" }}
                        _hover={{
                          transform: 'scale(1.05)',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleSelection(index)}
                      >
                        <Text
                          textAlign="center"
                          fontWeight="bold"
                        >
                          {task.exercise_id}
                        </Text>
                        <Flex
                          align="center"
                          mt="2px"
                          justifyContent="center"
                        >
                          <Icon
                            w="15px"
                            h="15px"
                            me="5px"
                            as={MdOutlineAssessment}
                          />
                          <Text
                            isTruncated
                            textAlign="center"
                          >
                            {task.points_achievable} {language === 'DE' ? 'Punkte' : 'Points'}
                          </Text>
                        </Flex>
                      </Card>
                    </Tooltip>
                  ))
                )}
              </Grid>
              <Flex
                maxW="716px"
              >
                <Box
                  flexGrow={1}
                  display="flex"
                  marginLeft="auto"
                >
                  <Tooltip
                    label={
                      selectedTasks.length === 0
                        ? language === 'DE'
                          ? 'Bitte wähle mindestens eine Aufgabe aus'
                          : 'Please select at least one task'
                        : language === 'DE'
                          ? 'Zum nächsten Schritt'
                          : 'Go to next step'
                    }
                    placement="top"
                  >
                    <IconButton
                      aria-label={language === 'DE' ? 'Weiter' : 'Continue'}
                      icon={<ArrowForwardIcon />}
                      onClick={goToNextTab}
                      isDisabled={selectedTasks.length === 0}
                      ml="auto"
                      size="lg"
                      maxW="max-content"
                      fontSize="2xl"
                      variant="primary"
                      borderRadius="full"
                      w={{ base: 'auto', sm: '100%' }}
                    />
                  </Tooltip>
                </Box>
              </Flex>
            </TabPanel>

            {/*  // -------------- Window 2 - Enter Solution -------------- */}

            <TabPanel
              minH="80vH"
              maxW="716px"
            >
              <Card
                w="100%"
                mb="20px"
              >
                <Flex
                  align="center"
                  direction="column"
                  mb="10px"
                >
                  <Text
                    fontSize="xl"
                    fontWeight={'700'}
                    mb="5px"
                  >
                    {(language === 'DE' ? 'Lösungseingabe' : 'Submit Your Solution')}
                  </Text>
                  <Flex
                    align="center"
                  >
                    <Text
                      fontSize="md"
                      fontWeight={'700'}
                      mr={2}
                    >
                      {language === 'DE' ? `Maximal erreichbare Punktzahl: ${calculateTotalPoints()}` : `Total achievable Points ${calculateTotalPoints()}`}
                    </Text>
                    <Tooltip
                      placement="top"
                      label={language === 'DE' ? 'Mit der aktuellen Auswahl kannst du diese Punktzahl maximal erreichen.' : 'With the current selection, you can achieve this score at most.'}
                    >
                      <InfoOutlineIcon
                        cursor="pointer"
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
                <Flex
                  align="center"
                  alignSelf={"center"}
                >
                  <Text
                    fontSize="md"
                    color="gray.500"
                    fontWeight="500"
                    mr={2}
                  >
                    {(language === 'DE' ? 'Trage nun die Lösungen für die von dir gewählten Aufgaben ein.' : 'Please enter the solutions for the tasks you have selected now.')}
                  </Text>
                  <Tooltip
                    placement="top"
                    label={language === 'DE' ? 'Klicke auf die einzelnen Aufgaben um diese zu bearbeiten. Sobald du eine Aufgabe bearbeitet hast, wird diese grün umrahmt.' : 'Click on a Task to start with your correction. One you have written your solution, the task will appear with a green outline.'}
                  >
                    <InfoOutlineIcon
                      cursor="pointer"
                    />
                  </Tooltip>
                </Flex>
              </Card>
              {/* <FormLabel
                display="flex"
                ms="10px"
                htmlFor={'model'}
                fontSize="md"
                color={textColor}
                letterSpacing="0px"
                fontWeight="bold"
                _hover={{ cursor: 'pointer' }}
              >
                OpenAI Model
              </FormLabel>
              <Select
                border="1px solid"
                borderRadius={'10px'}
                borderColor={borderColor}
                bg={bgColor}
                h="40px"
                id="model"
                value={model}
                _focus={{ borderColor: 'none' }}
                mb="28px"
                fontSize={"m"}
                onChange={(e) => setModel(e.target.value as OpenAIModel)}
              >
                <option value={'gpt-3.5-turbo-16k'}>GPT-3.5</option>
                <option value={'gpt-4'}>GPT-4</option>
              </Select> */}
              <Box
                fontWeight="bold"
                textAlign="center"
                fontSize="xl"
              >
                {language === 'DE' ? 'Aufgabenstellung' : 'Task Description'}
              </Box>
              <Accordion
                allowToggle
                mb="40px"
              >
                {Array.isArray(data?.data) && Array.from(selectedTasks).map((index: number) => {
                  const taskData = data.data[index];
                  return (
                    <Card
                      mt="20px"
                      p="0"
                      border={"1px"}
                      borderColor={borderColor}
                      key={index}
                    >
                      <AccordionItem
                        borderRadius="15px"
                        borderColor="transparent"
                        boxShadow={isFilled[index] ? "0px 0px 0px 2px #38A169" : "base"}
                        _hover={{ bg: bgColor }}
                      >
                        <AccordionButton
                          py="5"
                          px="4"
                          _hover={{}}
                        >
                          <Grid
                            gap={6}
                            width="100%"
                            alignItems="center"
                          >
                            <Box
                              textAlign="center"
                              fontWeight="bold"
                              fontSize={['sm', 'md']}
                              color={textColor}
                            >
                              {taskData.exercise_id}
                              <Box
                                alignItems="center"
                                fontSize={['sm', 'md']}
                                color={textColor}
                                fontWeight={'normal'}
                              >
                                <Icon w="15px"
                                  h="15px"
                                  me="4px"
                                  as={MdOutlineAssessment}
                                />
                                {taskData.points_achievable}{' '}
                                {language === 'DE' ? 'Punkte' : 'Points'}
                              </Box>
                            </Box>
                            <Box
                              borderColor={`${borderColor} !important`}
                              px={{ base: '2', md: '6' }}
                              display="flex"
                              alignItems="center"
                            >
                              <Box
                                textAlign="left"
                                wordBreak="break-word"
                                fontSize={['sm', 'md']}
                                whiteSpace="pre-wrap"
                              >
                                {taskData.exercise_text}
                              </Box>
                            </Box>
                          </Grid>
                          <Tooltip
                            label={isFilled[index] ? language === 'DE' ? 'Aufgabe ausgefüllt' : 'Task filled' : language === 'DE' ? 'Aufgabe noch nicht ausgefüllt' : 'Task not filled'}
                          >
                            <Icon
                              as={isFilled[index] ? CheckCircleIcon : WarningIcon}
                              w={5}
                              h={5}
                            />
                          </Tooltip>

                        </AccordionButton>
                        <AccordionPanel
                          py="5"
                          px="4"
                          _hover={{}}
                          borderColor={`${borderColor} !important`}
                        >
                          <Grid
                            gap={6}
                            alignItems="center"
                          >
                            <Box
                              textAlign={{ base: 'center', md: 'center' }}
                              fontWeight="bold"
                              fontSize={['sm', 'md']}
                              color={textColor}

                            >
                              {language === 'DE' ? 'Deine Lösung' : 'Your Solution'}
                              <Box
                                alignItems="center"
                                fontSize={['sm', 'sm']}
                                color={textColor}
                                fontWeight={'normal'}
                                wordBreak="break-all"
                              >
                                {language === 'DE' ? 'Gib hier deine Lösung ein' : 'Enter your solution here'}
                              </Box>
                            </Box>
                            <Box
                              borderColor={`${borderColor} !important`}
                              px={{ base: '2', md: '6', }}
                              display="flex"
                              alignItems="center"
                            >
                              <Textarea
                                id={`answer-${index}`}
                                placeholder={language === 'DE' ? 'Gib hier deine gesamte Lösung ein (z.B. Text, Code, Output)' : 'Enter your entire solution here (e.g. text, code, output)'}
                                resize="vertical"
                                borderRadius="15px"
                                p={['3', '4']}
                                minH="160px"
                                fontSize={['sm', 'md']}
                                color={textColor}
                                borderColor={borderColor}
                                width="100%"
                                _focus={{ boxShadow: 'outline' }}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Box>
                          </Grid>
                        </AccordionPanel>
                      </AccordionItem>
                    </Card>
                  );
                })}
              </Accordion>
              <Flex>
                <Box
                  flexGrow={1}
                  display="flex"
                  flexDirection={{ base: 'column', sm: 'row' }}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Tooltip
                    placement="top"
                    label={language === 'DE' ? 'Zurück zum letzten Schritt' : 'Back to the last step'}
                  >
                    <IconButton
                      aria-label={language === 'DE' ? 'Zurück' : 'Back'}
                      icon={<ArrowBackIcon />}
                      onClick={goToPreviousTab}
                      mr="auto"
                      maxW="max-content"
                      size="lg"
                      fontSize="2xl"
                      variant="primary"
                      borderRadius="full"
                      w={{ base: 'auto', sm: '100%' }}
                      _hover={{
                        boxShadow: '0px 21px 27px -10px rgba(128, 156, 226, 0.48) !important',
                        bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%) !important',
                        _disabled: {
                          bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%)',
                        },
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    label={
                      isTextareaEmpty
                        ? language === 'DE'
                          ? 'Bitte fülle alle deine ausgewählten Aufgaben aus.'
                          : 'Please fill out all your selected tasks.'
                        : language === 'DE'
                          ? 'Beginne mit der Korrektur deiner Aufgaben'
                          : 'Start correcting your tasks'
                    }
                    placement="top"
                  >
                    <Button
                      py="20px"
                      px="16px"
                      fontSize="md"
                      color="white"
                      variant="primary"
                      borderRadius="45px"
                      mt={{ base: '20px', sm: '0px' }}
                      maxW="max-content"
                      size="lg"
                      onClick={() => {
                        handleTranslate();
                        goToNextTab();
                      }}
                      isLoading={loading ? true : false}
                      isDisabled={!areAllSelectedFilled}
                      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.2)"
                    >
                      {language === 'DE' ? 'Aufgaben jetzt korrigiern' : 'Start correction now'}
                    </Button>
                  </Tooltip>
                </Box>
              </Flex>
              <Box
                zIndex="9999"
                position="fixed"
                bottom={{ base: '30px', md: '50px' }}
                right="20px"

              >
                <Tooltip
                  label={language === 'DE' ? 'Lade eine RMD-Datei hoch, um deine Lösungen zu extrahieren' : 'Upload a RMD file to extract your solutions'}
                  fontSize="md"
                  right="20px"
                  hasArrow
                >
                  <div>
                    <Button
                      maxW="400px"
                      fontSize="md"
                      colorScheme='green'
                      borderRadius="45px"
                      size="lg"
                      onClick={setShowUploadBox.toggle} // Wechselt den Zustand bei jedem Klick
                    >
                      <AttachmentIcon />
                      <motion.span
                        variants={textVariants}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >
                      </motion.span>
                    </Button>
                  </div>
                </Tooltip>
              </Box>
              {/*  // -------------- Upload-Box -------------- */}
              <Card
                position="fixed"
                bottom={{ base: '50px', md: '120px' }}
                right={{ base: '0px', md: '30px' }}
                boxShadow="2xl"
                maxW="358px"
                w="auto"
                maxH="537px"
                h="auto"
                zIndex={9999}
                display={showUploadBox ? 'block' : 'none'}
                overflowY="scroll"
              >
                <Box position="relative">
                  <IconButton
                    aria-label="Close"
                    icon={<CloseIcon />}
                    size="sm"
                    position="absolute"
                    right="-20px"
                    top="-35px"
                    onClick={setShowUploadBox.toggle}
                    zIndex={9999}
                  />
                  <Box mt="20px" {...getRootProps()} style={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '10px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    {isDragActive ?
                      <Text>{language === 'DE' ? 'Datei hier ablegen...' : 'Place file here'}</Text> :
                      uploadedFile ?
                        <Box>
                          <Text>
                            {language === 'DE' ? 'Datei' : 'File'} "{uploadedFile.name}" {language === 'DE' ? 'hinzugefügt' : 'added'}
                          </Text>
                          <Button onClick={removeFile}>{language === 'DE' ? 'Datei entfernen' : 'Remove File'}</Button>
                        </Box> :
                        <Text>{language === 'DE' ? 'Datei hierher ziehen oder klicken zum Hochladen' : 'Drag file here or click to upload'}</Text>
                    }
                  </Box>
                </Box>
                <Box mt="8">
                  {solutions.map((solution, index) => (
                    <SolutionCard key={index} label={solution.label} content={solution.content} />
                  ))}
                </Box>

              </Card>
            </TabPanel>
            {/*  // -------------- Window 3 - Correction -------------- */}

            <TabPanel
              minH="80vH"
            >
              {output ? (
                <>
                  <Card
                    w="100%"
                    mb="20px"
                    maxW="716px"
                  >
                    <Flex
                      align="center"
                      direction="column"
                      justify="space-between"
                      mb="10px"
                    >
                      <Text
                        fontSize="xl"
                        fontWeight={'700'}
                        mb="5px"
                      >
                        {language === 'DE' ? 'Dein personalisiertes Feedback' : 'Your personalized feedback'}
                      </Text>
                      <Flex
                        align="center"
                      >
                        <MdOutlineAssessment
                          size="1.5em"
                          mr={4}
                        />
                        <Text
                          fontSize="md"
                          fontWeight="700"
                          mr={2}
                        >
                          {language === 'DE' ? `Deine erreichte Punktzahl: ${totalAchievedPoints}/${calculateTotalPoints()}` : `Your achieved score: ${totalAchievedPoints}/${calculateTotalPoints()}`}
                        </Text>
                        <Tooltip
                          placement="top"
                          label={language === 'DE' ? 'Mit der aktuellen Auswahl kannst du diese Punktzahl maximal erreichen.' : 'With the current selection, you can achieve this score at most.'}
                        >
                          <InfoOutlineIcon
                            cursor="pointer"
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                    <Flex
                      align="center"
                      direction="column"
                    >
                      <Text
                        fontSize={'md'}
                        color="gray.500"
                        fontWeight="500"
                      >
                        {language === 'DE' ? 'Hier findest du deine generierte Korrektur und das dazugehörige Feedback. Bei Fragen klicken Sie bitte auf das Chat-Symbol unten rechts.' : 'Here you can find your generated correction and the corresponding feedback. If you have any questions, please click on the chat icon in the bottom right corner.'}
                      </Text>
                    </Flex>
                  </Card>
                  {/*  // -------------- Window 3.1 - Feeback -------------- */}
                  <Box maxW="1432px">
                    <Tabs isFitted variant="enclosed">
                      <Flex justify="center" align="center">
                        <Button onClick={scrollLeft} marginRight="10px" bg={bgColor} boxShadow="base">
                          <ChevronLeftIcon />
                        </Button>
                        <Tooltip label={language === 'DE' ? 'Nutze dein Pfeiltasten oder die Button zum navigieren' : 'Use your arrow keys or the buttons to navigate'} placement="top" hasArrow>
                          <TabList ref={tabListRef} overflowY="hidden" overflowX="hidden" bg={bgColor} boxShadow="base" mb="5px" borderRadius={"5px"}>

                            {/*  // -------------- Custom Tab 1 -------------- */}

                            <Tab
                              fontSize={{ base: "sm", md: "md" }}
                              fontWeight="500"
                              sx={{
                                _selected: {
                                  color: '#3556CB',
                                  borderColor: 'inherit',
                                }
                              }}>Punktevergabe</Tab>

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

                        {/*  // -------------- Tab 1 - Bar-Chart -------------- */}

                        <TabPanel>
                          <Card>
                            <Text
                              fontSize="xl"
                              fontWeight={'700'}
                              mb="5px"
                            >
                              {language === 'DE' ? 'Deine Analyse' : 'Your evaluation'}
                            </Text>
                            <Flex
                              align="center"
                              direction="column"
                            >
                              <Text fontSize={'md'} color="gray.500" fontWeight="500">
                                {language === 'DE' ? getProgressText(percentageAchieved) : ``}
                              </Text>
                            </Flex>
                            <Box>
                              <DonutChart
                                key={JSON.stringify(DonutChartData)}
                                chartData={DonutChartData}
                                chartOptions={DonutChartOptions}
                              />
                            </Box>
                            <BarChart
                              key={JSON.stringify(FeedbackBarChartData)}
                              chartData={FeedbackBarChartData}
                              chartOptions={FeedbackBarChartOptions}
                            />
                          </Card>
                        </TabPanel>

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
                                    <Td py={4} px={3} borderBottom={index === data.length - 1 ? "none" : "1px"} verticalAlign="top" className="td-hover" borderRight="1px" borderColor="gray.200" background={bgColor} fontSize={{ base: "sm", md: "md" }}>{item.exercise_id}</Td>
                                    <Td py={4} px={3} borderBottom={index === data.length - 1 ? "none" : "1px"} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.exercise_text}</Td>
                                    <Td py={4} px={3} borderBottom={index === data.length - 1 ? "none" : "1px"} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}>{item.solution_student}</Td>
                                    <Td py={4} px={3} borderBottom={index === data.length - 1 ? "none" : "1px"} verticalAlign="top" className="td-hover" borderRight="1px" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }} >{item.points_achieved}/{item.points_achievable}</Td>
                                    <Td py={4} px={5} borderBottom={index === data.length - 1 ? "none" : "1px"} verticalAlign="top" className="td-hover" wordBreak="break-word" borderColor="gray.200" background={bgColor} whiteSpace="pre-wrap" fontSize={{ base: "sm", md: "md" }}><ReactMarkdown>{item.feedback}</ReactMarkdown></Td>
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
                  </Box>

                  {/*  // -------------- Window 3.2 - Buttons -------------- */}

                  <Box
                    flexGrow={1}
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt="40px"
                    maxW="1402px"

                  >
                    <Tooltip
                      label={language === 'DE' ? 'Excel Datei herunterladen' : 'Download Excel File'}
                      hasArrow
                      placement="top"
                    >
                      <IconButton
                        aria-label={language === 'DE' ? 'Excel Datei herunterladen' : 'Download Excel File'}
                        icon={<DownloadIcon />}
                        maxW="max-content"
                        mr="auto"
                        fontSize="md"
                        size="lg"
                        variant="primary"
                        borderRadius="45px"
                        w={{ base: 'auto', sm: '100%' }}
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/db/excel/downloadLatest?clerkId=${clerkId}`);
                            const data = await res.json();
                            // Optional: Überprüfen Sie den Status und das Datenformat
                            const blob = new Blob([new Uint8Array(data.file.excelFile.data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'file.xlsx';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          } catch (error) {
                            console.error('Error downloading the file:', error);
                          }
                        }}
                      />
                    </Tooltip>
                    <Button
                      onClick={resetTabs}
                      maxW="max-content"
                      py="20px"
                      px="16px"
                      fontSize="md"
                      size="lg"
                      variant="primary"
                      borderRadius="45px"
                      w={{ base: 'auto', md: '100%' }}
                      _hover={{
                        boxShadow: '0px 21px 27px -10px rgba(128, 156, 226, 0.48) !important',
                        bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%) !important',
                        _disabled: {
                          bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%)',
                        },
                      }}
                    >
                      {language === 'DE' ? 'Neue Anfrage' : 'New Request'}
                    </Button>
                  </Box>

                  {/*  // -------------- Chat Button -------------- */}

                  <motion.div
                    initial="hidden"
                    animate={showChatButton ? "visible" : "hidden"}
                  >
                    <Box
                      zIndex="9999"
                      position="fixed"
                      bottom={{ base: '30px', md: '50px' }}
                      right="20px"

                    >
                      <Tooltip
                        label="Klicke hier, um den Chat-Bereich zu öffnen und spezifische Fragen zur Aufgabe zu stellen."
                        fontSize="md"
                        right="20px"
                        hasArrow
                      >
                        <div>
                          <Button
                            maxW="400px"
                            fontSize="md"
                            colorScheme='green'
                            borderRadius="45px"
                            size="lg"
                            onClick={setShowChatBox.toggle} // Wechselt den Zustand bei jedem Klick
                          >
                            <IoChatbubblesOutline size="2em" />
                            <motion.span
                              variants={textVariants}
                              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                              <Box ml='4px'>
                                {language === 'DE' ? 'Du benötigst Hilfe?' : 'Need help?'}
                              </Box>
                            </motion.span>
                          </Button>
                        </div>
                      </Tooltip>
                    </Box>
                  </motion.div>
                  {/*  // -------------- Chat-Box -------------- */}
                  <Card
                    position="fixed"
                    bottom={{ base: '50px', md: '120px' }}
                    right={{ base: '0px', md: '30px' }}
                    h="auto"
                    maxH="100%"
                    w="auto"
                    boxShadow="2xl"
                    zIndex={9999}
                    display={showChatBox ? 'block' : 'none'} // Verwenden von CSS zur Anzeigeverwaltung
                    maxW="716px"
                  >
                    <Box position="relative">
                      <IconButton
                        aria-label="Schließen"
                        icon={<CloseIcon />}
                        size="sm"
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={setShowChatBox.toggle}
                        zIndex={9999}
                      />

                      <Tabs index={activeChatTabIndex} onChange={(index) => setActiveChatTabIndex(index)}>
                        <TabList mb="1em">
                          <Tab fontWeight="bold">Aufgabe auswählen</Tab>
                          <Tab fontWeight="bold">Chat</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            <Box mb={2} p={4} >
                              <Text fontSize="md" fontWeight="semibold">
                                Stelle hier spezifische Fragen zur Aufgabe oder erhalte Hilfe zu deiner Lösung. Unser Chatbot hilft dir, deine Aufgaben besser zu verstehen und zu lösen.
                              </Text>
                            </Box>
                            <Box
                              maxH="300px"
                              overflowY="scroll"
                            >
                              <List spacing={2}>
                                {excelData.map((item, index) => (
                                  <ListItem key={index}>
                                    <Button
                                      colorScheme='green'
                                      fontSize={{ base: 'sm', md: 'md' }} // responsive Schriftgröße
                                      height="40px"
                                      justifyContent="center"
                                      textAlign="center"
                                      onClick={() => {
                                        handleChatPrompt(item);
                                        setActiveChatTabIndex(1);
                                      }}
                                    >
                                      {item.exercise_id}
                                    </Button>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </TabPanel>
                          <TabPanel>
                            {/*  // -------------- Chat Bereich -------------- */}
                            <Box textAlign="left">
                              <Chat
                                chatContext={chatContext}
                                uuid={uuid}
                                originId={originId}
                                filename={filename}
                                schemaId={saveSchemaID}
                              />
                            </Box>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
                  </Card>

                </>
              ) : isTranslating ? (
                <ProgressBar />
              ) : (
                null
              )}
            </TabPanel>

            {/*  // -------------- End -------------- */}

          </TabPanels>
          <TabList
            mb="1em"
          >
            <Tab isDisabled>
              <Box
                w="8px"
                h="8px"
                bg="currentColor"
                borderRadius="full"
              />
            </Tab>
            <Tab isDisabled>
              <Box
                w="8px"
                h="8px"
                bg="currentColor"
                borderRadius="full"
              />
            </Tab>
            <Tab isDisabled>
              <Box
                w="8px"
                h="8px"
                bg="currentColor"
                borderRadius="full"
              />
            </Tab>
          </TabList>
        </Tabs>
      </Flex>
    </Flex >
  );
}