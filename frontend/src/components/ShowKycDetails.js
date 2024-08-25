import { BigNumber } from 'ethers';
import { Divider, Center, Toast } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const ShowKycDetails = ({ kycData, citizenAddr }) => {
    const gatewayBaseUrl = 'http://127.0.0.1:8080/ipfs';
    const orgId = localStorage.getItem('nidNumber');
    const toast = useToast();

    // Ensure kycData is defined
    if (!kycData) {
        return null;
    }

    const { ipfsHash, verified, time, nid } = kycData;
    console.log(citizenAddr)

    // Convert BigNumber time to a readable format
    const date = new Date(BigNumber.from(time?.hex).toNumber() * 1000);
    const formattedDate = date.toLocaleString();

    const handleVrifyKyc = async () => {
        try {
            // Verify KYC
            const response = await axios.post('https://ekyc-4ash.onrender.com/acceptOrDeclineKyc', {
                orgId: orgId,
                address: citizenAddr,
                status: verified ? 'true' : 'false'
            });
            console.log(response);
            if (response.data == true) {
                toast({
                    title: "KYC Verified",
                    description: "KYC has been verified successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "KYC Verification Failed",
                    description: "KYC verification failed",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex gap-4 mt-10">
            {/* left side */}
            <div>
                <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">IPFS Data</h2>
                    </div>
                    <div>
                        <p className="text-gray-700"><span className="font-semibold">IPFS Hash:</span> {ipfsHash}</p>
                    </div>
                    <div>
                        <p className="text-gray-700"><span className="font-semibold">Verified:</span> {verified ? 'True' : 'False'}</p>
                    </div>
                    <div>
                        <p className="text-gray-700"><span className="font-semibold">Time:</span> {formattedDate}</p>
                    </div>
                </div>

                {/* verify kyc */}
                <div className="flex justify-center mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleVrifyKyc}>
                        Verify and Accept
                    </button>
                </div>
            </div>
            <Center height="700px">
                <Divider orientation="vertical" />
            </Center>
            {/* right side */}
            <div className="w-full">
                <h3 className="text-center font-semibold text-2xl">Citizens e-KYC (NID Image)</h3>
                <div className='mb-4 mt-4'>
                    <h3 className='font-bold'>Front Side</h3>
                    <img src={`${gatewayBaseUrl}/${ipfsHash}/images-${nid.nid}/image1.jpg`} alt="Image 1" className="mx-auto h-[300px] w-[500px]" />
                </div>
                <div>
                    <h3 className='font-bold'>Back Side</h3>
                    <img src={`${gatewayBaseUrl}/${ipfsHash}/images-${nid.nid}/image2.jpg`} alt="Image 2" className="mx-auto h-[300px] w-[500px]" />
                </div>
            </div>
        </div>
    );
};

export default ShowKycDetails;
