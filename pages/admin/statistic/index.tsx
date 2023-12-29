'use client'

/*eslint-disable*/
import { useState } from 'react';
import Card from '@/components/card/Card';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import {
    Box,
    Button,
    Icon,
    Flex,
    Stat,
    StatLabel,
    SimpleGrid,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { MdOutlineAssessment } from 'react-icons/md';
import MiniStatistics from '@/components/card/MiniStatistics';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { LuRefreshCcw } from "react-icons/lu";
import { FaBalanceScale } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";
import IconBox from '@/components/icons/IconBox';
import BarChart from '@/components/charts/BarChart';
import { barChartStatistics } from '@/variables/charts';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useGetAllSchemas } from '@/hooks/useGetAllSchemas';
import { useGetAllTasks } from '@/hooks/useGetAllTasks';
import { useGetAveragePoints } from '@/hooks/useGetAveragePoints';
import { useGetAllAveragePoints } from '@/hooks/useGetAllAveragePoints';
import useSWR, { mutate } from 'swr';

export const getServerSideProps = adminProtectionBackend;

export default function NewTemplate() {
    const { language } = useLanguage();
    const textColor = useColorModeValue('navy.700', 'white');
    const brandColor = useColorModeValue('brand.500', 'white');
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
    const bgColor = useColorModeValue('white', 'navy.700');
    let menuBg = useColorModeValue('white', 'navy.800');

    const hoverButton = useColorModeValue(
        { bg: 'gray.100' },
        { bg: 'whiteAlpha.100' },
    );
    const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
    const [selectedSchemaId, setSelectedSchemaId] = useState<string>('');

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = () => setDeleteModalOpen(true);
    const closeDeleteModal = () => setDeleteModalOpen(false);

    const confirmDelete = () => {
        resetStatistics();
        closeDeleteModal();
    }

    const { data: taskData, isLoading: taskIsLoading, isError: taskIsError } = useGetAllTasks(selectedSchemaId);
    const { data: averagePointsData, isLoading: averagePointsIsLoading, isError: averagePointsIsError } = useGetAveragePoints(selectedSchemaId);
    const { data: allAveragePointsData, isLoading: allAveragePointsIsLoading, isError: allAveragePointsIsError } = useGetAllAveragePoints(selectedSchemaId);



    const resetStatistics = async () => {
        if (!selectedSchemaId) return;
        try {
            await fetch(`/api/db/data/deleteAllTasks?schemaId=${selectedSchemaId}`, {
                method: 'DELETE'
            });
            // Aktualisieren der Aufgaben und der durchschnittlichen Punktzahlen
            mutate(`/api/db/data/getAllTasks?schemaId=${selectedSchemaId}`);
            mutate(`/api/db/data/getAveragePoints?schemaId=${selectedSchemaId}`);
            mutate(`/api/db/data/getAllAveragePoints?schemaId=${selectedSchemaId}`);
        } catch (error) {
            console.error(error);
        }
    }


    // Formatieren der Daten für das Diagramm
    const chartData = allAveragePointsData ? [
        {
            name: (language === 'DE' ? 'Erreicht' : 'Achieved'),
            data: allAveragePointsData.map((item: { _id: string; averageAchieved: number; }) => item.averageAchieved)
        },
        {
            name: (language === 'DE' ? 'Möglich' : 'Possible'),
            data: allAveragePointsData.map((item: { _id: string; averagePossible: number; }) => item.averagePossible)
        },
    ] : null;
    const chartLabels = allAveragePointsData ? allAveragePointsData.map((item: { _id: string; }) => item._id) : null;


    const { data, isLoading, isError } = useGetAllSchemas();

    if (isError) {
        return <div>Fehler beim Laden der Daten</div>;
    }

    return (
        <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
            <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="60px" >
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} h="90px" bg={bgColor}>
                        {selectedSchema || (language === 'DE' ? 'Bitte wähle ein Schema aus' : 'Please select a scheme')}
                    </MenuButton>
                    <MenuList bg={menuBg} borderRadius={"15px"} p={1} minW="0" w={'300px'}>
                        {data && data.map((item: { name: string, _id: string }, index: number) => (
                            <MenuItem
                                key={index}
                                onClick={() => { setSelectedSchema(item.name); setSelectedSchemaId(item._id); }}
                                _hover={hoverButton}
                                justifyContent={"center"}
                                bg={menuBg}
                            >
                                <Text textAlign="center" fontSize="m" fontWeight="500" ml="5px">
                                    {item.name}
                                </Text>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Button h="90px" my="15px" onClick={openDeleteModal} bg={bgColor}>
                    <Flex alignItems="center">
                        <Icon as={LuRefreshCcw} w="20px" h="20px" mr="10px" />
                        {language === 'DE' ? 'Statistiken zurücksetzen' : 'Reset Statistics'}
                    </Flex>
                </Button>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">


                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                                <Icon w="24px" h="24px" as={HiOutlineAcademicCap} color={brandColor} />
                            }
                        />
                    }
                    name={language === 'DE' ? 'Korrigierte Aufgaben' : 'Regulated tasks'}
                    value={taskData ? taskData.taskCount.toString() : (language === 'DE' ? 'Schema auswählen...' : 'Select a scheme...')}
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                                <Icon w="24px" h="24px" as={FaBalanceScale} color={brandColor} />
                            }
                        />
                    }
                    name={language === 'DE' ? 'Durchschnittlich erreichte Punktzahl' : 'Average number of points achieved'}
                    value={averagePointsData ? averagePointsData.averagePoints.toString() : (language === 'DE' ? 'Schema auswählen...' : 'Select a scheme...')}

                />

            </SimpleGrid>
            <Card>
                <Flex
                    my="auto"
                    h="100%"
                    align={{ base: 'center', xl: 'start' }}
                    justify={{ base: 'center', xl: 'center' }}
                >
                    <IconBox
                        w="56px"
                        h="56px"
                        bg={boxBg}
                        icon={<Icon w="24px" h="24px" as={MdOutlineAssessment} color={brandColor} />}
                    />
                    <Stat my="auto" ms={'18px'}>
                        <StatLabel
                            lineHeight="100%"
                            color={textColor}
                            fontSize="lg"
                            mb="4px"
                            fontWeight="700"
                        >
                            {language === 'DE' ? 'Durchschnittspunktzahl nach Aufgabe' : 'Average Score By Task'}
                        </StatLabel>
                    </Stat>
                </Flex>
                <Box h="500px">
                    {chartData && (
                        <BarChart
                            key={JSON.stringify(chartData)}
                            chartData={chartData}
                            chartLabels={chartLabels}
                            chartOptions={barChartStatistics}
                        />
                    )}
                </Box>
            </Card>
            {isDeleteModalOpen && (
                <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
                    <ModalOverlay />
                    <ModalContent bg={bgColor}>
                        <ModalHeader>
                            {language === 'DE' ? 'Statistiken löschen' : 'Delete Statistics'}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {language === 'DE'
                                ? 'Bist du dir sicher, dass du diese Statistiken löschen möchtest?'
                                : 'Are you sure you want to delete these statistics?'}
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
        </Box>
    );
};
