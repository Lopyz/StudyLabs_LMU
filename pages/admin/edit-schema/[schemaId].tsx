{/*eslint-disable*/ }
import { useEffect, useState } from 'react';
import Card from '@/components/card/Card';
import {
  Button,
  Flex,
  FormLabel,
  Textarea,
  useColorModeValue,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@chakra-ui/react';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { useGetSchema } from '@/hooks/useGetSchema';
export const getServerSideProps = adminProtectionBackend;

export default function NewTemplate() {
  const toast = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const { schemaId } = router.query;
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'navy.700');

  const [updatedExercises, setUpdatedExercises] = useState<any[]>([]);
  const [updatedname, setUpdatedname] = useState<string | null>(null);
  const [updateddescription, setUpdateddescription] = useState<string | null>(null);
  const [updatedsystemprompt, setUpdatedsystemprompt] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetSchema();


  useEffect(() => {
    if (data) {
      setUpdatedExercises([...data.data]);  // Nehmen wir an, dass `data.data` das Array von Übungen enthält.
    }
  }, [data]);


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const updateValue = (oldValue: string, newValue: string) => {
    if (newValue === '') {
      return oldValue;
    } else {
      return newValue;
    }
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    let newExercises = [...updatedExercises];

    // Überprüfen, ob der neue Wert sich vom alten unterscheidet
    if (newExercises[index][field] !== value) {
      if (field === 'points_achievable') {
        if (isNaN(Number(value))) {
          toast({
            title: language === 'DE' ? "Nur Zahlen ohne Komma" : "Only quotes without comma",
            position: 'top',
            status: 'error',
            isClosable: true,
          });
        } else {
          newExercises[index][field] = Number(value);
        }
      } else {
        newExercises[index][field] = value;
      }
      setUpdatedExercises(newExercises);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/db/schema/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: schemaId,
          content: updatedsystemprompt,
          updatedname: updatedname,
          updateddescription: updateddescription,
          exercises: updatedExercises
        })
      });
      if (response.ok) {
        toast({
          title: language === 'DE' ? "Die Daten wurden erfolgreich aktuallisiert" : "The data was successfully updated",
          position: 'top',
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: language === 'DE' ? "Fehler beim aktuallisieren der Daten" : "There was an error updating the data",
          position: 'top',
          status: 'error',
          isClosable: true,
        });
      }

    } catch (error) {
      toast({
        title: language === 'DE' ? "Fehler beim aktuallisieren des Prompts" : "There was an error updating the prompt",
        position: 'top',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleDeleteSchema = async () => {
    try {
      const response = await fetch('/api/db/schema/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemaId })
      });
      if (response.ok) {
        toast({
          title: language === 'DE' ? "Das Schema wurde erfolgreich gelöscht" : "The schema was successfully deleted",
          position: 'top',
          status: 'success',
          isClosable: true,
        });
        router.push('/admin/all-schemas'); // Redirect to /admin/all-
      } else {
        toast({
          title: language === 'DE' ? "Fehler beim Löschen des Schemas" : "There was an error deleting the schema",
          position: 'top',
          status: 'error',
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: language === 'DE' ? "Fehler beim Löschen des Schemas" : "There was an error deleting the schema",
        position: 'top',
        status: 'error',
        isClosable: true,
      });
    }
  };

  if (isError) {
    return <div>Fehler beim Laden der Daten</div>;
  }

  return (
    <Card
      maxW="100%"
      w="716px"
      mt={{ base: '70px', md: '0px', xl: '0px' }}
      h="100%"
      mx="auto"
    >
      <FormLabel
        display="flex"
        htmlFor={'prompt'}
        fontSize="md"
        color={textColor}
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}>
        {language === 'DE' ? 'Überschrift' : 'Title'}
      </FormLabel>
      <Textarea
        value={updatedname !== null ? updatedname : data?.name}
        onChange={(e) => setUpdatedname(e.target.value)}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        p="15px 20px"
        mb="28px"
        minH="55px"
        fontWeight="500"
        fontSize="sm"
        _focus={{ borderColor: 'none' }}
        color={textColor}
        _placeholder={placeholderColor}
      />
      <FormLabel
        display="flex"
        htmlFor={'prompt'}
        fontSize="md"
        color={textColor}
        fontWeight="bold"
        _hover={{ cursor: 'pointer' }}>
        {language === 'DE' ? 'Beschreibung' : 'Description'}
      </FormLabel>
      <Textarea
        value={updateddescription !== null ? updateddescription : data?.description}
        onChange={(e) => setUpdateddescription(e.target.value)}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        p="15px 20px"
        mb="28px"
        minH="110px"
        fontWeight="500"
        fontSize="sm"
        _focus={{ borderColor: 'none' }}
        color={textColor}
        _placeholder={placeholderColor}
      />
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
        value={updatedsystemprompt !== null ? updatedsystemprompt : data?.systemprompt}
        onChange={(e) => setUpdatedsystemprompt(e.target.value)}
        border="1px solid"
        borderRadius={'14px'}
        borderColor={borderColor}
        p="15px 20px"
        mb="28px"
        minH="180px"
        fontWeight="500"
        fontSize="sm"
        _focus={{ borderColor: 'none' }}
        color={textColor}
        _placeholder={placeholderColor}
      />
      <Accordion allowToggle>
        {data?.data.map((data: any, index: any) => (
          <AccordionItem key={index} border="1px solid" borderRadius="10px" mb="5px" borderColor={borderColor}>
            <h2>
              <AccordionButton>
                <Box
                  flex="1"
                  textAlign="left"
                  fontWeight="500"
                  fontSize="xl"
                  color={textColor}
                >
                  {data.exercise_id}
                </Box>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <FormLabel htmlFor={`exercise-${index}`}>{language === 'DE' ? 'Übungstext' : 'Exercise Text'}</FormLabel>
              <Textarea
                id={`exercise-${index}`}
                border="1px solid"
                borderRadius={'14px'}
                borderColor={borderColor}
                p="15px 20px"
                mb="28px"
                minH="180px"
                fontWeight="500"
                fontSize="sm"
                _focus={{ borderColor: 'none' }}
                color={textColor}
                onChange={(e) => handleInputChange(index, 'exercise_text', e.target.value)}
                value={updatedExercises[index]?.exercise_text || data.exercise_text}
              />
              <FormLabel htmlFor={`exercise-${index}`}>{language === 'DE' ? 'Korrekte Lösung' : 'Solution Correct'}</FormLabel>
              <Textarea
                id={`exercise-${index}`}
                border="1px solid"
                borderRadius={'14px'}
                borderColor={borderColor}
                p="15px 20px"
                mb="28px"
                minH="180px"
                fontWeight="500"
                fontSize="sm"
                _focus={{ borderColor: 'none' }}
                color={textColor}
                onChange={(e) => handleInputChange(index, 'solution_correct', e.target.value)}
                value={updatedExercises[index]?.solution_correct || data.solution_correct}
              />
              <FormLabel htmlFor={`exercise-${index}`}>{language === 'DE' ? 'Bewertungsschlüssel' : 'Rubic Scoring'}</FormLabel>
              <Textarea
                id={`exercise-${index}`}
                border="1px solid"
                borderRadius={'14px'}
                borderColor={borderColor}
                p="15px 20px"
                mb="28px"
                minH="180px"
                fontWeight="500"
                fontSize="sm"
                _focus={{ borderColor: 'none' }}
                color={textColor}
                onChange={(e) => handleInputChange(index, 'rubric_scoring', e.target.value)}
                value={updatedExercises[index]?.rubric_scoring || data.rubric_scoring}
              />
              <FormLabel htmlFor={`exercise-${index}`}>{language === 'DE' ? 'Erreichbare Punkte' : 'Points Achievable'}</FormLabel>
              <Textarea
                id={`exercise-${index}`}
                border="1px solid"
                borderRadius={'14px'}
                borderColor={borderColor}
                p="15px 20px"
                mb="28px"
                minH="60px"
                fontWeight="500"
                fontSize="sm"
                _focus={{ borderColor: 'none' }}
                color={textColor}
                onChange={(e) => handleInputChange(index, 'points_achievable', e.target.value)}
                value={updatedExercises[index]?.points_achievable.toString() || data.points_achievable.toString()}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="right"
        mt="28px"
      >
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>{language === 'DE' ? 'Schema Löschen' : 'Delete Schema'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {language === 'DE' ? 'Bist du sicher, dass du das Schema löschen möchtest?' : 'Are you sure you want to delete the schema?'}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" onClick={handleDeleteSchema}>
                {language === 'DE' ? 'Löschen' : 'Delete'}
              </Button>
              <Button variant="danger" mr={3} onClick={handleCloseModal}>
                {language === 'DE' ? 'Abbrechen' : 'Cancel'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Button
          onClick={handleOpenModal}
          variant="red"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          mt={{ base: '20px', md: '0px' }}
          w={{ base: '100%', md: '200px' }}
          h="54px"
        >
          Schema Löschen
        </Button>
        <Button
          onClick={handleSaveChanges}
          variant="primary"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          mt={{ base: '20px', md: '0px' }}
          w={{ base: '100%', md: '200px' }}
          h="54px"
        >
          Neue Daten speichern
        </Button>
      </Flex>
    </Card>
  );
};
