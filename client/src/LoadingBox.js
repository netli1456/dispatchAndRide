import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function LoadingBox() {
  return (
    <div style={{width:"95vw", margin:"auto"}}  className='d-flex aling-items-center flex-wrap gap-1 justify-content-between my-4'>
      
           
        
      {Array.from(new Array(18)).map((index) => (
        <div key={index}>
          <div>
          <Skeleton variant="rectangular" height={200} width={200}/>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingBox;
