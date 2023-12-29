import { Progress, Text, Flex, Box } from "@chakra-ui/react";
import { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '@/components/card/Card';
import Lottie from 'react-lottie';
import animationData from '../../public/file-searching.json';

export default function ProgressBar() {
    const [fact, setFact] = useState('');
    const [displayedFact, setDisplayedFact] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentFactIndex, setCurrentFactIndex] = useState(0);


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Sanftes Scrollenn
        });

    }, []);

    const facts = useMemo(() => {
        return [
        "Fun Fact: Wusstest du, dass der Eiffelturm bei Hitze um bis zu 15 cm wächst?",
        "Motivation: Jeder Schritt zählt auf deinem Weg zum Erfolg!",
        "Fun Fact: Bananen sind botanisch gesehen Beeren, während Erdbeeren es technisch nicht sind.",
        "Wusstest du? Ein durchschnittlicher Mensch verbringt etwa 26 Jahre des Lebens schlafend.",
        "Erstaunlich: Honig ist ein natürliches Lebensmittel, das niemals verdirbt.",
        "Fakt: Das Universum dehnt sich ständig aus und wird mit jeder Sekunde größer.",
        "Interessant: Die tiefste Stelle im Ozean ist der Marianengraben, tiefer als der Mount Everest hoch ist.",
        "Witzig: Flamingos können nur mit einem Bein schlafen!",
        "Überraschend: Ein Oktopus hat drei Herzen.",
        "Fakt: Ein Blitz ist fünfmal heißer als die Sonnenoberfläche.",
        "Wusstest du? Die Antarktis ist der größte Wüstenkontinent der Welt.",
        "Fun Fact: Schmetterlinge schmecken mit ihren Füßen.",
        "Wusstest du? Menschen und Bananen teilen etwa 50% ihrer DNA.",
        "Tipp: Die Great Wall of China ist die einzige von Menschen gebaute Struktur, die vom Mond aus sichtbar ist.",
        "Interessant: Ein Mensch kann ohne Essen länger überleben als ohne Schlaf.",
        "Fun Fact: Es gibt mehr Sterne im Universum als Sandkörner auf allen Stränden der Erde.",
        "Überraschend: Einige Wolken wiegen mehr als 500 Tonnen.",
        "Wusstest du? Einige Tiere können regenerieren, wie die Fähigkeit von Seesternen, verlorene Arme nachwachsen zu lassen.",
        "Fakt: Das menschliche Gehirn kann bis zu 70.000 Gedanken pro Tag verarbeiten.",
        "Interessant: Wasser bedeckt etwa 71% der Erdoberfläche.",
        "Witzig: Ameisen gähnen, wenn sie aufwachen.",
        "Motivation: Jeder Tag ist eine neue Gelegenheit, etwas Neues zu lernen."];
    }, []);

    const updateFact = useCallback(() => {
        setIsDeleting(false);
        setFact(facts[currentFactIndex]);
        setDisplayedFact('');
        setCurrentFactIndex(prevIndex => (prevIndex + 1) % facts.length);
    }, [currentFactIndex, facts]);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;

        if (isDeleting) {
            interval = setInterval(() => {
                setDisplayedFact((prev) => prev.slice(0, -1));

                if (displayedFact.length === 1) {
                    clearInterval(interval);
                    updateFact();
                }
            }, 20); // Speed of deleting
        } else {
            interval = setInterval(() => {
                if (displayedFact.length < fact.length) {
                    setDisplayedFact((prev) => prev + fact[prev.length]);
                }

                if (displayedFact.length === fact.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsDeleting(true), 5000); // 5 seconds pause before deleting
                }
            }, 20); // Speed of typing
        }

        return () => clearInterval(interval);
    }, [displayedFact, isDeleting, fact, updateFact]); // added updateFact to dependency array

    useEffect(() => {
        setFact(facts[currentFactIndex]);
    }, [currentFactIndex, facts]); // added facts to dependency array

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Flex
            mt={{ base: '50px', md: '50px', xl: '0px' }}
            w="100%"
            maxW="716px"
            direction="column" >
            <Card>
                <Text fontSize="xl" fontWeight={'700'} mb={2}>
                    Fun Facts
                </Text>
                <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb={{ base: "-50", md: "-75px" }}>
                    {displayedFact}
                </Text>
                <Box maxW="500" alignSelf={'center'}>
                    <Lottie options={defaultOptions} />
                </Box>
                <Progress isIndeterminate hasStripe w="full" height='10px' />
            </Card>
        </Flex>
    )
}
