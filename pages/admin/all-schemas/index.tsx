'use client';

// Chakra imports
import Card from '@/components/card/Card';
import { SearchBar } from '@/components/search';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Flex,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import TemplateCard from '@/components/card/TemplateCard';
import TemplateCardSkeleton from '@/components/card/TemplateCardSkeleton';
import { RiFileList2Fill } from 'react-icons/ri';

import { useLanguage } from '@/contexts/LanguageContext';
import { adminProtectionBackend } from '@/utils/adminProtectionBackend';
import { useGetAllSchemas } from '@/hooks/useGetAllSchemas';
import { InfoOutlineIcon } from '@chakra-ui/icons';
interface SchemaData {
  _id: number;
  name: string;
  description: string;
}

export const getServerSideProps = adminProtectionBackend;

export default function Settings() {
  const router = useRouter();
  const { language } = useLanguage();
  const [sortOrder, setSortOrder] = useState<string>('low_to_high');
  const handleNewProject = () => { router.push('/admin/new-schema'); };
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading, isError } = useGetAllSchemas();

  // -------------- Daten Fetching  --------------

  if (isError) {
    return <div>Fehler beim Laden der Daten</div>;
  }


  // -------------- Daten Such und Filterlogik --------------
  const filteredData = data?.filter((item: SchemaData) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = filteredData?.sort((a: SchemaData, b: SchemaData) => {
    if (sortOrder === 'low_to_high') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });


  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <Card w="100%" mb="20px">
        <Flex align="center" direction={{ base: 'column', md: 'row' }}>
          <Text fontSize="lg" fontWeight={'700'} mr={"10px"}>
            {language === 'DE' ? `Alle Schemata (${data ? data.length : 0})` : `All Schemas (${data ? data.length : 0})`}
          </Text>
          <Tooltip label={language === 'DE' ? 'Zeigt eine Liste aller Schemata, die vorliegen.' : 'Shows a list of all existing schemas.'} placement="top">
            <span>
              <InfoOutlineIcon cursor="pointer" />
            </span>
          </Tooltip>
          <Tooltip label={language === 'DE' ? 'Klicke hier, um ein neues Schema zu erstellen.' : 'Click here to create a new scheme.'} placement="top">
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
            {language === 'DE' ? 'Neues Schema' : 'New Schema'}
          </Button>
          </Tooltip>
        </Flex>
      </Card>
      <Flex w="100%" mb="20px" direction={{ base: 'column', md: 'row' }}>
        <SearchBar onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
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
          <option value="low_to_high">{language === 'DE' ? 'Aufsteigend' : 'Ascending'}</option>
          <option value="high_to_low">{language === 'DE' ? 'Absteigend' : 'Descending'}</option>
        </Select>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="20px">
        {isLoading ? (
          <>
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
            <TemplateCardSkeleton />
          </>
        ) : (
          sortedData?.map((data: { _id: number; name: string; description: string; }, index: any) => (
            <TemplateCard
              admin={true}
              key={index}
              link={`/einzelverarbeitung/${data._id}`} // Verwenden Sie die Schema-ID oder einen anderen eindeutigen Bezeichner
              illustration={<RiFileList2Fill width="20px" height="20px" color="inherit" />}
              name={language === 'DE' ? data.name : data.name} // Übersetzung, falls nötig
              description={language === 'DE' ? data.description : data.description} // Übersetzung, falls nötig
              edit={`/admin/edit-schema/${data._id}`}
            />
          ))
        )}
      </SimpleGrid>
    </Box>
  );
}