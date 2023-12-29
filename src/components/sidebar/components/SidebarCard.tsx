
'use client';
// Chakra import
import { Box, Flex, Text, Badge, LightMode, Progress, useColorModeValue, } from '@chakra-ui/react';
import LineChart from '@/components/charts/LineChart';
import {
  barChartDataSidebar,
  barChartOptionsSidebar,
  lineChartDataSidebar,
  lineChartOptionsSidebar,
  pieChartOptionsSidebar,
} from '@/variables/charts';
import { useGetUserData } from '@/hooks/useGetUserData';
import { useLanguage } from '../../../../src/contexts/LanguageContext';
import PieChart from '@/components/charts/PieChart';

export default function SidebarDocs() {
  const bgColorLight = 'linear-gradient(15.46deg, #3556CB 26.3%, #A3C2FA 86.4%)';
  const bgColorDark = 'linear-gradient(15.46deg, #2D455C 26.3%, #3556CB 86.4%)';
  const bgColor = useColorModeValue(bgColorLight, bgColorDark);
  const { language } = useLanguage();

  const { data: userData } = useGetUserData();

  const usageData = {
    usage: userData?.usage || 0,
    maxUsage: userData?.maxUsage || 0,
  };

  const progressPercentage = (usageData.usage / usageData.maxUsage) * 100;
  const remainingRequests = usageData.maxUsage - usageData.usage;
  const usedRequests = usageData.usage;
  const maxRequests = usageData.maxUsage;

  const pieChartData = [usedRequests, remainingRequests];

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
      w="100%"
      pb="10px"
    >
      <Flex direction="column" mb="12px" w="100%" px="20px" pt="20px">
        <Text fontSize="md" fontWeight={'600'} color="white" mb="10px" align="center">
          {language === 'DE' ? 'Anfragekontingent' : 'Request-contingent'}
        </Text>
      </Flex>
      <Box h="160px" w="100%" mt="px">
        <PieChart
          key={JSON.stringify(pieChartData)}
          chartData={pieChartData}
          chartOptions={pieChartOptionsSidebar(usedRequests, remainingRequests, language)}
        />

      </Box>
    </Flex>
  );
}