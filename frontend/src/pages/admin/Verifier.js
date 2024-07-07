import { useState } from 'react'
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
} from '@chakra-ui/react'
import axios from 'axios'

function Verifier() {
    const toast = useToast()
    const [verifier, setVerifier] = useState('')
    const [verifiers, setVerifiers] = useState([])
    const [isloading, setIsLoading] = useState(false)

    const handleAddVerifier = async () => {
        try {
            if (!verifier) return toast({
                title: 'Error',
                description: "Please enter verifier address.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsLoading(true)
            const res = await axios.post('http://localhost:3001/addVerifier', {
                verifier
            })
            console.log(res.data)
            if (res.data.status) {
                setVerifier('')
                setIsLoading(false)
                toast({
                    title: 'Verifier added.',
                    description: "We've added verifier.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
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

    const handleDeleteVerifier = async () => {
        try {
            if (!verifier) return toast({
                title: 'Error',
                description: "Please enter verifier address.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsLoading(true)
            const res = await axios.post('http://localhost:3001/removeVerifier', {
                verifier
            })
            console.log(res.data)
            if (res.data.status) {
                setIsLoading(false)
                setVerifier('')
                toast({
                    title: 'Verifier removed.',
                    description: "We've removed verifier.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
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

    return (
        <div className='flex justify-center m-auto'>
            <div className='mt-20 w-full px-20'>
                <h1 className='text-3xl font-bold text-center'>Verifier</h1>
                <div className='mt-5'>
                    <p className='text-lg font-medium text-center'>Add and Delete Verifier</p>
                </div>
                <div className='flex gap-10 mt-10'>
                    <div className='flex flex-col w-[30%]'>
                        <div className='mt-5'>
                            <div className='flex flex-col'>
                                <label className='text-lg font-medium'>Add Verifier</label>
                                <input type='text' placeholder='Enter Verifier address' className='w-full mt-2 p-2 border-2 border-gray-300 rounded-md' value={verifier} onChange={(e) => setVerifier(e.target.value)} />
                                <Button onClick={handleAddVerifier} className='w-full mt-2 p-2 bg-blue-500 text-white rounded-md' isLoading={isloading}
                                    loadingText='Submitting'
                                    colorScheme='green'
                                    variant='solid'
                                >Add Verifier</Button>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <div className='flex flex-col'>
                                <label className='text-lg font-medium'>Delete Verifier</label>
                                <input type='text' placeholder='Enter Verifier address' className='w-full mt-2 p-2 border-2 border-gray-300 rounded-md' value={verifier} onChange={(e) => setVerifier(e.target.value)} />
                                <Button onClick={handleDeleteVerifier} className='w-full mt-2 p-2 bg-red-500 text-white rounded-md'
                                isLoading={isloading}
                                loadingText='Submitting'
                                colorScheme='red'
                                variant='solid'
                                >Delete Verifier</Button>
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
                                        <Th>Oragnization Name</Th>
                                        <Th>Oragnization Address</Th>
                                        <Th isNumeric>Added On (Block No)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>1</Td>
                                        <Td>NBR</Td>
                                        <Td>0x2DbA7f13c06Abb5E1063a3DE0189Ed9D8D2C85f8</Td>
                                        <Td isNumeric>1000</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>2</Td>
                                        <Td>NBR</Td>
                                        <Td>0x2DbA7f13c06Abb5E1063a3DE0189Ed9D8D2C85f8</Td>
                                        <Td isNumeric>5000</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>3</Td>
                                        <Td>NBR</Td>
                                        <Td>0x2DbA7f13c06Abb5E1063a3DE0189Ed9D8D2C85f8</Td>
                                        <Td isNumeric>50000</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verifier