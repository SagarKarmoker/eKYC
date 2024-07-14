import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import backgroundImage from "../img/loginBackground7.png"; // Replace with your background image path
import DisplayNidInfo from "../components/DisplayNidInfo";

const VerifiedUserListPage = () => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role");
  const orgId = localStorage.getItem("nidNumber"); //only for org
  const [isNidDataVisible, setIsNidDataVisible] = useState(false);
  const [nidInfo, setNidInfo] = useState(null);

  const url =
    role === "Organization"
      ? `http://localhost:3001/org-verified-users?orgId=${orgId}`
      : "http://localhost:3001/verified-users";


  useEffect(() => {
    const fetchVerifiedUsers = () => {
      axios
        .get(url)
        .then((response) => {
          const usersWithCountdownAndBlockStatus = response.data.map((user) => {
            const kycExpiryDate = moment(user.kycSubmissionDate).add(1, "years");
            const countdown = moment(kycExpiryDate).diff(moment(), "days");
            return {
              ...user,
              countdown,
              isBlocked: user.blocked || false,
            };
          });
          setVerifiedUsers(usersWithCountdownAndBlockStatus);
        })
        .catch((error) => {
          console.error("Error fetching verified users:", error);
        });
    };

    fetchVerifiedUsers();
  }, []);

  const handleBlockUser = (nidNumber) => {
    axios
      .post("http://localhost:3001/block-user", { nidNumber })
      .then(() => {
        Swal.fire("Blocked!", "The user has been blocked.", "success");
        setVerifiedUsers(
          verifiedUsers.map((user) => {
            if (user.nidNumber === nidNumber) {
              return { ...user, isBlocked: true };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        Swal.fire("Error!", "There was an issue blocking the user.", "error");
        console.error("Error blocking user:", error);
      });
  };

  const handleUnblockUser = (nidNumber) => {
    axios
      .post("http://localhost:3001/unblock-user", { nidNumber })
      .then(() => {
        Swal.fire("Unblocked!", "The user has been unblocked.", "success");
        setVerifiedUsers(
          verifiedUsers.map((user) => {
            if (user.nidNumber === nidNumber) {
              return { ...user, isBlocked: false };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        Swal.fire("Error!", "There was an issue unblocking the user.", "error");
        console.error("Error unblocking user:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const filteredUsers = searchTerm
    ? verifiedUsers.filter(
      (user) =>
        user.nidNumber.includes(searchTerm) ||
        user.fullNameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullNameBangla.includes(searchTerm) ||
        user.dateOfBirth.includes(searchTerm)
    )
    : verifiedUsers;

  const getNIDInfoByOrg = async (nidNumber) => {
    try {
      const response = await axios.get(`http://localhost:3001/get-nid-info/${nidNumber}`);
      const nidInfo = response.data;
      setNidInfo(nidInfo);
      setIsNidDataVisible(true);
    } catch (error) {
      console.error("Error getting NID info:", error);
    }
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-transparent py-5">
        <div className="container mx-auto bg-transparent p-5 my-5 ">
          <div className="flex justify-center mb-5">
            <div className="text-center">
              <h3 className="text-4xl font-extrabold text-[#202020] mb-4 mt-8">Verified User List</h3>
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
                  <thead className="bg-gray-200 text-[#202020] uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">NID Number</th>
                      <th className="py-3 px-6 text-left">Full Name (English)</th>
                      <th className="py-3 px-6 text-left">Full Name (Bangla)</th>
                      <th className="py-3 px-6 text-left">Date of Birth</th>
                      <th className="py-3 px-6 text-left">Expired Time</th>
                      <th className="py-3 px-6 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {/* user print */}
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left text-[#ff735c] underline font-bold hover:cursor-pointer hover:text-blue-600" onClick={() => getNIDInfoByOrg(user.nidNumber)}>{user.nidNumber}</td>
                        <td className="py-3 px-6 text-left">{user.fullNameEnglish}</td>
                        <td className="py-3 px-6 text-left">{user.fullNameBangla}</td>
                        <td className="py-3 px-6 text-left">{user.dateOfBirth}</td>
                        <td className="py-3 px-6 text-left">
                          {user.countdown >= 0 ? `${user.countdown} Day's Remaining` : "KYC expired"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {user.isBlocked ? (
                            <button
                              className="text-red-600 hover:text-green-800"
                              onClick={() => handleUnblockUser(user.nidNumber)}
                            >
                              Blocked
                            </button>
                          ) : (
                            <button
                              className="text-green-600 hover:text-red-800"
                              onClick={() => handleBlockUser(user.nidNumber)}
                            >
                              Active
                            </button>
                          )}
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

export default VerifiedUserListPage;
