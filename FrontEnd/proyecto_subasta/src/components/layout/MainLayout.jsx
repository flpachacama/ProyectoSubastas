import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
          px: 2,
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 