import React, { useEffect, useRef } from 'react';
import { Flex, Box, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown'; // Importiert ReactMarkdown
import * as marked from 'marked';
import LoadingScreen from './LoadingScreen';
export default function MessageBox(props: { output: string }) {
  const { language } = useLanguage();
  const { output } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgColorLight = 'linear-gradient(15.46deg, #3556CB 26.3%, #A3C2FA 86.4%)';
  const bgColorDark = 'linear-gradient(15.46deg, #2D455C 26.3%, #3556CB 86.4%)';
  const bgColor = useColorModeValue(bgColorLight, bgColorDark);
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const tableRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (tableRef.current) {
      const tables = tableRef.current.querySelectorAll('table');
      tables.forEach((table: HTMLTableElement) => {
        // Prüfen, ob ein colgroup bereits existiert
        if (!table.querySelector('colgroup')) {
          const colgroup = document.createElement('colgroup');
          colgroup.innerHTML = `
            <col style="width: 25%;">
            <col style="width: 25%;">
            <col style="width: 50%;">
          `;
          table.prepend(colgroup);
        }
      });
    }
  }, [output, language]);

  
  return (
    <Flex
      width="100%"
      flexWrap="wrap"
      p="15px 20px"
      color={textColor}
      borderColor={borderColor}
      borderRadius="10px"
      fontSize={fontSize}
      fontWeight="500"
      mb="28px"
      overflow="auto scroll"
    >
      <Box
        ref={tableRef}
        className="markdown-output"
        dangerouslySetInnerHTML={{ __html: marked.parse(output) }}
        sx={{
          'table': {
            borderCollapse: 'collapse',
            marginBottom: '60px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
            tableLayout: 'fixed',
          },
          'th, td': {
            padding: '15px 20px',
            textAlign: 'left',
            transition: 'background-color 0.3s, transform 0.3s',
            borderRight: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
          },
          'tr:last-child td': {
            borderBottom: 'none',
          },
          'th:last-child, td:last-child': {
            borderRight: 'none',
          },
          'th': {
            background: bgColor,
            color: 'white',
            fontWeight: '600',
          },
        }}
      />
    </Flex>
  );
}