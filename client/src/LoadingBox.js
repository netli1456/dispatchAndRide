import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function LoadingBox() {
  return (
    <Box sx={{ pt: 0.5 }}>
    <Skeleton />
    <Skeleton width="60%" />
  </Box>
  );
}

export default LoadingBox;
