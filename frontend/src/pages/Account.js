import { React, useEffect, useState } from "react";
import axios from "axios";

function Account() {
  const [walletAddress, setWalletAddress] = useState("");

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    getWalletAddress();
  }, []);

  const getWalletAddress = async () => {
    console.log("Account Page");
    try {
      const nidNumber = localStorage.getItem("nidNumber");
      console.log("NID Number before:", nidNumber);
      if (nidNumber !== "undefined") {
        console.log("NID Number: after", nidNumber);
        const response = await axios.post(`http://localhost:3001/getWalletAddress`, {
          nidNumber: nidNumber,
        });
        setWalletAddress(response.data);
        console.log("User Wallet Address:", response);
      }
      else {
        if (userRole === "Org") {
          setWalletAddress("Complete your Org profile to get wallet address");
        } else {
          setWalletAddress("Complete your KYC profile to get wallet address");
        }
      }
    } catch (error) {
      console.error("Error getting user address", error);
    }
  }


  return (
    <div className="bg-white rounded-lg py-5">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div class="flex items-center justify-center w-full lg:p-12">
            {
              userRole === "Taxpayer" && (
                <>
                  <div class="flex flex-col items-center xl:p-10">
                    <h1 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
                      Account
                    </h1>
                    <p className="font-bold">Your wallet Address: <span className="font-normal">{walletAddress}</span></p>
                  </div></>
              )
            }

            {
              userRole === "Org" && (
                <>
                  <div class="flex flex-col items-center xl:p-10">
                    <h1 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
                      Welcome to Organization Account
                    </h1>
                    <p className="font-bold">Org wallet Address: <span className="font-normal">{walletAddress}</span></p>
                  </div></>
              )
            }

            {
              userRole === "Admin" && (
                <>
                  <div class="flex flex-col items-center xl:p-10">
                    <h1 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
                      Welcome to Admin Panel
                    </h1>
                    <p className="font-bold">Admin wallet Address: <span className="font-normal">0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3</span></p>
                  </div>
                  </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default Account;