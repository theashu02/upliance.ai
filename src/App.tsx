import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './components/Sidebar';
import CreatePage from './pages/Create';
import PreviewPage from './pages/Preview';
import MyFormsPage from './pages/MyForms';

export default function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Routes>
          <Route path="/create"   element={<CreatePage />} />
          <Route path="/preview"  element={<PreviewPage />} />
          <Route path="/my-forms" element={<MyFormsPage />} />
          <Route path="*"          element={<CreatePage />} />
        </Routes>
      </Box>
    </Box>
  );
}