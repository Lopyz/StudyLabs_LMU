import { Box, Center, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function LoadingScreen() {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0.8)");
  const primaryColor = useColorModeValue("#393E46", "#A1A1A1");
  const secondaryColor = useColorModeValue("#75787E", "#393E46");

  return (
    <MotionBox
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg={bgColor}
      zIndex="9999"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.25 }}
      >
    <Center height="100%" flexDirection="column">
        <Box display="flex" justifyContent="center" alignItems="center" >
          <svg width="300" height="300">
            <polygon id="polygon-0" points="77.96,193.17 77.96,181.27 29.66,181.27 77.96,106.83 6.76,106.83 6.76,118.73 56.35,118.73 6.76,193.17 77.96,193.17" fill="#74777d" />
            <polygon id="polygon-1" points="136.58,106.83 175.74,193.17 162.00,193.17 136.93,136.76 111.85,193.17 98.11,193.17 136.58,106.83" fill="#393d46" />
            <polygon id="polygon-2" points="221.42,193.17 182.27,106.83 196.01,106.83 221.08,163.24 246.16,106.83 259.89,106.83 221.42,193.17" fill="#74777d" />
            <rect id="rectangle-0" x="281.34" y="106.83" width="11.90" height="86.32" fill="#393d46" />
            <style>
              {`
                #polygon-0,
                #polygon-1,
                #polygon-2,
                #rectangle-0 {
                  animation: zoomInAndOut 0.7s infinite ease-in-out;
                }
                #polygon-0 {
                  animation-delay: 0s;
                }
                #polygon-1 {
                  animation-delay: 0.03s;
                }
                #polygon-2 {
                  animation-delay: 0.06s;
                }
                #rectangle-0 {
                  animation-delay: 0.09s;
                }
                @keyframes zoomInAndOut {
                  0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                  50% {
                    transform: scale(0.96);
                    opacity: 0.5;
                  }
                }
              `}
            </style>
          </svg>
        </Box>
      </Center>
    </MotionBox>
  );
}
