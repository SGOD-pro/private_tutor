"use client"
import React from 'react'

function Icon({ src,secondaryColor }) {
    return (
        <>
            <script src="https://cdn.lordicon.com/lordicon.js"></script>
            <lord-icon
                src={src}
                trigger="hover"
                stroke="bold"
                state="hover-swirl"
                colors={`primary:#EEEEEE,secondary:${secondaryColor||"#EEEEEE"}`}
                style={{ width: "45px", height: "45px" }}>
            </lord-icon>
        </>
    )
}

export default Icon