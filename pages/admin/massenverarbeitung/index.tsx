/*eslint-disable*/
import Card from '@/components/card/Card';
import { Massenverarbeitung, OpenAIModel } from '@/types/types';
import { Button, Flex, FormLabel, Select, Text, useColorModeValue, useToast, Textarea, Box, Badge, VStack, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import FileFieldMultiple from '@/components/fields/FileFiledMultiple';
import * as XLSX from 'xlsx';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { saveAs } from 'file-saver';

export const getServerSideProps = adminProtectionBackend;

async function downloadFile(file: Blob, filename: string) {
  saveAs(file, filename); // Package 'file-saver' to download file on client's system
}

export default function Home(props: { apiKeyApp: string }) {

  const { language } = useLanguage();
  const [output, setoutput] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo-16k');
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [systemprompt, setSystemprompt] = useState<string>("");
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' }, { color: 'whiteAlpha.600' });
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const toast = useToast();
  // Stelle eine Warteschlange von Dateien bereit und einen Status
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [fileStatus, setFileStatus] = useState<Record<string, string>>({});
  const [exercisesPerFile, setExercisesPerFile] = useState<Record<string, any[]>>({});

  // -------------- File-Field--------------

  const onFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) {
      setExercises([]);
      return;
    }

    // Initialize status for each new file added
    const newFileStatus: Record<string, string> = {};
    selectedFiles.forEach((f) => {
      newFileStatus[f.name] = 'in Bearbeitung';
    });
    setFileStatus((prevStatus) => ({ ...prevStatus, ...newFileStatus }));

    const failedFiles: string[] = [];
    for (let selectedFile of selectedFiles) { // Loop through all selectedFiles
      try {
        await new Promise<void>((resolve, reject) => { // Wrap FileReader logic inside a promise
          const reader = new FileReader();
          reader.onload = (evt) => {
            const bstr = evt.target?.result || '';
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const wsname = workbook.SheetNames[0];
            const ws = workbook.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setExercises(data); // Use setExercises to update the state
            resolve(); // Resolve the promise when file reading is complete
            setExercisesPerFile((prev) => ({
              ...prev,
              [selectedFile.name]: data
            }));
            setFileStatus((prevStatus) => ({ ...prevStatus, [selectedFile.name]: 'hochgeladen' }));
          };
          reader.onerror = (error) => {
            console.error(language === 'DE' ? "Fehler beim Lesen der Datei:" : "Error reading the file:", error);
            reject(error);
          };
          reader.readAsBinaryString(selectedFile);
        });
      } catch (error) {
        // Catch and log any file reading error. 
        console.error(`Failed to read file ${selectedFile.name}`);
        failedFiles.push(selectedFile.name);
      }
    }

    // Continue with next file
    if (failedFiles.length > 0) {
      console.warn(`Some files failed to process: ${failedFiles.join(', ')}`);
      setFileStatus((prevStatus) => ({
        ...prevStatus,
        ...failedFiles.reduce((acc, name) => ({ ...acc, [name]: 'fehlgeschlagen' }), {}),
      }));
    }
    setFileQueue([]); // Clear the fileQueue after processing all the files
  }


  // Aktualisiere den Datei-Status nach der Verarbeitung
  const updateFileStatusAfterProcessing = (fileName: string, status: string) => {
    setFileStatus((prevStatus) => ({ ...prevStatus, [fileName]: status }));
  };

  // -------------- Main API Handler --------------
  const handleTranslate = async () => {

    setLoading(true);
    setoutput('');
    let fileName = file?.name ? file.name : 'massenverarbeitung.xlsx'; // Speichert den Dateinamen
    for (const [fileName, exercises] of Object.entries(exercisesPerFile)) {

      const controller = new AbortController();
      //@ts-ignore
      const body: Massenverarbeitung = {
        systemprompt: systemprompt,
        model: model,
        exercises: exercises // senden der Exercises Daten an das Backend
      };

      // -------------- Fetch --------------
      const response = await fetch('/api/massenverarbeitungAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify(body),
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

      const dataBlob = await response.blob(); // get the response data as a blob (file)
      downloadFile(dataBlob, fileName); // Use the saved file name
      updateFileStatusAfterProcessing(fileName, 'bearbeitet');

      if (!dataBlob) {
        setLoading(false);
        toast({
          title: language === 'DE' ? "Irgendwas ist schief gelaufen" : "Something went wrong",
          position: 'top',
          status: 'error',
          isClosable: true,
        });
        return;
      }
    };
    setLoading(false);
  };

  const defaultPrompt = `Rolle:
  Du bist Korrektur-Assistent für Programmieraufgaben mit der Sprache R.
  
  Hauptziel:
    - Der Abgleich der Musterlösung mit der Lösung des Studenten.
    - Bewerte, ob der Student das Ziel der Aufgabenstellung erreicht hat.
    - Ziel ist es nicht 1:1 die Musterlösung zu zitieren, sondern zu schauen, ob der Student den Ansatz verstanden hat und dementsprechend die Anwendungsaufgabe lösen kann.
    - Folgefehler sollen nicht bestraft werden, wenn die Rechnung / Herangehensweise korrekt ist.
  
  Unterlagen:
    **Aufgabe**: Name bzw. Titel der Fragestellung (z.B. Aufgabe 1: Datenanalyse).
    **Aufgabenstellung**: Detaillierte Beschreibung dessen, was von den Studierenden erwartet wird.
    **Musterlösung**: Die Lösung der gestellten Aufgabe.
    **Maximal erreichbare Punkte**: Die maximale Punktzahl, die für die Aufgabe vergeben werden kann.
    **Korrekturschlüssel**: Ein Bewertungsschema, das zeigt, wie Punkte für verschiedene Aspekte der Antwort vergeben werden.
    **Lösung des Studenten**: Die abgegebene Antwort eines Studierenden.
  
  Formatierung der Korrektur:
    1. Bitte gib nur die Gesamtpunktzahl an und formatiere diese so, dass sie sich immer zwischen drei Dollarzeichen befindet. Hier ein Beispiel: Gesamtpunktzahl: $$$"Punktzahl"$$$. Bitte gib die Zahlen nur in numerischer Form (z.B. 1 oder 0) an, ohne sonstige Zeichen. Achte darauf, dass du immer eine Zahl angibst, selbst wenn der Student 0 Punkte erreicht hat.
    2. Bitte gib das Feedback so an, dass es sich immer zwischen 3 Hashtags befindet. Hier ein Beispiel: ###"Dein Feedback"###. Du gibst an, anhand welchen Kriterien du korrigiert und die Punkte verteilt hast. Zusätzlich gibst du noch ein kleines Feedback, was besser gemacht werden kann.`;
  


  // -------------- Frontend Compoenent --------------

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      mt={{ base: '70px', md: '0px', xl: '0px' }}
    >
      <Flex
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        maxW="100%"
        justify="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Card
          minW={{ base: '100%', md: '40%', xl: '476px' }}
          maxW={{ base: '100%', md: '40%', xl: '476px' }}
          h="min-content"
          me={{ base: '0px', md: '20px' }}
          mb={{ base: '20px', md: '0px' }}
        >
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            {(language === 'DE' ? 'Massenverarbeitung' : 'Mass Processing')}
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            {(language === 'DE' ? 'Lasse Probeklausuren Korrigieren' : 'Have Sample Exams Corrected')}
          </Text>
          <FormLabel
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
            h="60px"
            id="model"
            value={model}
            _focus={{ borderColor: 'none' }}
            mb="28px"
            fontSize={"xl"}
            onChange={(e) => setModel(e.target.value as OpenAIModel)}
          >
            <option value={'gpt-3.5-turbo-16k'}>GPT-3.5</option>
            <option value={'gpt-4'}>GPT-4</option>
          </Select>
          <FormLabel
            display="flex"
            htmlFor={'prompt'}
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}>
            {language === 'DE' ? 'System Prompt' : 'Systemprompt'}
          </FormLabel>
          <Textarea
            border="1px solid"
            borderRadius={'14px'}
            borderColor={borderColor}
            p="15px 20px"
            mb="28px"
            minH="200px"
            fontWeight="500"
            fontSize="sm"
            _focus={{ borderColor: 'none' }}
            color={textColor}
            value={defaultPrompt}
            placeholder={language === 'DE' ? 'Bitte gib den Sytemprompt ein' : 'Please enter the system prompt'}
            _placeholder={placeholderColor}
            onChange={(e) => setSystemprompt(e.target.value)}
          />
          <FormLabel
            display="flex"
            htmlFor={'upload'}
            fontSize="md"
            color={textColor}
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}>
            {language === 'DE' ? 'Daten hochladen' : 'Upload data'}
          </FormLabel>
          <FileFieldMultiple
            onFilesChange={onFilesSelected}
            onFileRemove={() => setFile(null)} // Hier hinzugefügt
          />
          <Button
            py="20px"
            px="16px"
            fontSize="md"
            variant="primary"
            borderRadius="45px"
            w={{ base: '100%' }}
            h="54px"
            mt="20px"
            onClick={handleTranslate}
            isLoading={loading ? true : false}
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(128, 156, 226, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%)',
              },
            }}
          >
            {language === 'DE' ? 'Los Gehts!' : 'Let’s Go!'}
          </Button>
        </Card>
        <Box
          backgroundColor={"white"}
          borderRadius="xl"
          boxShadow="md"
          p={5}
          mx="auto"
          width="100%"
        >
          <VStack spacing={5} align="stretch">
            <Text fontSize="2xl" fontWeight="800" color={textColor}>
              Hochgeladene Dateien
            </Text>
            {Object.keys(fileStatus).map((fileName, index) => (
              <HStack
                justifyContent="space-between"
                alignItems="center"
                p={4}
                borderRadius="10px"
                borderWidth="1px"
                borderColor={borderColor}
                bg={fileStatus[fileName] === 'bearbeitet' ? 'green.100' : 'gray.100'}
                _hover={{ bg: fileStatus[fileName] === 'bearbeitet' ? 'green.200' : 'gray.200' }}
                width="100%"
                key={index}
              >
                <Text fontSize="md" fontWeight="500" color={textColor} isTruncated maxWidth="80%">
                  {fileName}
                </Text>
                <Badge
                  fontSize="md"
                  fontWeight="bold"
                  colorScheme={fileStatus[fileName] === 'bearbeitet' ? 'green' : 'gray'}
                >
                  {fileStatus[fileName]}
                </Badge>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
