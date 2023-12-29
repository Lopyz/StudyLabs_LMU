'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBoxChat';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  Icon,
  Image,
  Img,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Box, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../../../public/img/chat/bg-image.png';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import { useClerk } from '@clerk/nextjs';
import { useRef } from 'react';

type ChatMessage = {
  sender: 'User' | 'AI';
  message: string;
  isStreaming?: boolean; // Flag to indicate if the message is still receiving streamed content
};

export default function Chat(props: {
  chatContext: { exercise_id: string, exercise_text: string, solution_correct: string, solution_student: string, points_achieved: number, points_achievable: number, feedback: string },
  uuid?: string, originId: string, filename: string, schemaId: string
}) {
  const { user } = useClerk();
  const { chatContext } = props;
  const { language } = useLanguage();
  const chatContainerRef = useRef<HTMLDivElement>(null);  // Referenz für den Chat-Container

  // --------------------- Chat History ---------------------
  // Chat history state to store an array of messages
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentStreamingOutput, setCurrentStreamingOutput] = useState<string>('');



  const addMessageToHistory = (sender: 'User' | 'AI', message: string) => {
    setChatHistory(prevHistory => [...prevHistory, { sender, message }]);
  };

  // --------------------- Chat History End---------------------


  // *** If you use .env.local variable for your API key, method which we recommend, use the apiKey variable commented below
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [requestCount, setRequestCount] = useState<number>(0);
  const [initialInputCode, setInitialInputCode] = useState<string>('');
  // Response message
  const [outputCode, setOutputCode] = useState<string>('');
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo-16k');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const toast = useToast();
  const [welcomeMessageStreaming, setWelcomeMessageStreaming] = useState('');
  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTranslate();
    }
  };


  useEffect(() => {
  }, [props.originId, props.filename, props.schemaId]);


  // Wenn props.originId ändert, zurücksetzen des Anfragen-Counters

  useEffect(() => {
    setChatHistory([]);
    setIsFirstMessage(true);
    if (props.uuid) {
      let welcomeMessage = `Hallo ich bin dein Lernassistent, wie kann ich dir bei der "${chatContext.exercise_id}" weiterhelfen?`;
      let currentMessage = '';
      const interval = setInterval(() => {
        if (welcomeMessage.length > currentMessage.length) {
          currentMessage += welcomeMessage[currentMessage.length];
          setWelcomeMessageStreaming(currentMessage);
        } else {
          setChatHistory(prevHistory => [...prevHistory, { sender: 'AI', message: currentMessage }]);
          setWelcomeMessageStreaming('');
          clearInterval(interval);
        }
      }, 10);
    }
  }, [props.uuid, chatContext.exercise_id]);

  useEffect(() => {
    // Wenn props.originId ändert, zurücksetzen des Anfragen-Counters
    setRequestCount(0);
  }, [props.originId]);


  useEffect(() => {
    if (chatContext?.exercise_text && chatContext?.solution_student && chatContext?.feedback && chatContext?.solution_correct && chatContext?.points_achieved && chatContext?.points_achievable) {
      let initialInput = `Aufgabenstellung: ${chatContext.exercise_text}\n` +
        `Musterlösung: ${chatContext.solution_correct}\n` +
        `Erreichbare Punkte: ${chatContext.points_achievable}\n` +
        `Erreichte Punkte: ${chatContext.points_achieved}\n` +
        `Schülerantwort: ${chatContext.solution_student}\n` +
        `Feedback: ${chatContext.feedback}\n\n`

      // Speichern Sie den initialen Chatkontext in einer Variable, anstatt ihn ins Eingabefeld zu setzen
      setInitialInputCode(initialInput);
    }
  }, [chatContext]);

  // --------------------- Chat Bubbles for Input and Output ---------------------

  const MessageBubble = ({ sender, message }: ChatMessage) => (
    <Flex w="100%" align={'center'}>
      <Flex
        borderRadius="full"
        justify="center"
        align="center"
        bg={sender === 'User' ? 'transparent' : 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%)'}
        border={sender === 'User' ? '1px solid' : 'none'}
        borderColor={borderColor}
        me="20px"
        h="40px"
        minH="40px"
        minW="40px"
      >
        <Icon
          as={sender === 'User' ? MdPerson : MdAutoAwesome}
          width="20px"
          height="20px"
          color={sender === 'User' ? brandColor : 'white'}
        />
      </Flex>
      {sender === 'User' ? (
        <Flex
          p="22px"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="14px"
          w="100%"
          zIndex={'2'}
        >
          <Text
            color={textColor}
            fontWeight="600"
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight={{ base: '24px', md: '26px' }}
          >
            {message}
          </Text>
        </Flex>
      ) : (
        <MessageBoxChat output={message} />
      )}
    </Flex>
  );

  // --------------------- Chat Bubbles for Input and Output End ---------------------


  //@ts-ignore
  const formatChatContext = (context) => {
    return `Kontext:\n` +
      `Aufgabenstellung: ${context.exercise_text}\n` +
      `Musterlösung: ${context.solution_correct}\n` +
      `Erreichbare Punkte: ${context.points_achievable}\n` +
      `Erreichte Punkte: ${context.points_achieved}\n` +
      `Schülerantwort: ${context.solution_student}\n` +
      `Feedback: ${context.feedback}\n\n`;
  };

  // Verwendung der Funktion, um den formatierten Text zu speichern
  const chatContextText = formatChatContext(chatContext);
  const messageToSave = isFirstMessage ? `${inputCode}\n\n${chatContextText}` : inputCode;

  const handleTranslate = async () => {
    const clerkId = user?.id;
    const { uuid, originId, filename, schemaId } = props;
    const { exercise_id } = chatContext;


    if (requestCount >= 8) {
      toast({
        title: language === 'DE' ? 'Limit erreicht.' : 'limit Reached.',
        description: language === 'DE' ? 'Du hast das Chat-Anfragelimit erreicht.' : 'You have reached the chat-request limit.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
      return;
    }

    //fügt die Nutzer-Nachricht dem Chatverlauf hinzu
    addMessageToHistory('User', inputCode);

    // Speichern der Nutzer-Nachricht in der Datenbank Zuerst mit Kontext und ab dem zweiten mal nur der Input aus der Leiste
    await fetch('/api/db/chat/getsetChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId, uuid, originId, filename, schemaId, exercise_id, message: messageToSave, sender: "User" })
    });

    if (isFirstMessage) {
      setIsFirstMessage(false);
    }


    // Abrufen des gesamten Chatverlaufs aus der Datenbank
    const chatResponse = await fetch(`/api/db/chat/getsetChat?clerkId=${clerkId}&uuid=${uuid}`);
    const chatData = await chatResponse.json();

    // Contend für AI Anfrage beim ersten mal nur input aus der leiste + kontext, Ab dem zweiten senden nur noch den Verlauf aus database fetchen

    const fullMessage = isFirstMessage
      //@ts-ignore
      ? `${inputCode}\n\n${chatContextText}`
      //@ts-ignore
      : `${chatData.messages?.map(msg => `${msg.sender}: ${msg.message}`).join("\n")}\n\n`;

    setInputOnSubmit(inputCode);


    const maxCodeLength = model === 'gpt-3.5-turbo-16k' ? 700 : 700;

    if (!inputCode) {
      alert('Please enter your subject.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(`Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`);
      return;
    }

    setOutputCode(' ');
    setLoading(true);
    setInputCode('');
    const controller = new AbortController();

    const body: ChatBody = {
      inputCode: fullMessage,
      model,
    };

    const response = await fetch('../api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    const data = response.body;
    //@ts-ignore
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let allChunks = '';

    // This function gets called with every chunk received from the OpenAI API
    const handleStreamingOutput = (chunk: string) => {
      setCurrentStreamingOutput((prev) => prev + chunk);
    };

    // This function is called when the streaming output is done
    const finalizeStreamingOutput = () => {
      addMessageToHistory('AI', allChunks); // Ensure to use the complete message string
      setCurrentStreamingOutput(''); // Reset the current streaming output
    };

    while (!done) {
      setLoading(true);
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      allChunks += chunkValue;
      handleStreamingOutput(chunkValue);
    }

    finalizeStreamingOutput();

    // Speichern der AI-Antwort in der Datenbank
    await fetch('/api/db/chat/getsetChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId, uuid, originId, filename, schemaId, exercise_id, message: allChunks, sender: "AI" })
    });

    setLoading(false);
    setRequestCount((prevCount) => prevCount + 1);
    setIsFirstMessage(false);

  };

  const handleChange = (event: any) => {
    setInputCode(event.target.value); // Aktualisieren des inputCode bei Benutzereingabe
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [chatHistory, currentStreamingOutput]);


  return (
    <Flex
      w="100%"
      pt={{ base: '20px', md: '20px' }}
      direction="column"
      position="relative"
      h="60vh"
      >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '60vh', '2xl': '60vh' }}
        maxW="716px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={outputCode ? '0px' : 'auto'}>
        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          h="100%"
          mx="auto"
          overflowY="auto"
          display='flex'
        >
          {/* Iput/Output Display */}
          <VStack w="100%" align="stretch" spacing={4} overflowY="auto" ref={chatContainerRef}>
            {chatHistory.map((item, index) => (
              <MessageBubble
                key={index} // Bedenken Sie, dass es besser wäre, eindeutige Identifikatoren anstelle von Indizes zu verwenden, wenn möglich
                sender={item.sender}
                message={item.message}
              />
            ))}
            {/* Hier rendern wir die "streamende" Willkommensnachricht separat */}
            {welcomeMessageStreaming && (
              <MessageBubble
                key="welcome-streaming" // Dieser Schlüssel kann konstant sein, da es sich um eine temporäre Nachricht handelt
                sender="AI"
                message={welcomeMessageStreaming}
                isStreaming={true}
              />
            )}
            {/* We render the current streaming message separately */}
            {currentStreamingOutput && (
              <MessageBubble
                key="streaming" // This key can be constant since it's a temporary message
                sender="AI"
                message={currentStreamingOutput}
                isStreaming={true}
              /> 
            )}
          </VStack>
        </Flex>

        {/* Chat Input */}
        <Flex
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            onKeyDown={handleKeyDown}
            placeholder={language === 'DE' ? 'Stelle eine Frage über deine Aufgabe...' : 'Ask a question about your task...'}
            value={inputCode}
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #3556CB 26.3%, #809CE2 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
            disabled={requestCount >= 8}
          >
            {language === 'DE' ? 'Senden' : 'Send'}
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="10px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray} mr="5px">
            {language === 'DE' ? 'Verbleibende Chat Anfragen: ' : 'Remaining Chat Requests: '}
            <Text as="span" fontWeight="bold">
              {8 - requestCount}
            </Text>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
