'use client';

// Chakra imports
import Card from '@/components/card/Card';
import ProjectCard from '@/components/card/ProjectCard';
import { ProjectSearchBar } from '@/components/search';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Flex,
  Icon,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { MdDelete, MdCheck, MdClose, MdDownload } from 'react-icons/md';
import { BiSelectMultiple } from 'react-icons/bi';
import { useLanguage } from '@/contexts/LanguageContext';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { useGetAllFiles } from '@/hooks/useGetAllFiles';
import ProjectCardSkeleton from '@/components/card/ProjectCardSkeleton';
import { sortProjects } from '@/utils/sortProjects';
import { InfoOutlineIcon } from '@chakra-ui/icons';
export const getServerSideProps = adminProtectionBackend;

export default function Settings() {
  const router = useRouter();
  const textColor = useColorModeValue('navy.700', 'white');
  const bgColor = useColorModeValue('white', 'navy.700');
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );
  const { language } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const handleNewProject = () => { router.push('/dashboard'); };
  const resetSelectedFilesAfterDownload = () => {
    setSelectedFiles([]); // Setzt den Zustand zurück, sodass keine Dateien ausgewählt sind
  };

  const { data, isLoading, isError, revalidateData } = useGetAllFiles();

  // -------------- Selected Files + pass on to delete function  --------------

  const [isMultiDeleteModalOpen, setMultiDeleteModalOpen] = useState(false);

  const onSelectFile = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const onDeleteSelectedFiles = () => {
    if (selectedFiles.length > 0) {
      setMultiDeleteModalOpen(true);
    }
  };

  const confirmMultiDelete = async () => {
    for (const fileId of selectedFiles) {
      await onDelete(fileId);
    }
    setSelectedFiles([]);
    setMultiDeleteModalOpen(false);
  };

  // -------------- Delete Function  --------------

  let isToastShown = false;

  const onDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/db/project/delete?id=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Benutze die revalidateData-Funktion, um die Daten erneut zu holen
        revalidateData();

        if (!isToastShown) {
          toast({
            title: language === 'DE' ? "Die Datei wurde erfolgreich gelöscht." : "The file has been successfully deleted.",
            status: "success",
            isClosable: true,
            position: "top"
          });
          isToastShown = true;
        }
      } else {
        if (!isToastShown) {
          alert('Fehler beim Löschen der Datei.');
          toast({
            title: language === 'DE' ? "Es gab einen Fehler beim löschen." : "There was an error while deleting.",
            status: "error",
            isClosable: true,
            position: "top"
          });
          isToastShown = true;
        }
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Datei:', error);
    }
  };
  // --------------Download Excel  --------------

  const onDownload = async (fileId: string) => {
    try {
      const res = await fetch(`/api/db/excel/download?fileId=${fileId}`);
      const data = await res.json();

      if (res.ok) {
        const blob = new Blob([new Uint8Array(data.file.excelFile.data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.file.filename || 'file.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        resetSelectedFilesAfterDownload();
        toast({
          title: language === 'DE' ? "Die Datei wurde erfolgreich heruntergeladen." : "The file has been successfully downloaded.",
          status: "success",
          isClosable: true,
          position: "top"
        });
      } else {
        console.error('Error:', data.error);
        toast({
          title: language === 'DE' ? "Es gab einen Fehler beim herunterladen." : "There was an error while downloading.",
          status: "error",
          isClosable: true,
          position: "top"
        });
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  // --------------Download MultipleExcel  --------------

  const downloadMultipleFiles = async (fileIds: string[]) => {
    try {
      const res = await fetch(`/api/db/excel/downloadMultiple?fileIds=${fileIds.filter(id => filteredData.map((d: { id: any; }) => d.id).includes(id)).join(',')}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'files.zip';
        document.body.appendChild(a);
        resetSelectedFilesAfterDownload();
        a.click();
        a.remove();
        toast({
          title: language === 'DE' ? "Die Datei wurde erfolgreich heruntergeladen." : "The file was downloaded successfully.",
          status: "success",
          isClosable: true,
          position: "top"
        });
      } else {
        console.error('Error downloading the files');
        toast({
          title: language === 'DE' ? "Es gab einen Fehler beim herunterladen." : "There was an error while downloading.",
          status: "error",
          isClosable: true,
          position: "top"
        });
      }
    } catch (error) {
      console.error('Error downloading the files:', error);
    }
  };

  // --------------Select All Files Function --------------

  const [areAllFilesSelected, setAreAllFilesSelected] = useState(false);

  const toggleSelectAllFiles = () => {
    setAreAllFilesSelected(prev => !prev);
    if (!areAllFilesSelected) {
      setSelectedFiles(filteredData.map((data: { id: any; }) => data.id));
    } else {
      setSelectedFiles([]);
    }
  };

  // --------------Modal Function  --------------

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const openDeleteModal = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete);
    }
    closeDeleteModal();
  };


  // --------------Modal Function Edit Name + API Request --------------

  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileToRename, setFileToRename] = useState("");

  const openRenameModal = (filename: string) => {
    setFileToRename(filename);
    setRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setRenameModalOpen(false);
    setFileToRename("");
  };



  const handleNewFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(event.target.value);
  };
  const toast = useToast();
  const submitNewFileName = async () => {
    try {
      const response = await fetch(`/api/db/project/rename?fileId=${fileToRename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newFileName })
      });

      if (response.ok) {
        // revalidate the data after renaming
        revalidateData();

        // Show a success toast
        toast({
          title: language === 'DE' ? "Die Überschrift wurde erfolgreich geändert." : "The title has been successfully changed.",
          status: "success",
          isClosable: true,
          position: "top"
        });
      } else {
        // Show an error toast
        toast({
          title: language === 'DE' ? "Die Überschrift konnte nicht geändert werden." : "The title could not be changed.",
          status: "error",
          isClosable: true,
          position: "top"
        });
        console.error('Unable to rename the file');
      }
    } catch (error) {
      console.error('Error renaming the file:', error);
    }
    closeRenameModal();
  };


  // -------------- Filter-Logiken --------------

  const [sortOrder, setSortOrder] = useState('high_to_low');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo<Array<any>>(() => {
    if (!data || !searchTerm) {
      return data || [];
    }
    return data.filter((entry: { filename: string; username: string; grandTotalPoints: { toString: () => string | string[]; }; timestamp: string | number | Date; }) => {
      return (
        entry.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.grandTotalPoints.toString().includes(searchTerm) ||
        new Date(entry.timestamp).toLocaleString().includes(searchTerm)
      );
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (filteredData) {
      return sortProjects(filteredData, sortOrder);
    }
    return [];
  }, [filteredData, sortOrder]);



  // -------------- Get current files --------------

  if (isError) {
    return <div>Fehler beim Laden der Daten</div>;
  }

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <Card w="100%" mb="20px">
        <Flex align="center" direction={{ base: 'column', md: 'row' }}>
          <Text fontSize="lg" fontWeight={'700'} mr={"10px"}>
            {language === 'DE' ? `Alle KI-Rückmeldungen (${sortedData ? sortedData.length : 0})` : `All AI-Feedback  (${sortedData ? sortedData.length : 0})`}
          </Text>
          <Tooltip label={language === 'DE' ? 'Zeigt eine Liste aller Anfragen, die von allen Usern bearbeitet wurden. Die Zahl in Klammern gibt an, wie viele Anfragen aktuell vorliegen.' : 'Shows a list of all requests that have been processed by all users. The number in brackets indicates how many requests are currently available.'} placement="top">
            <span>
              <InfoOutlineIcon cursor="pointer" />
            </span>
          </Tooltip>
          <Tooltip label={language === 'DE' ? 'Klicke hier, um eine neue Aufgabe zu bearbeiten.' : 'Click here to edit a new task.'} placement="top">
            <Button
              onClick={handleNewProject}
              variant="primary"
              py="20px"
              px="16px"
              fontSize="sm"
              borderRadius="45px"
              ms="auto"
              mt={{ base: '20px', md: '0px' }}
              w={{ base: '100%', md: '210px' }}
              h="54px"
            >
              {language === 'DE' ? 'Neue Aufgabe bearbeiten' : 'Edit New Task'}
            </Button>
          </Tooltip>
        </Flex>
      </Card>
      <Flex w="100%" mb="20px" direction={{ base: 'column', md: 'row' }}>
        <ProjectSearchBar value={searchTerm} onChange={setSearchTerm} />
        <Select
          fontSize="sm"
          variant="main"
          h="44px"
          maxH="44px"
          mt={{ base: '20px', md: '0px' }}
          me={{ base: '10px', md: '20px' }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="high_to_low">{language === 'DE' ? 'Neuste zuerst' : 'Latest first'}</option>
          <option value="low_to_high">{language === 'DE' ? 'Älteste zuerst' : 'Oldest first'}</option>
        </Select>
        <Tooltip label={language === 'DE' ? 'Löschen' : 'Delete'} placement="bottom">
          <Button
            me={{ base: '10px', md: '10px' }}
            bg={buttonBg}
            border="1px solid"
            color="gray.500"
            mt={{ base: '20px', md: '0px' }}
            borderColor={borderColor}
            borderRadius="12px"
            minW="44px"
            h="44px"
            _placeholder={{ color: 'gray.500' }}
            _hover={hoverButton}
            _active={activeButton}
            _focus={activeButton}
            isDisabled={selectedFiles.length === 0}
            onClick={() => onDeleteSelectedFiles()}
          >
            <Icon color={textColor} as={MdDelete} />
          </Button>
        </Tooltip>
        <Tooltip label={language === 'DE' ? 'Herunterladen' : 'Download'} placement="bottom">
          <Button
            me={{ base: '10px', md: '10px' }}
            bg={buttonBg}
            border="1px solid"
            color="gray.500"
            mt={{ base: '20px', md: '0px' }}
            borderColor={borderColor}
            borderRadius="12px"
            minW="44px"
            h="44px"
            _placeholder={{ color: 'gray.500' }}
            _hover={hoverButton}
            _active={activeButton}
            _focus={activeButton}
            isDisabled={selectedFiles.length === 0}
            onClick={() => downloadMultipleFiles(selectedFiles)}
          >
            <Icon color={textColor} as={MdDownload} />
          </Button>
        </Tooltip>
        <Tooltip label={language === 'DE' ? 'Alle Dateien auswählen' : 'Select all files'} placement="bottom">
          <Button
            me={{ base: '10px', md: '10px' }}
            bg={buttonBg}
            border="1px solid"
            color="gray.500"
            mt={{ base: '20px', md: '0px' }}
            borderColor={borderColor}
            borderRadius="12px"
            minW="44px"
            h="44px"
            _placeholder={{ color: 'gray.500' }}
            _hover={hoverButton}
            _active={activeButton}
            _focus={activeButton}
            onClick={toggleSelectAllFiles}
          >
            <Icon color={textColor} as={BiSelectMultiple} />
          </Button>
        </Tooltip>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="20px">
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => <ProjectCardSkeleton key={index} />)
        ) : (
          sortedData.map((data) => (
            <ProjectCard
              selectedFiles={selectedFiles}
              key={data.id}
              id={data.id}
              title={data.filename}
              username={data.username}
              grandTotalPoints={data.grandTotalPoints}
              grandTotalAchievablePoints={data.grandTotalAchievablePoints}
              time={new Date(data.timestamp).toLocaleString()}
              onEdit={() => openRenameModal(data.id)}
              onDelete={() => openDeleteModal(data.id)}
              onSelectFile={onSelectFile}
              onDownload={() => {
                onDownload(data.id);
              }}
            />
          ))
        )}
      </SimpleGrid>
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>
            {language === 'DE' ? 'Datei Löschen' : 'Delete File'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {language === 'DE'
                ? 'Bist du dir sicher, dass du diese Datei löschen möchtest?'
                : 'Are you sure you want to delete this file?'}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={confirmDelete}
                leftIcon={<MdCheck />}
              >
                {language === 'DE' ? 'Löschen' : 'Delete'}
              </Button>
              <Button variant="ghost" onClick={closeDeleteModal} leftIcon={<MdClose />}>
                {language === 'DE' ? 'Abbrechen' : 'Cancel'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isMultiDeleteModalOpen && (
        <Modal isOpen={isMultiDeleteModalOpen} onClose={() => setMultiDeleteModalOpen(false)}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>
              {language === 'DE' ? 'Dateien Löschen' : 'Delete Files'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {language === 'DE'
                ? 'Bist du dir sicher, dass du die ausgewählten Dateien löschen möchten?'
                : 'Are you sure you want to delete the selected files?'}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={confirmMultiDelete}
                leftIcon={<MdCheck />}
              >
                {language === 'DE' ? 'Löschen' : 'Delete'}
              </Button>
              <Button variant="ghost" onClick={() => setMultiDeleteModalOpen(false)} leftIcon={<MdClose />}>
                {language === 'DE' ? 'Abbrechen' : 'Cancel'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isRenameModalOpen && (
        <Modal isOpen={isRenameModalOpen} onClose={closeRenameModal}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>
              {language === 'DE' ? 'Überschrift Umbenennen' : 'Rename Title'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input value={newFileName} onChange={handleNewFileNameChange} placeholder={language === 'DE' ? 'Beispiel Feedback' : 'Example Feedback'} />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={submitNewFileName}
                leftIcon={<MdCheck />}
              >
                {language === 'DE' ? 'Umbenennen' : 'Rename'}
              </Button>
              <Button variant="ghost" onClick={closeRenameModal} leftIcon={<MdClose />}>
                {language === 'DE' ? 'Abbrechen' : 'Cancel'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}