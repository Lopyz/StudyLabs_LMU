'use client';
import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import { deDE, enUS } from "@clerk/localizations";
import { useLanguage } from '../src/contexts/LanguageContext';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import Head from 'next/head';
import { useAdminProtectionFrontend } from '@/utils/adminProtectionFrontend';
import { UserProvider } from '@/contexts/userContext';
import { usePageLoading } from '@/hooks/usePageLoading';
//import ChangelogHandler from '@/utils/changelogHandler';
import LoadingScreen from '@/components/LoadingScreen';
import { DynamicLanguageProvider } from '../src/contexts/LanguageContext';
import { getBrandText, useGetPageName, getDynamicTitle } from '@/utils/pageUtils';
import { useState, useEffect } from 'react';

interface ClerkLocalizedProviderProps {
  children: React.ReactNode;
  pageProps: any;
}

// ------------- ClerkLocalizedProvider -------------

function ClerkLocalizedProvider({ children, pageProps }: ClerkLocalizedProviderProps) {
  const { language } = useLanguage();
  return (
    <ClerkProvider localization={language === 'DE' ? deDE : enUS} {...pageProps}>
      {children}
    </ClerkProvider>
  );
}

// ------------- Admin Protection for Sidebar -------------

function EnhancedSidebar() {
  const isAdmin = useAdminProtectionFrontend();
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  useEffect(() => {
    setIsAdminChecked(true);
  }, [isAdmin]);

  const accessibleRoutes = routes.filter(route => {
    if (route.name === 'Admin Konsole' || route.name === 'Admin Console') {
      return isAdmin;
    }
    return true;
  });

  if (!isAdminChecked) {
    return null; 
  }

  return (
    <Sidebar routes={accessibleRoutes} />
  )
}

// ------------- Dynamic Page Name -------------


function App({ Component, pageProps }: AppProps<{}>) {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isPageLoading } = usePageLoading();
  const { schemas} = useGetPageName();
  const brandText = getBrandText(pathname, schemas);

  return (
    <DynamicLanguageProvider>
      <ClerkLocalizedProvider pageProps={pageProps}>
        <ChakraProvider theme={theme}>
          <>
            {isPageLoading ? (
              <LoadingScreen />
            ) : (
                <UserProvider>
                  <Head>
                    <title>{getDynamicTitle(pathname, schemas)}</title>
                  </Head>
                  {pathname && (pathname.includes('sign-up') || pathname.includes('sign-in') || pathname.includes('impressum') || pathname.includes('datenschutz')) ? (
                    <Component {...pageProps} />
                  ) : (
                    <Box>
                      <EnhancedSidebar/>
                      <Box
                        pt={{ base: '60px', md: '100px' }}
                        float="right"
                        minHeight="100vh"
                        height="100%"
                        overflow="auto"
                        position="relative"
                        maxHeight="100%"
                        w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                        maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                        transitionDuration=".2s, .2s, .35s"
                        transitionProperty="top, bottom, width"
                        transitionTimingFunction="linear, linear, ease"
                      >
                        <Portal>
                          <Box>
                            <Navbar
                              onOpen={onOpen}
                              logoText={'StudyLabs'}
                              brandText={brandText}
                              secondary={getActiveNavbar(routes, pathname)}
                            />
                          </Box>
                        </Portal>
                        <Box
                          mx="auto"
                          p={{ base: '20px', md: '30px' }}
                          pe="20px"
                          minH="100vh"
                          pt="50px"
                        >
                          <Component {...pageProps} />
                        </Box>
                        <Box>
                          <Footer />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </UserProvider>
            )}
          </>
        </ChakraProvider>
      </ClerkLocalizedProvider>
    </DynamicLanguageProvider>
  );
}

export default App;
