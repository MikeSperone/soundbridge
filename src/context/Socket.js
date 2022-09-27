import { createContext } from 'preact';
import { io } from 'socket.io-client';

const debug = true;
const wss = debug ? 'ws://localhost:9002/soundbridge' : 'wss://mikesperone.com/soundbridge';
const path = '/soundbridge/sbws/socket.io/';
const theSocket = io.connect(wss, { path });

const Socket = createContext(theSocket);

export default Socket;


// const SocketComponent = ({children}) => {
//     const disconnectedSocket = {
//         solo: true,
//         on: () => {},
//         emit: () => {}
//     };

//     const theSocket = (typeof io === "function") ?
//         io('https://mikesperone.com/soundbridge', {path: '/soundbridge/sbws/socket.io/'}) :
//         disconnectedSocket;

//     const [ socket, setSocket ] = useState(theSocket);
//     const connectToSocket = () => setSocket(theSocket);

//     return <Socket.Provider value={{socket, connectToSocket}}>
//         {children}
//     </Socket.Provider>;
// };
// export default SocketComponent;

