import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import axios from 'axios';



const SimpleCard = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
    const [batchCard, setBatchCard] = useState({
        name: "",
        time: ""
    })
    function gettime(date){
        const startTime = new Date(date);
        const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric' };
        return startTime.toLocaleTimeString('en-US', options);
    }
    useEffect(() => {
        const currentDate = new Date();
        const currentDayIndex = currentDate.getDay();
        axios.get(`/api/batches/nextBatch?day=${days[currentDayIndex]}`)
            .then((response) => {
                setBatchCard({
                    name: response.data.data.subject,
                    time:`${response.data.data.startTime} - ${response.data.data.endTime}`
                })
            })
            .catch(error => console.error(error));
    }, [])

    return (
        <div className="card w-full h-full p-2" key={batchCard.name} >
        {batchCard.name!==""?
            <Card title={batchCard.name} className='h-full'>
                <p className=' no-underline'>Time: {batchCard.time}</p>
            </Card>
            :
            <h2 className="text-xl">No more Batches for today</h2>
        }
        </div>
    );
};

export default SimpleCard;
