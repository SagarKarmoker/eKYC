import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../img/loginBackground7.png"; // Import your background image
import leftSideImage from "../img/uploadNidBG1.png"; // Import the left side image

function UploadNID() {
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    axios
      .post("https://ekyc-4ash.onrender.com/upload", jsonData)
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          title: "Success!",
          text: "Data has been uploaded successfully.",
          icon: "success",
          timer: 5000,
          timerProgressBar: true,
          willClose: () => {
            console.log("Alert closed after 5 seconds");
          },
        });
        navigate("/history");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "There was a problem with the Excel sheet.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

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
                Upload The Excel Sheet
              </h3>
              <div className="flex flex-col items-center justify-center mb-8">
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
                    Select Your Excel Sheet
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  className="w-full px-4 py-3 mb-5 text-m font-bold bg-[#ff735c] text-[#f5f5f5] hover:text-[#ff735c] transition duration-300 md:w-96 rounded-2xl border-transparent border-2 hover:bg-transparent hover:border-[#ff735c]"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              </div>
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

export default UploadNID;
