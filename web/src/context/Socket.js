import { createContext } from 'preact';

const ws = (typeof io === "function") ?
    io() :
    { solo: true, on: (a,b) => {} };
const Socket = createContext(ws);

export default Socket;
