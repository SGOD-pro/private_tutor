import React from 'react'

function Loader() {
    return (
        <>
            <script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/infinity.js"></script>

            <l-infinity
                size="55"
                stroke="4"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.3"
                color="#00ADB5"
            ></l-infinity>
        </>
    )
}

export default Loader