import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import backgroundImage from "../img/loginBackground7.png"; // Replace with your background image path

const VerifiedUserListPage = () => {
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVerifiedUsers = () => {
      axios
        .get("http://localhost:3001/verified-users")
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
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
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{user.nidNumber}</td>
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
        </div>
      </div>
    </div>
  );
};

export default VerifiedUserListPage;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from "moment";
// import Swal from "sweetalert2";

// const VerifiedUserListPage = () => {
//   const [verifiedUsers, setVerifiedUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchVerifiedUsers = () => {
//       axios
//         .get("http://localhost:3001/verified-users")
//         .then((response) => {
//           const usersWithCountdownAndBlockStatus = response.data.map((user) => {
//             const kycExpiryDate = moment(user.kycSubmissionDate).add(
//               1,
//               "years"
//             );
//             const countdown = moment(kycExpiryDate).diff(moment(), "days");
//             return {
//               ...user,
//               countdown,
//               isBlocked: user.blocked || false, // Ensure this matches your backend field name
//             };
//           });
//           setVerifiedUsers(usersWithCountdownAndBlockStatus);
//         })
//         .catch((error) => {
//           console.error("Error fetching verified users:", error);
//         });
//     };

//     fetchVerifiedUsers();
//   }, [verifiedUsers]);

//   const handleBlockUser = (nidNumber) => {
//     axios
//       .post("http://localhost:3001/block-user", { nidNumber })
//       .then(() => {
//         Swal.fire("Blocked!", "The user has been blocked.", "success");
//         setVerifiedUsers(
//           verifiedUsers.map((user) => {
//             if (user.nidNumber === nidNumber) {
//               return { ...user, isBlocked: true };
//             }
//             return user;
//           })
//         );
//       })
//       .catch((error) => {
//         Swal.fire("Error!", "There was an issue blocking the user.", "error");
//         console.error("Error blocking user:", error);
//       });
//   };

//   const handleUnblockUser = (nidNumber) => {
//     axios
//       .post("http://localhost:3001/unblock-user", { nidNumber })
//       .then(() => {
//         Swal.fire("Unblocked!", "The user has been unblocked.", "success");
//         setVerifiedUsers(
//           verifiedUsers.map((user) => {
//             if (user.nidNumber === nidNumber) {
//               return { ...user, isBlocked: false };
//             }
//             return user;
//           })
//         );
//       })
//       .catch((error) => {
//         Swal.fire("Error!", "There was an issue unblocking the user.", "error");
//         console.error("Error unblocking user:", error);
//       });
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//   };

//   const filteredUsers = searchTerm
//     ? verifiedUsers.filter(
//         (user) =>
//           user.nidNumber.includes(searchTerm) ||
//           user.fullNameEnglish
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           user.fullNameBangla.includes(searchTerm) ||
//           user.dateOfBirth.includes(searchTerm)
//       )
//     : verifiedUsers;

//   return (
//     <div className="bg-white rounded-lg py-5">
//       <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
//         <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
//           <div className="flex items-center justify-center w-full lg:p-12">
//             <div className="flex items-center xl:p-10">
//               <table className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
//                 <div className="flex items-center mb-3">
//                   <hr className="h-0 border-b border-solid border-grey-500 grow" />
//                   <h3 className="mb-4 mx-4 text-4xl font-extrabold text-dark-grey-900">
//                     Verified User List
//                   </h3>
//                   <hr className="h-0 border-b border-solid border-grey-500 grow" />
//                 </div>
//                 <div className="search-container flex justify-end items-center">
//                   <input
//                     type="text"
//                     placeholder="Search by NID, Full Name, or Date of Birth"
//                     value={searchTerm}
//                     onChange={handleSearchChange}
//                     className="search-input flex items-center w-1/2 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   />
//                   <button
//                     onClick={handleClear}
//                     className="px-4 mb-7 h-14 flex items-center justify-center font-bold bg-red-500 text-white rounded-md"
//                   >
//                     Clear
//                   </button>
//                 </div>

//                 <thead className="text-xs text-gray-950 uppercase">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 w-48 bg-gray-200 text-left"
//                     >
//                       NID Number
//                     </th>
//                     <th scope="col" className="px-6 py-3 w-64 text-left">
//                       Full Name (English)
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 w-64 bg-gray-200 text-left"
//                     >
//                       Full Name (Bangla)
//                     </th>
//                     <th scope="col" className="px-6 py-3 w-48 text-left">
//                       Date of Birth
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 w-52 bg-gray-200 text-left"
//                     >
//                       Expired Time
//                     </th>
//                     <th scope="col" className="px-6 py-3 w-48 text-left">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="border-b border-gray-200">
//                       <th
//                         scope="row"
//                         className="px-6 py-4 w-48 text-left font-medium text-gray-900 whitespace-nowrap bg-gray-200"
//                       >
//                         {user.nidNumber}
//                       </th>
//                       <td className="px-6 py-4 w-64 text-left">
//                         {user.fullNameEnglish}
//                       </td>
//                       <td className="px-6 py-4 w-64 text-left bg-gray-200">
//                         {user.fullNameBangla}
//                       </td>
//                       <td className="px-6 py-4 w-48 text-left">
//                         {user.dateOfBirth}
//                       </td>
//                       <td className="px-6 py-4 w-52 text-left bg-gray-200">
//                         {user.countdown >= 0
//                           ? `${user.countdown} Day's Remaining`
//                           : "KYC expired"}
//                       </td>
//                       <td className="px-6 py-4 w-48 text-left uppercase font-semibold">
//                         {user.isBlocked ? (
//                           <button
//                             className="text-green-600"
//                             onClick={() => handleUnblockUser(user.nidNumber)}
//                           >
//                             Unblock
//                           </button>
//                         ) : (
//                           <button
//                             className="text-red-600"
//                             onClick={() => handleBlockUser(user.nidNumber)}
//                           >
//                             Block
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifiedUserListPage;
