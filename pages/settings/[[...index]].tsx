import React from 'react';
import { UserProfile } from '@clerk/nextjs';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { dark } from '@clerk/themes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Settings() {
  const router = useRouter();

  useEffect(() => {
    router.push('/my-tasks');
  }, [router]);

  const clerkTheme = useColorModeValue(undefined, dark);
  return null;
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <Flex align="center" direction={{ base: 'column' }}>
        <UserProfile
          appearance={{
            baseTheme: clerkTheme,
          }} />
      </Flex>
    </Box>
}
