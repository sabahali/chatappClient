import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'react-router-dom';

const LoadingModal = () => {
    const params = useSearchParams()


    return (
        <div className='flex w-screen items-center justify-center flex-col h-screen bg-slate-800 text-slate-300'>
            <CircularProgress color="inherit" />
        </div>
    )
}

export default LoadingModal