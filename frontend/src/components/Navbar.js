import React from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b backdrop-blur-lg bg-opacity-80">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <Link className="flex flex-shrink-0 items-center" to="/">
              <img
                className="block h-12 w-auto"
                src="./taxation.png"
                alt="Taxation"
              /> 
              <p className="pl-3 text-2xl font-bold">eKYC</p>
            </Link>
          </div>
          <div className="">
            <ul className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              {isUserSignedIn && (
                <>
                  <Link to="/account">
                    <li className="hover:underline">Account</li>
                  </Link>
                  {userRole === "Taxpayer" && (
                    <>
                      <Link to="/kyc">
                        <li className="hover:underline">KYC</li>
                      </Link>
                      {isKycSubmitted && (
                        <>
                          <Link to="/approved">
                            <li className="hover:underline">Update KYC</li>
                          </Link>
                          <Link to="/my">
                            <li className="hover:underline">My KYC</li>
                          </Link>
                          <Link to="/history">
                            <li className="hover:underline">History</li>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                  {userRole === "Admin" && (
                    <>
                      <Link to="/uploadNID">
                        <li className="hover:underline">Upload NID</li>{" "}
                      </Link>
                      <Link to="/verifiedUserList">
                        <li className="hover:underline">Verified User List</li>
                      </Link>
                      <Link to="/blockList">
                        <li className="hover:underline">Block List</li>
                      </Link>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition duration-300"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              )}
              {!isUserSignedIn && (
                <>
                  <Link to="/login">
                    <li className="text-gray-700 hover:text-indigo-700 text-sm font-medium">
                      Login
                    </li>
                  </Link>
                  <Link to="/signup">
                    <li className="text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm">
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
