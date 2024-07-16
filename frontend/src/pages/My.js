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
import backgroundImage from "../img/loginBackground7.png"; // Adjust the path as necessary

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
        console.log(response.data.verifiers);
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
    <Box
      backgroundImage={`url(${backgroundImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
      minH="100vh"
      py="5"
    >
      <Flex className="container mx-auto bg-transparent rounded-lg p-5">
        <Box
          className="flex flex-col w-1/3 pr-5"
          display="flex"
          alignItems="center"
        >
          <Box className="mt-10 bg-[#f5f5f5] p-5 rounded-lg" position={"fixed"}>
            <form onSubmit={handleSubmit}>
              <Text className="mt-6 mb-6 text-4xl font-extrabold text-[#202020] text-center">
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
        <Center height="700px">
          <Divider orientation="vertical" style={{ borderColor: '#ff735c' }} />
        </Center>
        <Box className="flex flex-col w-2/3 pl-5">
          <Box className="mt-6 bg-transparent p-5 rounded-lg">
            <Text className="mt-6 mb-6 text-4xl font-extrabold text-center text-[#202020]">
              Given Access Verifiers
            </Text>
            <Table className="min-w-full bg-[#f5f5f5]">
              <Thead className="bg-gray-200 text-[#202020] uppercase text-sm leading-normal">
                <Tr>
                  <Th className="py-3 px-6 text-left">SL No</Th>
                  <Th className="py-3 px-6 text-left">Org Name</Th>
                  <Th className="py-3 px-6 text-left">Org ID</Th>
                  <Th className="py-3 px-6 text-left">Org Address</Th>
                  <Th className="py-3 px-6 text-left">Action</Th>
                </Tr>
              </Thead>
              <Tbody className="text-[#202020] text-sm font-light">
                {verifierList.map((verifier, index) => (
                  <Tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-100">
                    <Td className="py-3 px-6 text-left">{index + 1}</Td>
                    <Td className="py-3 px-6 text-left">{verifier.name}</Td>
                    <Td className="py-3 px-6 text-left">{verifier.orgId}</Td>
                    <Td className="py-3 px-6 text-left">{verifier.verifier}</Td>
                    <Td className="py-3 px-6 text-left">
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
