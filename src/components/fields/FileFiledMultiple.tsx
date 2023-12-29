import React, { useRef, useState } from 'react';
import { Flex, Box, Text, Button, Input, VStack, useColorModeValue, SimpleGrid } from '@chakra-ui/react';
import { MdAttachFile, MdClose } from 'react-icons/md';
import { useLanguage } from '@/contexts/LanguageContext';
import { te } from 'date-fns/locale';

interface FileFieldProps {
    onFilesChange: (files: File[]) => void;
    onFileRemove: (index: number) => void;
}

const FileField: React.FC<FileFieldProps> = ({ onFilesChange, onFileRemove }) => {
    const hoverColor = useColorModeValue("gray.300", "gray.700");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const textColor = useColorModeValue('navy.700', 'white');

    const handleBoxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);
        onFilesChange(selectedFiles);
    };

    const handleDragStatus = (status: boolean) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(status);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const selectedFiles = Array.from(e.dataTransfer.files);
        setFiles(selectedFiles);
        onFilesChange(selectedFiles);
    };

    const handleFileRemove = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFileRemove(index);
    };

    const removeAllFiles = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFiles([]);
        onFilesChange([]);
    };

    const { language } = useLanguage();

    return (
        <Box
            id="file"
            border="1px solid"
            borderRadius="14px"
            borderColor={isDragging ? 'green.400' : borderColor}
            p="15px 20px"
            mb="28px"
            color={textColor}
            _focus={{ borderColor: 'none' }}
            onDragOver={handleDragStatus(true)}
            onDragLeave={handleDragStatus(false)}
            onDrop={handleFileDrop}
            cursor="pointer"
            _hover={{ backgroundColor: isDragging ? 'rgba(0, 255, 0, 0.48)' : 'rgba(128, 156, 226, 0.48)' }}
            onClick={handleBoxClick}
        >
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <MdAttachFile size={24} />
                    <Text ml={2}>
                        {files.length > 0 ?
                            (`${language === 'DE' ? 'Ausgewählte Dateien' : 'Selected Files'} (${files.length})`) :
                            (language === 'DE' ? 'Dateien hierher ziehen oder klicken um auszuwählen' : 'Drag files here or click to select')
                        }
                    </Text>
                    {files.length > 0 && (
                        <Button ml={4}
                            onClick={removeAllFiles}
                            borderColor={borderColor}
                            color={textColor}>
                            {language === 'DE' ? 'Alle entfernen' : 'Remove All'}
                        </Button>
                    )}
                </Flex>
            </Flex>
            <Box mt={2} maxH="400px" overflowY="auto">
                <SimpleGrid columns={1} spacing={2}>
                    {files.map((file, index) => (
                        <Box
                            key={index}
                            p={2}
                            borderRadius="md"
                            _hover={{ backgroundColor: hoverColor }}
                            transition="background-color 0.2s ease"
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text fontSize="sm" isTruncated maxWidth="90%">
                                    {file.name}
                                </Text>
                                <Button onClick={(e) => handleFileRemove(e, index)} variant="unstyled">
                                    <MdClose color="red" size={16} />
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>
            <Input
                type="file"
                name="excel"
                ref={fileInputRef}
                onChange={handleFilesChange}
                multiple
                display="none"
            />
        </Box>
    );
};

export default FileField;
