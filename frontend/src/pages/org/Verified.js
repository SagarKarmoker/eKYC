import { useState, useEffect } from 'react'
import {
    Button, useToast,
    Divider, Center,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box, AbsoluteCenter
} from '@chakra-ui/react'
import axios from 'axios'

function Verified() {
    // TODO: ⚠️⚠️⚠️Replace with actual org address from login ⚠️⚠️⚠️
    const orgAddress = '0x2DbA7f13c06Abb5E1063a3DE0189Ed9D8D2C85f8'

    const toast = useToast()
    const [citizenAddr, setCitizenAddr] = useState('')
    const [nid, setNid] = useState('')
    const [citizensAddr, setCitizensAddr] = useState([])
    const [isAddr, setIsAddr] = useState(false)
    const [isNID, setIsNID] = useState(false)

    const handleUsingAddr = async () => {
        try {
            if (!citizenAddr) return toast({
                title: 'Error',
                description: "Please enter address.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsAddr(true)
            const res = await axios.post('http://localhost:3001/orgKycDataByAddress', { // TODO: Cooking ⚠️
                citizenAddr
            })
            console.log(res.data)
            if (res.data.status) {
                setCitizenAddr('')
                setIsAddr(false)
                toast({
                    title: 'Success',
                    description: "We've got the details.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.log(error)
            setIsAddr(false)
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
            const {kycData} = await axios.post('http://localhost:3001/removeVerifier', {
                nid
            })
            console.log(kycData)
            // if (kycData) {
            //     setIsNID(false)
            //     setNid('')
            //     toast({
            //         title: 'Success',
            //         description: "We've got the details.",
            //         status: 'success',
            //         duration: 9000,
            //         isClosable: true,
            //     })
            // }
            if(kycData.reason === 'Verifier not found in list'){
                setIsNID(false)
                toast({
                    title: 'Error',
                    description: "Verifier not found in list.",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
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

    useEffect(() => {
        const fetchVerifiers = async () => {
            try {
                const res = await axios.post('http://localhost:3001/orgGrantAccess', {
                    orgAddress
                })
                console.log(res.data)
                setCitizensAddr(res.data.citizens)
            } catch (error) {
                console.log(error)
            }
        }
        fetchVerifiers()
    }, [])

    return (
        <div className='flex justify-center m-auto'>
            <div className='mt-20 w-full px-20'>
                <h1 className='text-3xl font-bold text-center'>eKYC Details</h1>
                <div className='mt-5'>
                    <p className='text-lg font-medium text-center'>Get citizens ekyc details that you have access</p>
                </div>
                <div className='flex gap-10 mt-10'>
                    <div className='flex flex-col w-[30%]'>
                        <div className='mt-5'>
                            <div className='flex flex-col'>
                                <label className='text-lg font-medium'>Citizen Wallet Address</label>
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
                            <AbsoluteCenter bg='white' px='4'>
                                OR
                            </AbsoluteCenter>
                        </Box>
                        <div className='mt-0'>
                            <div className='flex flex-col'>
                                <label className='text-lg font-medium'>Citizen NID</label>
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
                    <div className='w-full'>
                        <TableContainer>
                            <Table variant='simple' className='text-center'>
                                <Thead>
                                    <Tr>
                                        <Th>Serial No.</Th>
                                        <Th>Citizen Name</Th>
                                        <Th>NID No</Th>
                                        <Th>Wallet Address</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {/* table data */}
                                    {
                                        citizensAddr.map((citizen, index) => (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{citizen.name}</Td>
                                                <Td>{citizen.nid}</Td>
                                                <Td>{citizen.address}</Td>
                                            </Tr>
                                        ))
                                    
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verified