import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useToast,
  IconButton,
  Divider,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

function EthereumAddressInput() {
  const [verifier, setVerifier] = useState("");
  const [verifierList, setVerifierList] = useState([]);
  const nid = localStorage.getItem("nidNumber");
  const toast = useToast();

  useEffect(() => {
    // Fetch the list of verifiers on component mount
    const fetchVerifiers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/verifiers?nid=${nid}`);
        console.log(response.data.verifiers)
        setVerifierList(response.data.verifiers);
      } catch (error) {
        console.error("Error fetching verifiers:", error);
      }
    };

    fetchVerifiers();
  }, [nid, verifierList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/grantVerifier`, {
        verifier,
        nid,
      });
      toast({
        title: "KYC Approved Successfully",
        description: `Verifier: ${verifier}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setVerifier("");
      setVerifierList([...verifierList, verifier]);
    } catch (error) {
      console.error("Error submitting KYC Approved:", error);
      toast({
        title: "Error",
        description: "Failed to approve KYC.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRevoke = async (verifierToRevoke) => {
    try {
      const response = await axios.post(`http://localhost:3001/revokeVerifier`, {
        verifier: verifierToRevoke,
        nid,
      });
      toast({
        title: "KYC Revoked Successfully",
        description: `Verifier: ${verifierToRevoke}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setVerifierList(verifierList.filter((v) => v !== verifierToRevoke));
    } catch (error) {
      console.error("Error submitting KYC Revoke:", error);
      toast({
        title: "Error",
        description: "Failed to revoke KYC.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="bg-white rounded-lg py-5 mt-20">
      <Flex className="container mx-auto bg-white rounded-lg p-5">
        <Box className="flex flex-col w-1/3 pr-5">
          <Box className="bg-white p-5 rounded-lg ">
            <form onSubmit={handleSubmit}>
              <Text className="mb-6 text-4xl font-extrabold text-gray-900">
                Verifier Address
              </Text>
              <Input
                type="text"
                value={verifier}
                onChange={(e) => setVerifier(e.target.value)}
                placeholder="Enter your Verifier address"
                className="mb-7"
              />
              <Flex gap="2" justify="center">
                <Button type="submit" colorScheme="green" leftIcon={<CheckIcon />}>
                  Approve
                </Button>
                <Button
                  type="button"
                  colorScheme="red"
                  leftIcon={<CloseIcon />}
                  onClick={() => handleRevoke(verifier)}
                >
                  Revoke
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>
        <Center height='700px'>
          <Divider orientation='vertical' />
        </Center>
        <Box className="flex flex-col w-2/3 pl-5">
          <Box className="bg-white p-5 rounded-lg">
            <Text className="mb-6 text-4xl font-extrabold text-center text-gray-900">
              Given Access Verifiers
            </Text>
            <Table variant="simple">
              <Thead>
                <Tr>
                <Th>SL No</Th>
                <Th>Org Name</Th>
                <Th>Org ID</Th>
                  <Th>Org Address</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {verifierList.map((verifier, index) => (
                  <Tr key={index}>
                    <Td>{index+1}</Td>
                    <Td>{verifier.name}</Td>
                    <Td>{verifier.orgId}</Td>
                    <Td>{verifier.verifier}</Td>
                    <Td>
                      <IconButton
                        aria-label="Revoke Verifier"
                        icon={<CloseIcon />}
                        colorScheme="red"
                        onClick={() => handleRevoke(verifier.verifier)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default EthereumAddressInput;
