import { Box, SimpleGrid } from '@chakra-ui/react';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import TemplateCard from '@/components/card/TemplateCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';

export const getServerSideProps = adminProtectionBackend;

export default function Settings() {
  const { language } = useLanguage();

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 1, xl: 1 }} spacing="20px">
        <TemplateCard
          link={`/admin/massenverarbeitung/`}
          illustration={<HiOutlineAcademicCap width="20px" height="20px" color="inherit" />}
          name={language === 'DE' ? "Massenverarbeitung" : "Mass Processing"}
          description={language === 'DE' ? "Interne Maseenverarbeitug zum verarbeiten großer Datan" : "Internal mass processing for processing large data"}
        />
      </SimpleGrid>
    </Box>
  );
}
