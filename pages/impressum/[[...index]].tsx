'use client'

/*eslint-disable*/
import { Box, Flex, Text, Link } from '@chakra-ui/react';
import Card from '../../src/components/card/Card';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbarAuth/NavbarAdminAuth';

function Impressum() {
    const { language } = useLanguage();
    return (
        <Box>
            <Navbar
                logoText={language === 'DE' ? 'Impressum' : 'Legal Notice'}
                brandText={language === 'DE' ? 'Impressum' : 'Legal Notice'}
                secondary={true}
            />
            <Flex
                mx="auto"
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                pt={{ base: '70px', md: '100px' }}
            >
                <Card maxW="716px">
                    <Flex flexDirection="column" pl="40px" pr="40px" pb="40px" pt="40px">
                        <Text fontWeight="bold" fontSize="2xl" textAlign={"center"}>Impressum</Text>
                        <Text pt={4} fontWeight="bold">Diensteanbieter</Text>
                        <Text>Zavi AI GbR</Text>
                        <Text>Sömmeringstraße 21</Text>
                        <Text>50823 Köln</Text>
                        <Text>Deutschland</Text>
                        <Text pt={4} fontWeight="bold">Kontaktmöglichkeiten</Text>
                        <Text>E-Mail Adresse: <Link href="mailto:support@zavi-ai.com" color="blue.500">support@zavi-ai.com</Link></Text>
                        <Text pt={4} fontWeight="bold">Vertretungsberechtigte Personen</Text>
                        <Text>Vertretungsberechtigt: Karim Zibo, Matti Vennen, David Miesner</Text>
                        <Text pt={4} fontWeight="bold">Angaben zum Unternehmen</Text>
                        <Text>Geschäftsbereich: Sonstige Softwareentwicklung WZ2008 – 62.01.9</Text>
                        <Text>Steuernummer: 217/5870/1875</Text>
                        <Text>USt-IdNr: DE361486712</Text>
                        <Text pt={4} fontWeight="bold">Online-Streitbeilegung (OS)</Text>
                        <Text>Online-Streitbeilegung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter <Link href="https://ec.europa.eu/consumers/odr/" isExternal color="blue.500">https://ec.europa.eu/consumers/odr/</Link> finden. Verbraucher haben die Möglichkeit, diese Plattform für die Beilegung ihrer Streitigkeiten zu nutzen.</Text>
                        <Text pt={4} fontWeight="bold">Social Media und andere Onlinepräsenzen</Text>
                        <Text>Dieses Impressum gilt auch für die folgenden Social-Media-Präsenzen und Onlineprofile: <Link href="https://www.linkedin.com/company/zavi-ai/about/" isExternal color="blue.500">https://www.linkedin.com/company/zavi-ai/about/</Link></Text>
                        <Text pt={4} fontWeight="bold">Haftungs- und Schutzrechtshinweise</Text>
                        <Text>Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, dienen jedoch nur der Information und entfalten keine rechtlich bindende Wirkung, sofern es sich nicht umgesetzlich verpflichtende Informationen (z.B. das Impressum, die Datenschutzerklärung, AGB oder verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen, soweit vertragliche Verpflichtungen unberührt bleiben. Alle Angebote sind freibleibend und unverbindlich.</Text>
                    </Flex>
                </Card>
            </Flex>
            <Footer />
        </Box>
    );
}

export default Impressum;
