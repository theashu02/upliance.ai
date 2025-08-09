import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import CreatePage from "./pages/Create";
import MyFormsPage from "./pages/MyFormsPage";
import Preview from "./pages/Preview";
import OpeningToast from "./components/OpeningToast";

export default function App() {
  return (
    <>
      <div className="flex w-screen h-screen bg-[#f8f2dc] font-poppins">
        <Sidebar />
        <Box component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <Routes>
            <Route path="/create" element={<CreatePage />} />
            <Route path="/my-forms" element={<MyFormsPage />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="*" element={<CreatePage />} />
          </Routes>
        </Box>
      </div>
      <OpeningToast />
    </>
  );
}
