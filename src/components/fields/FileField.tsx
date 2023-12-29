import React, { useRef, useState } from 'react';
import { Flex, Box, Text, Button, Input, useColorModeValue } from '@chakra-ui/react';
import { MdAttachFile, MdClose } from 'react-icons/md';
import { useLanguage } from '../../../src/contexts/LanguageContext';

interface FileFieldProps {
    onFileChange: (file: File | null) => void;
    onFileRemove: () => void; // Hinzugefügt
}

const FileField: React.FC<FileFieldProps> = ({ onFileChange, onFileRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
    const textColor = useColorModeValue('navy.700', 'white');

    // Handlers
    const handleBoxClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            onFileChange(selectedFile);
        }
    };
    const handleDragStatus = (status: boolean) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(status);
    };
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const selectedFile = e.dataTransfer.items[0]?.getAsFile();
        if (selectedFile) {
            setFile(selectedFile);
            onFileChange(selectedFile);
        }
    };
    const handleFileRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onFileChange(null);
        onFileRemove(); // Hier hinzugefügt
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }


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
            onClick={handleBoxClick}
            cursor="pointer"
            _hover={{ backgroundColor: isDragging ? 'rgba(0, 255, 0, 0.48)' : 'rgba(128, 156, 226, 0.48)' }}
        >
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <MdAttachFile size={24} />
                    <Text ml={2}>
                        {file ? file.name : (language === 'DE' ? 'Datei hierher ziehen oder klicken um auszuwählen' : 'Drag file here or click to select')}
                    </Text>
                </Flex>
                {file && (
                    <Button onClick={handleFileRemove} variant="unstyled" title={language === 'DE' ? 'Datei entfernen' : 'Remove file'}>
                        <MdClose color="red" size={24} />
                    </Button>
                )}
            </Flex>
            <Input
                type="file"
                name="excel"
                ref={fileInputRef}
                onChange={handleFileChange}
                display="none"
            />
        </Box>
    );
};

export default FileField;
