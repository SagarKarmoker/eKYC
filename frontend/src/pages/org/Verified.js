import { useState, useEffect } from 'react'
import {
    Button, useToast,
    Divider, Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    AbsoluteCenter
} from '@chakra-ui/react'
import axios from 'axios'
import backgroundImage from "../../img/loginBackground7.png";
import ShowKycDetails from '../../components/ShowKycDetails'

function Verified() {
    const [walletAddress, setWalletAddress] = useState("");
    const userRole = localStorage.getItem("role");
    const orgId = localStorage.getItem("nidNumber");
    const toast = useToast()
    const [citizenAddr, setCitizenAddr] = useState('')
    const [nid, setNid] = useState('')
    const [citizensAddr, setCitizensAddr] = useState([])
    const [isAddr, setIsAddr] = useState(false)
    const [isNID, setIsNID] = useState(false)
    const [isClicked, setIsClicked] = useState(false) // to change table state
    const [kycData, setKycData] = useState(null) // to store fetched data

    const handleUsingAddr = async () => {
        try {
            if (!citizenAddr) {
                return toast({
                    title: 'Error',
                    description: "Please enter address.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
            setIsAddr(true);
            setIsClicked(true);
            const response = await axios.post('https://ekyc-4ash.onrender.com/orgKycDataByAddress', {
                orgId,
                citizenAddr
            });
            const kycData = response.data.kycData;
            console.log(kycData);
            setKycData(kycData);
            if (kycData) {
                setCitizenAddr('');
                setIsAddr(false);
                toast({
                    title: 'Success',
                    description: "We've got the details.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error);
            setIsAddr(false);
            toast({
                title: 'Error',
                description: "Something went wrong.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleUsingNID = async () => {
        try {
            if (!nid) return toast({
                title: 'Error',
                description: "Please enter NID.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsNID(true)
            setIsClicked(true);
            const response = await axios.post('https://ekyc-4ash.onrender.com/orgKycDataByNid', {
                orgId,
                nid
            })
            const kycData = response.data.kycData;
            console.log(kycData);
            setKycData(kycData);
            if (kycData) {
                setCitizenAddr('');
                setIsAddr(false);
                toast({
                    title: 'Success',
                    description: "We've got the details.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log(error)
            setIsNID(false)
            // show toast
            toast({
                title: 'Error',
                description: "Something went wrong.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const getWalletAddress = async () => {
        console.log("Account Page");
        try {
            const nidNumber = localStorage.getItem("nidNumber");
            console.log("NID Number before:", nidNumber);
            if (nidNumber !== "undefined") {
                console.log("NID Number: after", nidNumber);
                const response = await axios.post(`https://ekyc-4ash.onrender.com/getWalletAddress`, {
                    nidNumber: nidNumber,
                });
                setWalletAddress(response.data);
                console.log("User Wallet Address:", response);
            }
            // else {
            //   if (userRole === "Orgnization") {
            //     setWalletAddress("Complete your Org profile to get wallet address");
            //   } else {
            //     setWalletAddress("Complete your KYC profile to get wallet address");
            //   }
            // }
        } catch (error) {
            console.error("Error getting user address", error);
        }
    };

    useEffect(() => {
        const fetchVerifiers = async () => {
            try {
                await getWalletAddress();
                console.log(walletAddress)
                const res = await axios.post('https://ekyc-4ash.onrender.com/orgGrantAccess', {
                    orgAddress: walletAddress
                })
                console.log(res.data)
                setCitizensAddr(res.data.citizens)
            } catch (error) {
                console.log(error)
            }
        }
        fetchVerifiers()
    }, [walletAddress])

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh', padding: '20px' }}>
            <div className='flex justify-center m-auto'>
                <div className='mt-20 w-full px-20'>
                    <h1 className='text-3xl font-bold text-center'>eKYC Details</h1>
                    <div className='mt-5'>
                        <p className='text-lg font-medium text-center'>Get citizens ekyc details that you have access</p>
                    </div>
                    {
                        isClicked ? (
                            <>
                                {/* TODO: citizenAddr passing as null ⚠️ */}
                                {kycData && citizenAddr != null && <ShowKycDetails kycData={kycData} citizenAddr={citizenAddr} />}
                            </>
                        ) : (
                            <>
                                <div className='flex gap-10 mt-10'>
                                    <div className='flex flex-col w-[30%]'>
                                        <div className='mt-5'>
                                            <div className='flex flex-col'>
                                                <label className='text-2xl text-[#202020] font-medium'>Citizen Wallet Address</label>
                                                <input type='text' placeholder='Enter Citizen address' className='w-full mt-2 p-2 border-2 border-gray-300 rounded-md' value={citizenAddr} onChange={(e) => setCitizenAddr(e.target.value)} />
                                                <Button onClick={handleUsingAddr} className='w-full mt-2 p-2 bg-blue-500 text-white rounded-md' isLoading={isAddr}
                                                    loadingText='Submitting'
                                                    colorScheme='green'
                                                    variant='solid'
                                                >Get Details</Button>
                                            </div>
                                        </div>
                                        <Box position='relative' padding='10'>
                                            <Divider />
                                            <AbsoluteCenter bg='white' px='8'>
                                                OR
                                            </AbsoluteCenter>
                                        </Box>
                                        <div className='mt-0'>
                                            <div className='flex flex-col'>
                                                <label className='text-2xl text-[#202020] font-medium'>Citizen NID</label>
                                                <input type='text' placeholder='Enter Citizen NID No' className='w-full mt-2 p-2 border-2 border-gray-300 rounded-md' value={nid} onChange={(e) => setNid(e.target.value)} />
                                                <Button onClick={handleUsingNID} className='w-full mt-2 p-2 bg-red-500 text-white rounded-md'
                                                    isLoading={isNID}
                                                    loadingText='Submitting'
                                                    colorScheme='blue'
                                                    variant='solid'
                                                >Get Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Center height='700px'>
                                        <Divider orientation='vertical' />
                                    </Center>
                                    {/* right side */}
                                    <div className="overflow-x-auto w-full">
                                        <TableContainer>
                                            <Table variant="simple" className="min-w-full bg-white text-center">
                                                <Thead className="bg-gray-200 text-[#202020] uppercase text-sm leading-normal">
                                                    <Tr>
                                                        <Th className="py-3 px-6 text-left">Serial No.</Th>
                                                        <Th className="py-3 px-6 text-left">Citizen Name</Th>
                                                        <Th className="py-3 px-6 text-left">NID No</Th>
                                                        <Th className="py-3 px-6 text-left">Wallet Address</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody className="text-gray-600 text-sm font-light">
                                                    {citizensAddr.length > 0 ? (
                                                        citizensAddr.map((citizen, index) => (
                                                            <Tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                                <Td className="py-3 px-6 text-left">{index + 1}</Td>
                                                                <Td className="py-3 px-6 text-left">{citizen.name}</Td>
                                                                <Td className="py-3 px-6 text-left">{citizen.nid}</Td>
                                                                <Td className="py-3 px-6 text-left">{citizen.address}</Td>
                                                            </Tr>
                                                        ))
                                                    ) : (
                                                        <Tr>
                                                            <Td colSpan="4" className="py-3 px-6 text-left">No data found</Td>
                                                        </Tr>
                                                    )}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Verified