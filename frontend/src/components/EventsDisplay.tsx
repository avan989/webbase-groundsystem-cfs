import React, { useEffect} from 'react';

const EventsDisplay = () => {

    useEffect( () => {
        console.log("This is useeffect");
        const socketPath = "ws://localhost:8000/websocket"

        const socketGlobal = new WebSocket(socketPath);

        socketGlobal.onopen = (event) => {
            socketGlobal.onmessage = (evt) => {
                console.log(evt);
            }
        }
    });

    return (
        <div>
            <h1> This is Event screen </h1>
        </div>
    )
}

export default EventsDisplay

