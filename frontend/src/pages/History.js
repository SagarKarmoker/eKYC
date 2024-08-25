import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Container,
    Divider,
    Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import backgroundImage from "../img/loginBackground7.png";

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios
            .post("https://ekyc-4ash.onrender.com/getAllTxs", {
                nid: localStorage.getItem("nidNumber"),
            })
            .then((res) => {
                setHistory(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Box
            bgImage={`url(${backgroundImage})`}
            bgSize="cover"
            bgPosition="center"
            minH="100vh"
            p={5}
        >
            <Box bg="transparent" rounded="lg" py={5} mt={20}>
                <Container bg="transparent" rounded="lg" p={5} maxW="container.lg">
                    <Flex justify="center" mb={8}>
                        <Text fontSize="4xl" fontWeight="extrabold" color="[#202020]">
                            Transaction History
                        </Text>
                    </Flex>
                    <VStack spacing={4} align="stretch">
                        {history.map((tx, index) => (
                            <Box
                                key={index}
                                bg="gray.100" // Background color with alpha
                                rounded="lg"
                                p={5}
                                w="full"
                                boxShadow="md"
                            >
                                <HStack spacing={4} justify="space-between">
                                    <Icon as={CheckCircleIcon} color="green.500" boxSize={8} />
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        className="text-center text-dark-grey-900"
                                    >
                                        {tx.reason}
                                    </Text>
                                </HStack>
                                <Divider my={4} />
                                <VStack align="start" spacing={2}>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        <InfoIcon mr={2} />
                                        Transaction Hash: {tx.hash}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        <InfoIcon mr={2} />
                                        From: {tx.from}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        <InfoIcon mr={2} />
                                        To: {tx.to}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        <InfoIcon mr={2} />
                                        Nonce: {tx.nonce}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                                        <InfoIcon mr={2} />
                                        Gas Price: {tx.gasPrice}
                                    </Text>
                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                </Container>
            </Box>
        </Box>
    );
}

export default History;
