"use client"
import React from 'react'

function Icon({ src }) {
    return (
        <>
            <script src="https://cdn.lordicon.com/lordicon.js"></script>
            <lord-icon
                src={src}
                trigger="hover"
                stroke="bold"
                state="hover-nodding"
                colors="primary:#EEEEEE,secondary:#EEEEEE"
                style={{ width: "45px", height: "45px" }}>
            </lord-icon>
        </>
    )
}

export default Icon