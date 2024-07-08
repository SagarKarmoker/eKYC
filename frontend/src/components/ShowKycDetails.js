import React from 'react';
import { BigNumber } from 'ethers';

const ShowKycDetails = ({ kycData }) => {
    if (!kycData) {
        return null;
    }

    const { ipfsHash, verified, time } = kycData;

    console.log(ipfsHash, verified, time)
    // Convert BigNumber time to a readable format
    const date = new Date(BigNumber.from(time).toNumber() * 1000);
    const formattedDate = date.toLocaleString();

    return (
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
    );
};

export default ShowKycDetails;
