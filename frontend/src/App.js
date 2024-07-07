import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import Kyc from "./pages/Kyc";
import UserDetails from "./pages/UserDetails";
import Approved from "./pages/Approved";
import My from "./pages/My";
import VerifiedUserListPage from "./pages/VerifiedUserListPage";
import UploadNID from "./pages/UploadNID";
import BlockListPage from "./pages/BlockList";
import History from "./pages/History";
import Verified from "./pages/org/Verified";
import Verifier from "./pages/admin/Verifier";
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  return (
    <ChakraProvider>
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {isUserSignedIn && <Route path="/account" element={<Account />} />}
        {isUserSignedIn && <Route path="/Kyc" element={<Kyc />} />}
        {isUserSignedIn && <Route path="/uploadNID" element={<UploadNID />} />}
        {isUserSignedIn && (
          <Route path="/verifiedUserList" element={
            userRole === "Admin" ? <VerifiedUserListPage /> : <Verified />
          } />
        )}
        {isUserSignedIn && (
          <Route path="/blockList" element={<BlockListPage />} />
        )}
        {isUserSignedIn && (
          <Route path="/user/:nidNumber" element={<UserDetails />} />
        )}
        {isUserSignedIn && <Route path="/approved" element={<Approved />} />}
        {isUserSignedIn && <Route path="/my" element={<My />} />}
        {isUserSignedIn && <Route path="/history" element={<History />} />}
        {isUserSignedIn && <Route path="/verifier" element={<Verifier />} />}
        {isUserSignedIn && <Route path="/ekyc" element={<Verified />} />}
      </Routes>
    </div>
    </ChakraProvider>
  );
}

export default App;
