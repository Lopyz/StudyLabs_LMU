import { Box, SimpleGrid } from '@chakra-ui/react';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import TemplateCard from '@/components/card/TemplateCard';
import TemplateCardSkeleton from '@/components/card/TemplateCardSkeleton';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useGetAllSchemas } from '@/hooks/useGetAllSchemas';

export default function Settings() {
  const { language } = useLanguage();
  const { data, isLoading, isError } = useGetAllSchemas();

  if (isError) {
    return <div>Fehler beim Laden der Daten</div>;
  }
  
  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 2, xl: 2 }} spacing="20px">
        {isLoading ? (
          <>
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
          </>
        ) : (
          data?.map((data: { _id: number; name: string; description: string; }, index: any) => (
            <TemplateCard
              key={index}
              link={`/einzelverarbeitung/${data._id}`}
              illustration={<HiOutlineAcademicCap width="20px" height="20px" color="inherit" />}
              name={language === 'DE' ? data.name : data.name}
              description={language === 'DE' ? data.description : data.description}
            />
          ))
        )}
      </SimpleGrid>
    </Box>
  );
}
  