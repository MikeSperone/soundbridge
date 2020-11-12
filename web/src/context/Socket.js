import { createContext } from 'preact';


const theSocket = (typeof io === "function") ?
    io() :
    {
        solo: true,
        on: () => {},
        emit: () => {}
    };

const Socket = createContext(theSocket);

export default Socket;
