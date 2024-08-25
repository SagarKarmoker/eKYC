import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import backgroundImage from "../img/loginBackground7.png";
import DisplayNidInfo from "../components/DisplayNidInfo";

const BlockListPage = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNidDataVisible, setIsNidDataVisible] = useState(false);
  const [nidInfo, setNidInfo] = useState(null);

  useEffect(() => {
    // Fetch the list of blocked users from the backend
    axios
      .get("https://ekyc-4ash.onrender.com/blocked-users")
      .then((response) => {
        const usersWithCountdown = response.data.map((user) => {
          const kycExpiryDate = moment(user.kycSubmissionDate).add(1, "years");
          const countdown = moment(kycExpiryDate).diff(moment(), "days");
          return { ...user, countdown };
        });
        setBlockedUsers(usersWithCountdown);
      })
      .catch((error) => {
        console.error("Error fetching blocked users:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };
  const getNIDInfoByOrg = async (nidNumber) => {
    try {
      const response = await axios.get(`https://ekyc-4ash.onrender.com/get-nid-info/${nidNumber}`);
      const nidInfo = response.data;
      setNidInfo(nidInfo);
      setIsNidDataVisible(true);
    } catch (error) {
      console.error("Error getting NID info:", error);
    }
  }

  const filteredUsers = searchTerm
    ? blockedUsers.filter(
      (user) =>
        user.nidNumber.includes(searchTerm) ||
        user.fullNameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullNameBangla.includes(searchTerm) ||
        user.dateOfBirth.includes(searchTerm)
    )
    : blockedUsers;

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-Transparent py-5">
        <div className="container mx-auto bg-transparent  p-5 my-5">
          <div className="flex justify-center mb-5">
            <div className="text-center">
              <h3 className="text-4xl font-extrabold text-[#202020] mb-4 mt-8">Blocked Users</h3>
              <div className="flex justify-center items-center mb-5">
                <input
                  type="text"
                  placeholder="Search by NID, Full Name, or Date of Birth"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-1/2 px-5 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-[#ff735c] text-white rounded-r-md hover:bg-red-600 focus:outline-none"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          {
            isNidDataVisible ? (
              <>
                <DisplayNidInfo nidInfo={nidInfo} />
              </>
            ) : (

              <div className="overflow-x-auto">
                <table className="min-w-full bg-[#f5f5f5]">
                  <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">NID Number</th>
                      <th className="py-3 px-6 text-left">Full Name (English)</th>
                      <th className="py-3 px-6 text-left">Full Name (Bangla)</th>
                      <th className="py-3 px-6 text-left">Date of Birth</th>
                      <th className="py-3 px-6 text-left">Expired Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {filteredUsers.map((user) => (
                      <tr key={user.nidNumber} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left text-[#ff735c] underline font-bold hover:cursor-pointer hover:text-blue-600" onClick={() => getNIDInfoByOrg(user.nidNumber)}>{user.nidNumber}</td>
                        <td className="py-3 px-6 text-left">{user.fullNameEnglish}</td>
                        <td className="py-3 px-6 text-left">{user.fullNameBangla}</td>
                        <td className="py-3 px-6 text-left">{user.dateOfBirth}</td>
                        <td className="py-3 px-6 text-left">
                          {user.countdown >= 0 ? `${user.countdown} Day's Remaining` : "KYC expired"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default BlockListPage;
