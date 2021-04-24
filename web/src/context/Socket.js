import { createContext } from 'preact';
import { io } from 'socket.io-client';

const debug = false;
const wss = debug ? 'wss://localhost:9002' : 'wss://mikesperone.com/soundbridge';
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

