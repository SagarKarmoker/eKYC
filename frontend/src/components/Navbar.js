import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from '../img/taxSheildLogoTransparent.png'; // Import the login image

function Navbar() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isKycSubmitted = !!localStorage.getItem("access");
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (

    <nav className="fixed top-0 left-0 w-full z-50 border-b backdrop-blur-lg bg-opacity-50" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <Link className="flex flex-shrink-0 items-center" to="/">
              <img
                className="block h-28 w-auto"
                src={logoImg}
                alt="Taxation"
              />
            </Link>
          </div>
          <div className="">
            <ul className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              {isUserSignedIn && (
                <>
                  <Link to="/account">
                    <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">Account</li>
                  </Link>
                  {userRole === "Taxpayer" && (
                    <>
                      <Link to="/kyc">
                        <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">KYC</li>
                      </Link>
                      {isKycSubmitted && (
                        <>
                          <Link to="/approved">
                            <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">Update KYC</li>
                          </Link>
                          <Link to="/my">
                            <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">My KYC</li>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  {userRole === "Admin" && (
                    <>
                      <Link to="/uploadNID">
                        <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">Upload NID</li>{" "}
                      </Link>
                      <Link to="/verifiedUserList">
                        <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium  ">Verified User List</li>
                      </Link>
                      <Link to="/blockList">
                        <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium ">Block List</li>
                      </Link>
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
                  <Link to="/login">
                    <li className="text-[#202020] hover:text-[#ff735c] text-m font-medium">
                      Login
                    </li>

                  </Link>
                  <Link to="/signup">
                    <li className="text-[#f5f5f5] hover:text-[#202020] bg-[#ff735c] hover:bg-gray-300 inline-flex items-center justify-center px-3 py-2 border border-transparent text-m font-medium rounded-md shadow-sm">
                      Signup
                    </li>
                  </Link>
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
