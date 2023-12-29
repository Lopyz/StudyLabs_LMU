'use client'

/*eslint-disable*/
import { useEffect } from 'react';
import Card from '@/components/card/Card';
import { useLanguage } from '../../src/contexts/LanguageContext';
import {
  Box,
  Icon,
  Flex,
  Stat,
  StatLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdOutlineAssessment } from 'react-icons/md';
import IconBox from '@/components/icons/IconBox';
import LineChart from '@/components/charts/LineChart';
import { lineChartOptionsUsage } from '@/variables/charts';
import { useGetLastTenDataPoints } from '@/hooks/useGetLastTenDataPoints';
import { useRouter } from 'next/router';


export default function NewTemplate() {
  const router = useRouter();

  useEffect(() => {
    router.push('/my-tasks');
  }, [router]);

  const { language } = useLanguage();
  const textColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const { data: lastTenDataPoints, isLoading, isError } = useGetLastTenDataPoints();

  const chartData = lastTenDataPoints ? [
    { name: language === 'DE' ? 'Maximal Erreichbare Punkte' : 'Max Achievable Points', data: lastTenDataPoints.grandTotalAchievablePoints },
    { name: language === 'DE' ? 'Erreichte Punktzahl' : 'Achieved Score', data: lastTenDataPoints.grandTotalPoints },
  ] : null;

  if (isError) {
    return <div>Fehler beim Laden der Daten</div>;
  }


  return null;
  <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
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
            {language === 'DE' ? 'Meine Statistik' : 'My Statistic'}
          </StatLabel>
        </Stat>
      </Flex>
      <Box h="500px">
        {chartData && (
          <LineChart
            key={JSON.stringify(chartData)}
            chartData={chartData}
            chartOptions={lineChartOptionsUsage}
          />
        )}
      </Box>
    </Card>
  </Box>
};