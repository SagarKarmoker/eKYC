import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoImg from '../img/taxSheildLogoTransparent.png'; // Import the login image

function Navbar() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isKycSubmitted = !!localStorage.getItem("access");
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nidNumber");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b backdrop-blur-lg bg-opacity-50" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <NavLink className="flex flex-shrink-0 items-center" to="/">
              <img
                className="block h-28 w-auto"
                src={logoImg}
                alt="Taxation"
              /> 
              <p className="pl-3 text-2xl text-[#202020] font-bold">e-KYC</p>
            </NavLink>
          </div>
          <div className="">
            <ul className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              {isUserSignedIn && (
                <>
                  <NavLink to="/account" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                    <li>Account</li>
                  </NavLink>
                  {userRole === "Taxpayer" && (
                    <>
                      <NavLink to="/kyc" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>KYC</li>
                      </NavLink>
                      {isKycSubmitted && (
                        <>
                          <NavLink to="/approved" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                            <li>Update KYC</li>
                          </NavLink>
                          <NavLink to="/my" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                            <li>My KYC</li>
                          </NavLink>
                          <NavLink to="/history" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "hover:underline"}>
                            <li>History</li>
                          </NavLink>
                        </>
                      )}
                    </>
                  )}
                  {userRole === "Admin" && (
                    <>
                      <NavLink to="/uploadNID" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>Upload NID</li>
                      </NavLink>
                      <NavLink to="/verifier" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>Verifier</li>
                      </NavLink>
                      <NavLink to="/verifiedUserList" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>Verified User List</li>
                      </NavLink>
                      <NavLink to="/blockList" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>Block List</li>
                      </NavLink>
                    </>
                  )}
                  {/* TODO: Cooking */}
                  {userRole === "Organization" && (
                    <>
                      <NavLink to="/ekyc" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "hover:underline"}>
                        <li>eKYC Data</li>
                      </NavLink>
                      <NavLink to="/verifiedUserList" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                        <li>Verified User List</li>
                      </NavLink>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="text-[#f5f5f5] hover:text-[#202020] bg-[#ff735c] hover:bg-gray-300 inline-flex items-center justify-center px-3 py-2 border border-transparent text-m font-medium rounded-md shadow-sm"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              )}
              {!isUserSignedIn && (
                <>
                  <NavLink to="/login" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#202020] hover:text-[#ff735c] text-m font-medium"}>
                    <li>Login</li>
                  </NavLink>
                  <NavLink to="/signup" className={({ isActive }) => isActive ? "text-[#ff735c] text-m font-medium" : "text-[#f5f5f5] hover:text-[#202020] bg-[#ff735c] hover:bg-gray-300 inline-flex items-center justify-center px-3 py-2 border border-transparent text-m font-medium rounded-md shadow-sm"}>
                    <li>Signup</li>
                  </NavLink>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
