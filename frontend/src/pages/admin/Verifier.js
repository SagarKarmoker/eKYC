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
} from '@chakra-ui/react'
import axios from 'axios'

function Verifier() {
    const toast = useToast()
    const [verifier, setVerifier] = useState('')
    const [verifiers, setVerifiers] = useState([])
    const [isAddingVerifier, setIsAddingVerifier] = useState(false)
    const [isDeletingVerifier, setIsDeletingVerifier] = useState(false)

    const handleAddVerifier = async () => {
        try {
            if (!verifier) return toast({
                title: 'Error',
                description: "Please enter verifier address.",
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsAddingVerifier(true)
            const res = await axios.post('http://localhost:3001/addVerifier', {
                verifier
            })
            console.log(res.data)
            if (res.data.status) {
                setVerifier('')
                setIsAddingVerifier(false)
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
            setIsAddingVerifier(false)
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
            setIsDeletingVerifier(true)
            const res = await axios.post('http://localhost:3001/removeVerifier', {
                verifier
            })
            console.log(res.data)
            if (res.data.status) {
                setIsDeletingVerifier(false)
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
            setIsDeletingVerifier(false)
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
                const res = await axios.post('http://localhost:3001/getAllVerifiers')
                console.log(res.data)
                setVerifiers(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchVerifiers()
    },[])

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
                                <Button onClick={handleAddVerifier} className='w-full mt-2 p-2 bg-blue-500 text-white rounded-md' isLoading={isAddingVerifier}
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
                                isLoading={isDeletingVerifier}
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
                                    {verifiers.map((verifier, index) => (
                                        <Tr key={index}>
                                            <Td>{index + 1}</Td>
                                            <Td>{verifier.orgName}</Td>
                                            <Td>{verifier.address}</Td>
                                            <Td isNumeric>{verifier.addedOn}</Td>
                                        </Tr>
                                    ))}
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