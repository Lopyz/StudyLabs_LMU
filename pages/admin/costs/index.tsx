'use client'

/*eslint-disable*/
import Card from '@/components/card/Card';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import { AiOutlineBarChart } from 'react-icons/ai';
import {
    Box,
    Icon,
    Flex,
    Stat,
    StatLabel,
    SimpleGrid,
    useColorModeValue,
} from '@chakra-ui/react';
import { MdOutlineAssessment, MdAttachMoney } from 'react-icons/md';
import { TbChartHistogram } from 'react-icons/tb';
import MiniStatistics from '@/components/card/MiniStatistics';
import IconBox from '@/components/icons/IconBox';
import BarChart from '@/components/charts/BarChart';
import { barChartOptionsSidebar } from '@/variables/charts';
import { useGetLastThirtyDays } from '@/hooks/useGetLastThirtyDays';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { useGetCostByDay } from '@/hooks/useGetCostByDay';
export const getServerSideProps = adminProtectionBackend;


export default function NewTemplate() {
    const { language } = useLanguage();
    const textColor = useColorModeValue('navy.700', 'white');
    const brandColor = useColorModeValue('brand.500', 'white');
    const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

    const { data: costData, isLoading: costIsLoading, isError: costIsError } = useGetCostByDay();
    const { data: thirtyDaysData, isLoading: thirtyDaysIsLoading, isError: thirtyDaysIsError } = useGetLastThirtyDays();

    // Formatieren der Daten für das Diagramm
    const chartData = costData ? [
        {
            name: language === 'DE' ? 'Kosten' : 'Costs',
            data: costData.map((item: { _id: any; totalCosts: any; }) => ({ x: item._id, y: `${item.totalCosts.toFixed(3)}$` }))
        }
    ] : null;

    if (costIsError || thirtyDaysIsError) {
        return <div>Fehler beim Laden der Daten</div>;
    }

    return (
        <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px" mb="20px">
                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                                <Icon w="24px" h="24px" as={MdAttachMoney} color={brandColor} />
                            }
                        />
                    }
                    name={language === 'DE' ? 'Kosten in den letzten 30 Tagen' : 'Costs Last 30 Days'}
                    value={`$${thirtyDaysData?.totalCosts.toFixed(2)}`}
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={<Icon w="24px" h="24px" as={AiOutlineBarChart} color={brandColor} />}
                        />
                    }
                    name={language === 'DE' ? 'Anfragen in den letzen 30 Tagen' : 'Requests made in the last 30 days'}
                    value={`${thirtyDaysData?.totalDocuments}`}
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={<Icon w="28px" h="28px" as={TbChartHistogram} color={brandColor} />}
                        />
                    }
                    name={language === 'DE' ? 'Durchschnittskosten pro Anfrage' : 'Average Cost per request'}
                    value={`$${thirtyDaysData?.averageCostPerDocument.toFixed(2)}`}
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
                            {language === 'DE' ? 'Kosten der letzen Tage' : 'Costs of the last days'}
                        </StatLabel>
                    </Stat>
                </Flex>
                <Box h="500px">
                    {chartData && (
                        <BarChart
                            key={JSON.stringify(chartData)}
                            chartData={chartData}
                            chartOptions={barChartOptionsSidebar}
                        />
                    )}
                </Box>
            </Card>
        </Box>
    );
};
