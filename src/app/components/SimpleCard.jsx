import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';



const SimpleCard = ({ batch, time }) => {
    const days = ["sun", "mon", "tue", "wed", "thrus", "fri", "sat"];
    const [batchCard, setBatchCard] = useState({
        name: "",
        time: ""
    })
    useEffect(() => {
        const currentDate = new Date();
        const currentDayIndex = currentDate.getDay();
        axios.get(`/api/batches/nextBatch?day:${days[currentDayIndex]}`)
            .then((response) => { setBatch(response.data) })
            .catch(error => console.error(error));
    }, [])

    return (
        <div className="card" >
            <Card title={batch} >
                <p className=' no-underline'>Time: {time}</p>
            </Card>
        </div>
    );
};

export default SimpleCard;
