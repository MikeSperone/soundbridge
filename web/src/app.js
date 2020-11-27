import "preact/debug";
import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';
import Solo from 'context/Solo';
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
        this.ws = props.socket;
        this.solo = props.solo.solo;
        this.state = {
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
        };
        this._bind();
    }

    _bind() {
        this.handleRoute = this.handleRoute.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.noConnectionLogin = this.noConnectionLogin.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
    }

    handleRoute(e) { this.currentUrl = e.url; }
    handleLogin({username, requestsPerformer, solo}) {
        window.globalAudioContext = new window.AudioContext();
        this.props.solo.changeSolo(solo);
        if (this.ws.disconnected) {
            this.noConnectionLogin();
        } else {
            this.ws.emit('login', { username, requestsPerformer, solo });
        }
    }

    refreshUsers({ users }) {
        this.setState(() => ({ users }), () => console.info('refreshUsers, users: ', this.state.users));
    }

    startWebsocket() {

        this.ws.on('loggedin', n => {
            console.info('loggedin');
            const { currentSetting, user, users, solo } = n;
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
            // TODO: I don't think this is necessary
            this.ws.emit('user-left', {
                userType: this.state.self.type,
                name: this.state.self.name,
            });
        });
    }

    updateSetting(n) {
        this.setState({ settingNumber: n.currentSetting});
    }

    noConnectionLogin() {
        this.setState(() => ({
            loggedIn: true,
            solo: true,
            self: {
                id: 1,
                name: '--',
                type: 'performer',
                isPerformer: true,
            },
        }), () => console.info('not logged in, solo'));
    }

    componentDidMount() {
        this.ws.on('connected', d => {
            this.startWebsocket();
            this.setState(s => ({
                settingNumber: d.currentSetting,
                users: {...s.users, ...d.users }
            }), () => console.info('users', this.state.users));
        });
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
                {this.ws.connected &&
                    <MessageBox
                        solo={this.state.solo}
                        loggedIn={this.state.loggedIn}
                        users={this.state.users}
                        self={this.state.self}
                    />
                }
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

//TODO: this is ugly, I know there must be a nicer way to write this
export default function SoloedApp(props) {

    const [ solo, setSolo ] = useState(false);

    const changeSolo = (isSolo) => {
        setSolo(isSolo);
        console.info('isSolo: ', isSolo);
    }

    return <Solo.Provider value={{ solo, changeSolo }}>
        <SocketedApp {...props} />
    </Solo.Provider>;
};

function SocketedApp(props) {
    return <Socket.Consumer>
        {socket => <Solo.Consumer>
            {solo => <App {...props} socket={socket} solo={solo} />}
        </Solo.Consumer>}
    </Socket.Consumer>;
};
