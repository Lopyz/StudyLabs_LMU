'use client';

import React from 'react';
import { SignUp } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { Box, useColorModeValue, Flex } from "@chakra-ui/react";
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbarAuth/NavbarAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/sign-in');
  }, [router]);
  const clerkTheme = useColorModeValue(undefined, dark);
  const { language } = useLanguage();
  return null;
  <Box>
    <Navbar
      logoText={language === 'DE' ? 'Registrieren' : 'Sign-In'}
      brandText={language === 'DE' ? 'Registrieren' : 'Sign-In'}
      secondary={true}
    />
    <Flex
      mx="auto"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      pt={{ base: '100px', md: '100px' }}
    >
      <SignUp
        appearance={{
          baseTheme: clerkTheme,
        }}
      />
    </Flex>
    <Footer />
  </Box>
}

export default SignUpPage;
