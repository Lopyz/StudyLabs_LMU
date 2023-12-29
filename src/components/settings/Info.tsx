'use client';
// Chakra imports
import {
  Flex,
  FormControl,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useClerk } from '@clerk/nextjs';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';
import TextField from '@/components/fields/TextField';
import { Spinner } from '@chakra-ui/react';

export default function Settings() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  const { user } = useClerk();
  if (!user) {
    return (
      <div style={{ display: 'flex' }}>
        <Spinner 
          thickness="2px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="sm"
        />
      </div>
    );
  }
  return (
    <FormControl>
      <Card>
        <Flex direction="column" mb="40px">
          <Text
            fontSize="xl"
            color={textColorPrimary}
            mb="6px"
            fontWeight="bold"
          >
            Account Einstellungen
          </Text>
          <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
          Hier kannst du deine Benutzerkontoinformationen ändern.
          </Text>
        </Flex>
        <SimpleGrid
          columns={{ sm: 1, md: 2 }}
          spacing={{ base: '20px', xl: '20px' }}
        >
          <InputField
            mb="10px"
            me="30px"
            id="username"
            label="Benutzername"
            placeholder="Benutzername"
            value={user.username || ''}
          />
          <InputField
            mb="10px"
            id="email"
            label="Email Adresse"
            placeholder="Email Adresse"
            value={user.emailAddresses || ''}
          />
          <InputField
            mb="10px"
            me="30px"
            id="first_name"
            label="Vorname"
            placeholder="Vorname"
            value={user.firstName || ''}
          />
          <InputField
            mb="20px"
            id="last_name"
            label="Nachname"
            placeholder="Nachname"
            value={user.lastName || ''}
          />
        </SimpleGrid>
      </Card>
    </FormControl>
  );
}
