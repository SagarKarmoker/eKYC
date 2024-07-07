import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import loginImage from '../img/LoginEkyc.png'; // Import the login image
import backgroundImage from '../img/loginBackground7.png'; // Import the background image

function Login() {
  const [users, setUsers] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(Math.floor(Math.random() * 10) + 1);
  const [userCaptcha, setUserCaptcha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3001/register").then((res) => {
      console.log(res.data);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (parseInt(userCaptcha) !== captcha + 3) {
      Swal.fire({
        title: "Error",
        text: "Captcha does not match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        phoneNumber,
        password,
      });
      const { token, role, message } = response.data;
      Swal.fire({
        title: "Success",
        text: `${message} ${role}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setPhoneNumber("");
      setPassword("");
      setUserCaptcha("");
      setCaptcha(Math.floor(Math.random() * 10) + 1);
      fetchUsers();
      navigate("/account");
      window.location.reload();
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    } catch (error) {
      console.log("Login Error", error);
      Swal.fire({
        title: "Error",
        text: "Login failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row bg-transparent rounded-lg">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <img src={loginImage} alt="Login Illustration" className="w-full h-auto" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="flex items-center xl:p-10">
            <form
              className="flex flex-col w-full h-full pb-6 text-center bg-transparent rounded-3xl"
              onSubmit={handleLogin}
            >
              <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                Log In
              </h3>
              <label
                htmlFor="phone"
                className="mb-2 text-sm text-start text-[#202020] font-medium"
              >
                Phone Number*
              </label>
              <input
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
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
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="mb-2 text-sm text-start text-[#202020] font-medium">
                Captcha: {captcha} + 3 = ?
              </label>
              <input
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#f5f5f5] text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                type="text"
                placeholder="Captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
              />
              <button
                className="w-full px-4 py-3 mb-5 text-m font-bold bg-[#ff735c] text-[#f5f5f5] hover:text-[#ff735c] transition duration-300 md:w-96 rounded-2xl border-transparent border-2 hover:bg-transparent hover:border-[#ff735c]"
                type="submit"
              >
                Login
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Login;











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// function Login() {
//   const [users, setUsers] = useState([]);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [captcha, setCaptcha] = useState(Math.floor(Math.random() * 10) + 1);
//   const [userCaptcha, setUserCaptcha] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = () => {
//     axios.get("http://localhost:3001/register").then((res) => {
//       console.log(res.data);
//     });
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     if (parseInt(userCaptcha) !== captcha + 3) {
//       // Check if user's captcha answer is correct
//       Swal.fire({
//         title: "Error",
//         text: "Captcha does not match!",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3001/login", {
//         phoneNumber,
//         password,
//       });
//       const { token, role, message } = response.data;
//       Swal.fire({
//         title: "Success",
//         text: `${message} ${role}`,
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false,
//       });
//       setPhoneNumber("");
//       setPassword("");
//       setUserCaptcha(""); // Reset user's captcha answer
//       setCaptcha(Math.floor(Math.random() * 10) + 1); // Generate new captcha
//       fetchUsers();
//       navigate("/account");
//       window.location.reload();
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//     } catch (error) {
//       console.log("Login Error", error);
//       Swal.fire({
//         title: "Error",
//         text: "Login failed",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg py-5">
//       <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
//         <div class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
//           <div class="flex items-center justify-center w-full lg:p-12">
//             <div class="flex items-center xl:p-10">
//               <form
//                 className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
//                 onSubmit={handleLogin}
//               >
//                 <h3 class="mb-12 text-4xl font-extrabold text-dark-grey-900">
//                   Log In
//                 </h3>
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
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <label className="mb-2 text-sm text-start text-grey-900 font-medium">
//                   Captcha: {captcha} + 3 = ?
//                 </label>
//                 <input
//                   className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
//                   type="text"
//                   placeholder="Captcha"
//                   value={userCaptcha}
//                   onChange={(e) => setUserCaptcha(e.target.value)}
//                 />
//                 <button
//                   className="w-full px-6 py-5 mb-5 text-sm font-bold  bg-blue-500  leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-sky-blue-600 focus:ring-4 focus:ring-sky-blue-100 bg-sky-blue-500"
//                   type="submit"
//                 >
//                   Login
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Login;



