import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import MessageBox from 'components/Messages';
import Soundbridge from 'containers/soundbridge';
import Login from 'containers/login';

class App extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        console.info('socket: ', props.socket);
        this.ws = props.socket.socket;
        this.state = {
            solo: false,
            users: {
                availablePerformerSlots: 4,
                all: [],
                performer: [],
                audience: [],
            },
            self: {
                id: 0,
                isPerformer: false,
                type: 'audience',
            },
            settingNumber: Math.floor(Math.random() * 29),
            loggedIn: false,
        }
        this._bind();
    }

    _bind() {
        this.handleRoute = this.handleRoute.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.solo = this.solo.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
    }

    handleRoute(e) { this.currentUrl = e.url; }
    handleLogin({username, requestsPerformer, solo}) {
        window.globalAudioContext = new window.AudioContext();
        if (solo) this.solo();
        else this.ws.emit('login', { username, requestsPerformer, solo });
    }

    refreshUsers({ users }) {
        this.setState(() => ({ users }), () => console.info('refreshUsers, users: ', this.state.users));
    }

    solo() {
        // console.info('App calling solo()');
        this.props.socket.setSolo(true);
        this.setState(() => ({ solo: true }), () => console.info('solo, users: ', this.state.users));
    }

    startWebsocket() {
        this.ws.on('connected', d => {
            console.info('connected');
            this.setState(s => ({
                settingNumber: d.currentSetting,
                users: {...s.users, ...d.users }
            }), () => console.info('users', this.state.users));
        });

        this.ws.on('loggedin', n => {
            const { currentSetting, user, users, solo } = n;
            // console.info('loggedIn: ', n);
            if (n.success) {
                this.setState(() => ({
                    loggedIn: true,
                    settingNumber: currentSetting,
                    solo,
                    self: {
                        id: user.id,
                        name: user.name,
                        type: user.type,
                        isPerformer: user.type === 'performer',
                    },
                    users
                }), () => console.info('logged in, users: ', this.state.users));
            } else {
                this.setState(() => ({solo: true, error: n.error}));
            }
        });

        this.ws.on('user.login', this.refreshUsers);
        this.ws.on('user.exited', this.refreshUsers);
        this.ws.on('setting', this.updateSetting);

        this.ws.on('disconnect', () => {
            console.info('disconnect');
            this.ws.emit('user-left', {
                userType: this.state.self.type,
                name: this.state.self.name,
            });
        });
    }

    updateSetting(n) {
        this.setState({ settingNumber: n.currentSetting});
    }
    componentDidMount() {
        this.startWebsocket();
    }

    render() {
        return <div id="app">
            <nav className="main-nav">
                <h1>
                    <Link activeClassName="active" href="/">Soundbridge</Link>
                </h1>
                <div>{this.state.self.isPerformer ?
                    'Performer' :
                    'Audience Member'
                }</div>
            </nav>
            <Container fluid>
                <MessageBox
                    solo={this.state.solo}
                    loggedIn={this.state.loggedIn}
                    users={this.state.users}
                    self={this.state.self}
                />
                {
                    (this.state.loggedIn || this.state.solo) ?
                        (<Soundbridge
                                path="/"
                                settingNumber={this.state.settingNumber}
                                solo={this.state.solo} 
                                isPerformer={this.state.self.isPerformer}
                        />) :
                        <Login
                            path="/"
                            onLogin={this.handleLogin}
                            availablePerformerSlots={this.state.users.availablePerformerSlots > 0}
                        />
                }
            </Container>
        </div>;
    }
}

export default function SocketedApp(props) {
    const soloSocket = { solo: true, on: () => {}, emit: () => {} };
    const realSocket = () => typeof io === 'function' && io();

    const [ socket, setSocket ] = useState(realSocket || soloSocket);

    function setSolo(isSolo) {
        console.info('setting socket to solo', isSolo);
        if (isSolo) {
            setSocket(soloSocket);
        } else {
            setSocket(realSocket || soloSocket);
        }
    }

    return <Socket.Provider value={{ socket, setSolo }}>
        <SocketConsumerApp {...props} />
    </Socket.Provider>;
};
function SocketConsumerApp(props) {
    return <Socket.Consumer>
        {socket => <App {...props} socket={socket} />}
    </Socket.Consumer>;
};
