import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminSignIn from "./pages/admin/AdminSignIn";
import UserProfile from "./pages/user/UserProfile";
import EditProfile from "./pages/user/EditProfile";
import { useSelector } from "react-redux";
import PageNotFound from "./pages/404/PageNotFound";
import UserTask from "./pages/user/UserTask";

function App() {
  const { currentUser } = useSelector((state) => state.currentUser);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/task/0" replace />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/admin/login" element={<AdminSignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/dashboard" element={currentUser.isLoggedIn ? <Dashboard /> : <AdminSignIn />} />
      <Route path="/user/profile/:userId" element={currentUser.isLoggedIn ? <UserProfile /> : <SignIn />} />
      <Route path="/user/edit-profile/:userId" element={currentUser.isLoggedIn ? <EditProfile /> : <SignIn />} />
      <Route path="/user/task/:tabValue" element={currentUser.isLoggedIn ? <UserTask /> : <SignIn />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
