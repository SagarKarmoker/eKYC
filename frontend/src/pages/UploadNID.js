import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

function UploadNID() {
  const [file, setFile] = useState();

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
      .post("http://localhost:3001/upload", jsonData)
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
    <div className="bg-white rounded-lg py-5">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div class="flex items-center justify-center w-full lg:p-12">
            <div class="flex items-center xl:p-10">
              <div className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                <h3 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
                  Upload The Excel Sheet
                </h3>
                <div className="flex flex-col items-center justify-center mb-8">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-500 mb-8">
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
                    className="w-full px-6 py-5 mb-5 text-sm font-bold  bg-blue-500  leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-sky-blue-600 focus:ring-4 focus:ring-sky-blue-100 bg-sky-blue-500"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadNID;
