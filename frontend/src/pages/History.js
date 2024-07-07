import {useState, useEffect} from 'react'
import axios from 'axios'

function History() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        axios.post('http://localhost:3001/getAllTxs', {
            nid: localStorage.getItem('nidNumber')
        })
            .then(res => {
                setHistory(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        <>
            <div className="bg-white rounded-lg py-5">
                <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
                    <div class="flex-col justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                        <div class="flex items-center justify-center w-full lg:p-12">
                            <h2 class="mb-12 text-4xl font-extrabold text-dark-grey-900">Transaction History</h2>
                        </div>
                        <div>
                            {history.map((tx, index) => (
                                <div key={index} className="flex items-center justify-between w-full p-5 my-2 bg-gray-100 rounded-lg">
                                    <div>
                                        <p className="text-lg font-semibold text-dark-grey-900">Transaction Hash: {tx.hash}</p>
                                        <p className="text-lg font-semibold text-dark-grey-900">From: {tx.from}</p>
                                        <p className="text-lg font-semibold text-dark-grey-900">To: {tx.to}</p>
                                        <p className="text-lg font-semibold text-dark-grey-900">Nonce: {tx.nonce}</p>
                                        <p className="text-lg font-semibold text-dark-grey-900">Gas Price: {tx.gasPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default History