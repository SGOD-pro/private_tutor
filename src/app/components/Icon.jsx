"use client";

import React from 'react';
import Script from 'next/script';

function Icon({ src, secondaryColor }) {
    return (
        <>
            <Script 
                src="https://cdn.lordicon.com/lordicon.js" 
                strategy="afterInteractive" 
            />
            <lord-icon
                src={src}
                trigger="hover"
                stroke="bold"
                state="hover-swirl"
                colors={`primary:#EEEEEE,secondary:${secondaryColor || "#EEEEEE"}`}
                style={{ width: "45px", height: "45px" }}
            >
            </lord-icon>
        </>
    );
}

export default Icon;
