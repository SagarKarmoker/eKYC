import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Swal from "sweetalert2";
import backgroundImage from '../img/signupBackground1.png';  // Update the path
import rightSideImage from '../img/signupBackground2.png';  // Update the path

var firebaseConfig = {
  apiKey: "AIzaSyC2L83jkG4jbQIuB5u7ew9ZluWKbPaojlA",
  authDomain: "otp-form-tax.firebaseapp.com",
  projectId: "otp-form-tax",
  storageBucket: "otp-form-tax.appspot.com",
  messagingSenderId: "332084562583",
  appId: "1:332084562583:web:99b6da4068d6b09b2fb7d2",
};

firebase.initializeApp(firebaseConfig);
// Create a reference to the Firebase auth service
const auth = firebase.auth();

function SignUp() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [role, setRole] = useState("Taxpayer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3001/register").then((res) => {
      // console.log(res.data)
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    // Proceed with full name verification only if the role is 'taxpayer'
    if (role === "Taxpayer") {
      try {
        const response = await axios.get("http://localhost:3001/people");
        const peopleData = response.data;
        const userFullName = fullName;
        const matchingPerson = peopleData.find(
          (person) =>
            person.fullNameEnglish === userFullName ||
            person.fullNameBangla === userFullName
        );

        if (!matchingPerson) {
          Swal.fire({
            title: "Error",
            text: "Full name doesn't match with the NID Fullname",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      } catch (error) {
        console.error("Error fetching people data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch NID Fullname",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Use the auth service to send a verification code to the user's phone number
    const phoneNumberWithCountryCode = "+880" + phoneNumber;
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    auth
      .signInWithPhoneNumber(phoneNumberWithCountryCode, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);

        Swal.fire({
          title: "Enter verification code",
          input: "text",
          inputPlaceholder:
            "Please enter the verification code sent to your phone number",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Verify",
          showLoaderOnConfirm: true,
          preConfirm: (code) => {
            setVerificationCode(code);

            return axios
              .post("http://localhost:3001/register", {
                fullName,
                phoneNumber,
                password,
                role,
              })
              .then((response) => {
                console.log("User registered successfully:", response.data);
              })
              .catch((error) => {
                console.error("Error registering user:", error);
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Failed to send verification code",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleVerify = (event) => {
    event.preventDefault();
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    auth
      .signInWithCredential(credential)
      .then((userCredential) => {
        Swal.fire({
          title: "Success",
          text: "Registration Successful",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setFullName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setVerificationId("");
        fetchUsers();
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Failed to verify code or sign in",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container flex flex-col mx-auto bg-transparent rounded-lg my-16 w-4/5">
        <div className="flex flex-wrap justify-center items-center w-full h-full">
          <div className="w-full md:w-1/2 p-5 lg:p-12 flex items-center justify-center">
            <form
              className="flex flex-col w-full h-full pb-6 text-center bg-transparent rounded-3xl"
              onSubmit={handleSubmit}
            >
              <h3 className="mb-12 text-start text-4xl font-extrabold text-[#202020]">
                Sign Up
              </h3>
              <label
                htmlFor="fullName"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Full Name*
              </label>
              <input
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="text"
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <label
                htmlFor="phone"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Phone Number*
              </label>
              <input
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="text"
                id="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Password*
              </label>
              <input
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Confirm Password*
              </label>
              <input
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label
                htmlFor="role"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Select Role*
              </label>
              <select
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-[#202020] rounded-2xl border-2 border-gray-300"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option
                  value="Taxpayer"
                  className="mb-2 text-sm text-start text-[#202020] font-medium "
                >
                  Taxpayer
                </option>
                <option
                  value="Organization"
                  className="mb-2 text-sm text-start text-[#202020] font-medium"
                >
                  Organization
                </option>
              </select>
              <button
                className="w-full md:w-3/4 px-4 py-3 mb-5 text-m font-bold bg-[#ff735c] text-[#f5f5f5] hover:text-[#ff735c] transition duration-300 rounded-2xl border-transparent border-2 hover:bg-transparent hover:border-[#ff735c]"
                type="submit"
              >
                Send Verification Code
              </button>
              <div className="flex items-center mb-3">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                <p className="mx-4 text-[#202020] font-medium">
                  Verification Code
                </p>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
              </div>
              <input
                className="flex items-center w-full md:w-3/4 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-5 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                className="w-full md:w-3/4 px-4 py-3 mb-5 text-m font-bold bg-[#ff735c] text-[#f5f5f5] hover:text-[#ff735c] transition duration-300 rounded-2xl border-transparent border-2 hover:bg-transparent hover:border-[#ff735c]"
                onClick={handleVerify}
              >
                Verify and Sign Up
              </button>
              <div id="recaptcha-container"></div>
            </form>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center md:block hidden">
            <img
              src={rightSideImage}
              alt="Right Side"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;













// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import Swal from "sweetalert2";

// var firebaseConfig = {
//   apiKey: "AIzaSyC2L83jkG4jbQIuB5u7ew9ZluWKbPaojlA",
//   authDomain: "otp-form-tax.firebaseapp.com",
//   projectId: "otp-form-tax",
//   storageBucket: "otp-form-tax.appspot.com",
//   messagingSenderId: "332084562583",
//   appId: "1:332084562583:web:99b6da4068d6b09b2fb7d2",
// };

// firebase.initializeApp(firebaseConfig);
// // Create a reference to the Firebase auth service
// const auth = firebase.auth();

// function SignUp() {
//   const [users, setUsers] = useState([]);
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationId, setVerificationId] = useState("");
//   const [role, setRole] = useState("Taxpayer");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = () => {
//     axios.get("http://localhost:3001/register").then((res) => {
//       // console.log(res.data)
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (password !== confirmPassword) {
//       Swal.fire({
//         title: "Error",
//         text: "Passwords do not match!",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }
//     // Proceed with full name verification only if the role is 'taxpayer'
//     if (role === "Taxpayer") {
//       try {
//         const response = await axios.get("http://localhost:3001/people");
//         const peopleData = response.data;
//         const userFullName = fullName;
//         const matchingPerson = peopleData.find(
//           (person) =>
//             person.fullNameEnglish === userFullName ||
//             person.fullNameBangla === userFullName
//         );

//         if (!matchingPerson) {
//           Swal.fire({
//             title: "Error",
//             text: "Full name doesn't match with the NID Fullname",
//             icon: "error",
//             confirmButtonText: "OK",
//           });
//           return;
//         }
//       } catch (error) {
//         console.error("Error fetching people data:", error);
//         Swal.fire({
//           title: "Error",
//           text: "Failed to fetch NID Fullname",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//         return;
//       }
//     }

//     // Use the auth service to send a verification code to the user's phone number
//     const phoneNumberWithCountryCode = "+880" + phoneNumber;
//     const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       "recaptcha-container",
//       {
//         size: "invisible",
//       }
//     );

//     auth
//       .signInWithPhoneNumber(phoneNumberWithCountryCode, recaptchaVerifier)
//       .then((confirmationResult) => {
//         setVerificationId(confirmationResult.verificationId);

//         Swal.fire({
//           title: "Enter verification code",
//           input: "text",
//           inputPlaceholder:
//             "Please enter the verification code sent to your phone number",
//           inputAttributes: {
//             autocapitalize: "off",
//           },
//           showCancelButton: true,
//           confirmButtonText: "Verify",
//           showLoaderOnConfirm: true,
//           preConfirm: (code) => {
//             setVerificationCode(code);

//             return axios
//               .post("http://localhost:3001/register", {
//                 fullName,
//                 phoneNumber,
//                 password,
//                 role,
//               })
//               .then((response) => {
//                 console.log("User registered successfully:", response.data);
//               })
//               .catch((error) => {
//                 console.error("Error registering user:", error);
//                 Swal.showValidationMessage(`Request failed: ${error}`);
//               });
//           },
//           allowOutsideClick: () => !Swal.isLoading(),
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//         Swal.fire({
//           title: "Error",
//           text: "Failed to send verification code",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       });
//   };

//   const handleVerify = (event) => {
//     event.preventDefault();
//     const credential = firebase.auth.PhoneAuthProvider.credential(
//       verificationId,
//       verificationCode
//     );

//     auth
//       .signInWithCredential(credential)
//       .then((userCredential) => {
//         Swal.fire({
//           title: "Success",
//           text: "Registration Successful",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         setFullName("");
//         setPhoneNumber("");
//         setPassword("");
//         setConfirmPassword("");
//         setVerificationCode("");
//         setVerificationId("");
//         fetchUsers();
//         navigate("/login");
//       })
//       .catch((error) => {
//         console.error(error);
//         Swal.fire({
//           title: "Error",
//           text: "Failed to verify code or sign in",
//           icon: "error",
//           confirmButtonText: "OK",
//         });
//       });
//   };

//   return (
//     <div className="bg-white rounded-lg py-5">
//       <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
//         <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
//           <div className="flex items-center justify-center w-full lg:p-12">
//             <div className="flex items-center xl:p-10">
//               <form
//                 className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
//                 onSubmit={handleSubmit}
//               >
//                 <h3 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
//                   Sign Up
//                 </h3>
//                 <label
//                   for="fullName"
//                   class="mb-2 text-sm text-start text-grey-900 font-medium"
//                 >
//                   Full Name*
//                 </label>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="text"
//                   id="phone"
//                   placeholder="Full Name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                 />
//                 <label
//                   for="phone"
//                   class="mb-2 text-sm text-start text-grey-900 font-medium"
//                 >
//                   Phone Number*
//                 </label>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="text"
//                   id="phone"
//                   placeholder="Phone Number"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//                 <label
//                   for="password"
//                   class="mb-2 text-sm text-start text-grey-900 font-medium"
//                 >
//                   Password*
//                 </label>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="password"
//                   id="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <label
//                   for="password"
//                   class="mb-2 text-sm text-start text-grey-900 font-medium"
//                 >
//                   Confirm Password*
//                 </label>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="password"
//                   id="password"
//                   placeholder="Confirm Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <label
//                   htmlFor="role"
//                   className="mb-2 text-sm text-start text-grey-900 font-medium"
//                 >
//                   Role:
//                 </label>
//                 <select
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   id="role"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                 >
//                   <option
//                     value="Taxpayer"
//                     className="mb-2 text-sm text-start text-grey-900 font-medium"
//                   >
//                     Taxpayer
//                   </option>
//                   <option
//                     value="Organization"
//                     className="mb-2 text-sm text-start text-grey-900 font-medium"
//                   >
//                     Organization
//                   </option>
//                 </select>
//                 <button
//                   className="w-full px-6 py-5 mb-5 text-sm font-bold bg-blue-500 leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
//                   type="submit"
//                 >
//                   Send Verification Code
//                 </button>
//                 <div class="flex items-center mb-3">
//                   <hr class="h-0 border-b border-solid border-grey-500 grow" />
//                   <p class="mx-4 text-grey-600 font-medium">
//                     Verification Code
//                   </p>
//                   <hr class="h-0 border-b border-solid border-grey-500 grow" />
//                 </div>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="text"
//                   placeholder="Verification Code"
//                   value={verificationCode}
//                   onChange={(e) => setVerificationCode(e.target.value)}
//                 />
//                 <button
//                   className="w-full px-6 py-5 mb-5 text-sm font-bold  bg-blue-500  leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-sky-blue-600 focus:ring-4 focus:ring-sky-blue-100 bg-sky-blue-500"
//                   onClick={handleVerify}
//                 >
//                   Verify and Sign Up
//                 </button>
//                 <div id="recaptcha-container"></div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default SignUp;
