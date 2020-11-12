import { createContext } from 'preact';

// const soloSocket = { solo: true, on: () => {}, emit: () => {} };

// const toggleSocket = (x) => x ?
//     io() :
//     soloSocket;
// const initialSocket = toggleSocket(typeof io === "function");

const Socket = createContext(null);

export default Socket;
