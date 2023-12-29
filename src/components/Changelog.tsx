import { Box, CloseButton, Text, useColorModeValue, Divider, ScaleFade, VStack, Fade, border } from "@chakra-ui/react";
import { useState } from "react";
import Card from "./card/Card";
const ChangelogEntry = ({ date, logs }: { date: string, logs: string[] }) => {
    const [show, setShow] = useState(true);

    return (
        <Card
            mb="4"
            maxW="716px"
            alignSelf="center">
            <Text cursor="pointer" fontWeight="bold" onClick={() => setShow(!show)}>
                {date} {show ? "▼" : "►"}
            </Text>
            <Box
                style={{
                    overflow: 'hidden',
                    height: show ? 'auto' : '0px',
                    transition: 'height 0.3s ease'
                }}
            >
                <ScaleFade initialScale={0.9} in={show}>
                    {logs.map((log, idx) => (
                        <Text ml={4} key={idx}>{log}</Text>
                    ))}
                </ScaleFade>
            </Box>
        </Card>
    );
};

const Changelog = ({ onClose }: { onClose: () => void }) => {
    const bgColor = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(50, 50, 50, 0.95)");
    const textColor = useColorModeValue("gray.800", "gray.200");
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

    return (
        <Card
            position="absolute"
            bgColor={bgColor}
            borderColor={borderColor}
            borderWidth="2px"
            borderRadius="xl"
            padding="4"
            maxW="716px"
            w="80%"
            overflowY="auto"
            zIndex={9999}
            left="50%" // Set left to 50% of the parent container
            transform="translate(-50%)" // Shift the element back by its own 50% width and height
        >
            <Box justifyContent="space-between" alignItems="center" textAlign="center" mb="2">
                <Text fontSize="3xl" fontWeight="bold" color={textColor}>Changelog StudyLabs Prod</Text>
                <CloseButton size="lg" onClick={onClose} />
            </Box>
            <Divider mb="4" />
            <ChangelogEntry date="24-27.11.2023" logs={[
                "- Added Changelog",
            ]} />
        </Card>
    );
}

export default Changelog;
