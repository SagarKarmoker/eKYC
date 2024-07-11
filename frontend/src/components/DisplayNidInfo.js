import React from 'react';
import { Box, Text, Button, Flex, VStack, HStack, Divider, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

function DisplayNidInfo({ nidInfo }) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);  
    };

    return (
        <Flex align="center" justify="center" bg="gray-50">
            <Box className="p-8 bg-white rounded-lg shadow-xl" maxWidth="500px" width="full">
                <VStack spacing={4} align="flex-start">
                    <Flex align="center" width="full">
                        <Icon as={ArrowBackIcon} w={6} h={6} onClick={handleBack} className="cursor-pointer" />
                        <Text className="text-2xl font-bold ml-4">NID Information</Text>
                    </Flex>
                    <Divider />
                    <VStack align="stretch" spacing={4}>
                        <HStack>
                            <Text className="font-semibold">Full Name (English):</Text>
                            <Text>{nidInfo.fullNameEnglish}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Full Name (Bangla):</Text>
                            <Text>{nidInfo.fullNameBangla}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Father's Name:</Text>
                            <Text>{nidInfo.father}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Mother's Name:</Text>
                            <Text>{nidInfo.mother}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Date of Birth:</Text>
                            <Text>{nidInfo.dateOfBirth}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">NID Number:</Text>
                            <Text>{nidInfo.nidNumber}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Address:</Text>
                            <Text>{nidInfo.address}</Text>
                        </HStack>
                        <HStack>
                            <Text className="font-semibold">Blood Group:</Text>
                            <Text>{nidInfo.bloodGroup || 'N/A'}</Text>
                        </HStack>
                    </VStack>
                </VStack>
                <Flex justify="center" mt={6}>
                    <Button colorScheme="teal" onClick={handleBack}>
                        Back
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default DisplayNidInfo;
