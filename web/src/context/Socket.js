import { createContext } from 'preact';


const theSocket = (typeof io === "function") ?
    io() :
    {
        disconnected: true,
        solo: true,
        on: () => {},
        emit: () => {}
    };

const Socket = createContext(theSocket);

export default Socket;
