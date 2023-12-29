'use client';

import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { Box, useColorModeValue, Flex } from "@chakra-ui/react";
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbarAuth/NavbarAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';

function SignInPage() {
  const clerkTheme = useColorModeValue(undefined, dark);
  const { language } = useLanguage();
  return (
    <Box>
      <Navbar
        logoText={language === 'DE' ? 'Einloggen' : 'Sign-In'}
        brandText={language === 'DE' ? 'Einloggen' : 'Sign-In'}
        secondary={true}
      />
      <Flex
        mx="auto"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        pt={{ base: '70px', md: '100px' }}
      >
        <SignIn
          appearance={{
            baseTheme: clerkTheme,
          }}
        />
      </Flex>
      <Footer />
    </Box>
  );
}

export default SignInPage;
