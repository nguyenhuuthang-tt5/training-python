import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import CleanDataPage from "./pages/CleanDataPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  

  return (
    <Routes>

      <Route path="login" element={<LoginPage />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={
          <CleanDataPage />
        } />
        <Route path="/test" element={
          <h1>test</h1>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}