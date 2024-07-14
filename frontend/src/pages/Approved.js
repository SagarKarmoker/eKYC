// import React, { useState } from "react";
// // Import necessary functions from 'ipfs-http-client'
// import { create, globSource } from "ipfs-http-client";
// import axios from "axios";
// import Swal from "sweetalert2";

// // Initialize IPFS HTTP client
// const ipfs = create({ url: "http://127.0.0.1:5001" });
// function ImageUpload() {
//   const [frontImage, setFrontImage] = useState(null);
//   const [backImage, setBackImage] = useState(null);
//   const nid = localStorage.getItem("nidNumber");

//   const storeKYCData = async (ipfsHash) => {
//     try {
//       const response = await axios.post(`http://localhost:3001/submitKYC`, {
//         ipfsHash,
//         nid,
//       });
//       console.log("KYC Data Submitted Successfully:", response.data);
//       console.log("KYC User NID Number:", nid);
//       return response.data.hash;
//     } catch (error) {
//       console.error("Error submitting KYC data:", error);
//     }
//   };

//   const handleFileChange = (e, setImage) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   async function uploadFilesAsDirectory(files) {
//     try {
//       const directoryName = `images-${nid}`; // Unique directory name
//       const filesToAdd = files.map((file, index) => {
//         return {
//           path: `${directoryName}/image${index + 1}.jpg`, // Customizable path for each file
//           content: file,
//         };
//       });

//       const addedFiles = [];
//       for await (const result of ipfs.addAll(filesToAdd, {
//         wrapWithDirectory: true,
//       })) {
//         addedFiles.push(result);
//       }

//       // The last entry is the directory with all files
//       const directory = addedFiles[addedFiles.length - 1];
//       if (directory.cid) {
//         const response = await storeKYCData(directory.cid.toString());
//         if (response) {
//           Swal.fire({
//             title: "Success",
//             text: "Images uploaded to IPFS successfully under a single hash.",
//             icon: "success",
//             timer: 2000,
//             showConfirmButton: false,
//           });
//         } else {
//           Swal.fire({
//             title: "Error",
//             text: "Failed to upload images to IPFS.",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//         }
//         console.log(directory.cid.toString());
//       }
//       return `http://127.0.0.1:8080/ipfs/${directory.cid}`;
//     } catch (error) {
//       console.error("Error uploading directory to IPFS:", error);
//       return null;
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!frontImage || !backImage) {
//       Swal.fire({
//         title: "Error",
//         text: "Both front and back images are required.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     // Convert URLs to files
//     const frontFile = await fetch(frontImage).then((r) => r.blob());
//     const backFile = await fetch(backImage).then((r) => r.blob());

//     // Upload both files as a directory to IPFS
//     await uploadFilesAsDirectory([
//       frontFile,
//       backFile,
//     ]);
//   }

//   return (
//     <div className="bg-white rounded-lg py-5">
//       <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
//         <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
//           <div class="flex items-center justify-center w-full lg:p-12">
//             <div class="flex items-center xl:p-10">
//               <form
//                 onSubmit={handleSubmit}
//                 className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
//               >
//                 <h3 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
//                   Upload Your NID
//                 </h3>
//                 <div className="flex flex-col items-center justify-center mb-8">
//                   <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-500">
//                     <svg
//                       className="w-8 h-8"
//                       fill="currentColor"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
//                     </svg>
//                     <span className="mt-2 text-base leading-normal">
//                       Select a front image
//                     </span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={(e) => handleFileChange(e, setFrontImage)}
//                     />
//                   </label>
//                   {frontImage && (
//                     <img
//                       src={frontImage}
//                       alt="Front Side"
//                       className="mt-4 w-32 h-32 object-cover rounded-md"
//                     />
//                   )}
//                 </div>

//                 <div className="flex flex-col items-center justify-center mb-8">
//                   <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-500">
//                     <svg
//                       className="w-8 h-8"
//                       fill="currentColor"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
//                     </svg>
//                     <span className="mt-2 text-base leading-normal">
//                       Select a back image
//                     </span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={(e) => handleFileChange(e, setBackImage)}
//                     />
//                   </label>
//                   {backImage && (
//                     <img
//                       src={backImage}
//                       alt="Back Side"
//                       className="mt-4 w-32 h-32 object-cover rounded-md"
//                     />
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full px-6 py-5 mb-5 text-sm font-bold  bg-blue-500  leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-sky-blue-600 focus:ring-4 focus:ring-sky-blue-100 bg-sky-blue-500"
//                 >
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default ImageUpload;
//========================================================================================================================================================
//previous Code 
//========================================================================================================================================================




import React, { useState } from "react";
import { create } from "ipfs-http-client";
import axios from "axios";
import Swal from "sweetalert2";
import backgroundImage from "../img/loginBackground7.png"; // Import your background image
import leftSideImage from "../img/uploadNidBG2.png"; // Import the left side image

const ipfs = create({ url: "http://127.0.0.1:5001" });

function ImageUpload() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const nid = localStorage.getItem("nidNumber");

  const storeKYCData = async (ipfsHash) => {
    try {
      const response = await axios.post(`http://localhost:3001/submitKYC`, {
        ipfsHash,
        nid,
      });
      console.log("KYC Data Submitted Successfully:", response.data);
      console.log("KYC User NID Number:", nid);
      return response.data.hash;
    } catch (error) {
      console.error("Error submitting KYC data:", error);
    }
  };

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  async function uploadFilesAsDirectory(files) {
    try {
      const directoryName = `images-${nid}`;
      const filesToAdd = files.map((file, index) => {
        return {
          path: `${directoryName}/image${index + 1}.jpg`,
          content: file,
        };
      });

      const addedFiles = [];
      for await (const result of ipfs.addAll(filesToAdd, {
        wrapWithDirectory: true,
      })) {
        addedFiles.push(result);
      }

      const directory = addedFiles[addedFiles.length - 1];
      if (directory.cid) {
        const response = await storeKYCData(directory.cid.toString());
        if (response) {
          Swal.fire({
            title: "Success",
            text: "Images uploaded to IPFS successfully under a single hash.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to upload images to IPFS.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.log(directory.cid.toString());
      }
      return `http://127.0.0.1:8080/ipfs/${directory.cid}`;
    } catch (error) {
      console.error("Error uploading directory to IPFS:", error);
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!frontImage || !backImage) {
      Swal.fire({
        title: "Error",
        text: "Both front and back images are required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const frontFile = await fetch(frontImage).then((r) => r.blob());
    const backFile = await fetch(backImage).then((r) => r.blob());

    await uploadFilesAsDirectory([frontFile, backFile]);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-transparent py-5 container mx-auto flex items-center justify-center">
        <div className="flex w-full h-full xl:gap-14 lg:justify-between md:gap-5 items-center">
          <div className="flex items-center justify-center w-1/2 lg:p-12">
            <div className="flex flex-col w-full h-full text-center bg-transparent rounded-3xl p-6">
              <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                Upload Your NID
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="w-full lex flex-col items-center justify-center mb-8">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#f5f5f5] text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-[#ff735c] hover:text-white transition-all duration-500 mb-8">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal font-semibold">
                      Select a front image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setFrontImage)}
                    />
                  </label>
                  {frontImage && (
                    <img
                      src={frontImage}
                      alt="Front Side"
                      className="mt-4 w-32 h-32 object-cover rounded-md"
                    />
                  )}
                </div>

                <div className="w-full flex flex-col items-center justify-center mb-8">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#f5f5f5] text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-[#ff735c] hover:text-white transition-all duration-500">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal font-semibold">
                      Select a back image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setBackImage)}
                    />
                  </label>
                  {backImage && (
                    <img
                      src={backImage}
                      alt="Back Side"
                      className="mt-4 w-32 h-32 object-cover rounded-md"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 mb-5 text-m font-bold bg-[#ff735c] text-[#f5f5f5] hover:text-[#ff735c] transition duration-300 md:w-96 rounded-2xl border-transparent border-2 hover:bg-transparent hover:border-[#ff735c]"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="flex items-center justify-center w-1/2 lg:p-12">
            <img
              src={leftSideImage}
              alt="Right Side"
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImageUpload;
