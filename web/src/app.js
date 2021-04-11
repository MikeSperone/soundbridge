import "preact/debug";
import "./AudioContextMonkeyPatch.js";
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
import About from 'containers/About';

class App extends Component {

    //TODO:  I think the best thing to do would be to step through
    //       all the events that are triggered and fired.
    //       Then re-evaluate each event and what it does.
    constructor(props) {
        super(props);
        this.props = props;
        this.ws = props.socket;
        this.getSocket = props.connectToSocket;
        this.solo = props.solo.solo;
        this.state = {
            connected: false,
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
        console.info('handling login');
        window.globalAudioContext = new window.AudioContext();
        this.props.solo.changeSolo(solo);
        this.setState(() => ({connected: this.ws.connected}),
            () => this.ws.emit(
                'login',
                { username, requestsPerformer, solo }
            ));
    }

    refreshUsers({ users }) {
        this.setState(() => ({ users }), () => console.info('refreshUsers, users: ', this.state.users));
    }

    startWebsocket() {
        this.ws.on('connected', d => {
            // TODO: investigate this.  I don't think this event fires
            this.setState(s => ({
                settingNumber: d.currentSetting,
                users: {...s.users, ...d.users }
            }), () => console.info('users', this.state.users));
        });

        this.ws.on('loggedin', n => {
            //TODO: I guess this should be fixed in the server:
            //    instead of this next line, the server should
            //    only emit loggedin to the user who logged in
            if (this.state.loggedIn) {
                console.info('already logged in');
                console.info('login info: ', n);
                return;
            }
            console.info('logging in for the 1st time');
            const { currentSetting, user, users, solo } = n;
            this.props.solo.changePerformerStatus(user.type === 'performer');
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

        // TODO: I think for some reason these are triggering a re-render of 
        // the Sensors? or doing something to their state or in-component data.
        // this.ws.on('user.login', this.refreshUsers);
        // this.ws.on('user.exited', this.refreshUsers);
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
                {this.state.connected &&
                    <MessageBox
                        solo={this.state.solo}
                        loggedIn={this.state.loggedIn}
                        users={this.state.users}
                        self={this.state.self}
                    />
                }
                {
                    (this.state.connected || this.state.solo) ?
                        (<Soundbridge
                                path="/"
                                settingNumber={this.state.settingNumber}
                                solo={this.state.solo} 
                                isPerformer={this.state.self.isPerformer}
                        />) :
                        <Fragment>
                            <Login
                                path="/"
                                onLogin={this.handleLogin}
                                availablePerformerSlots={this.state.users.availablePerformerSlots > 0}
                            />
                            <About />
                        </Fragment>
                }
            </Container>
        </div>;
    }
}

//TODO: this is ugly, I know there must be a nicer way to write this
export default function SoloedApp(props) {

    const [ solo, setSolo ] = useState(false);
    const [ isPerformer, setIsPerformer ] = useState(false);
    const changeSolo = isSolo => setSolo(isSolo);
    const changePerformerStatus = isPerformer => setIsPerformer(isPerformer);

    return <Solo.Provider value={{ solo, changeSolo, isPerformer, changePerformerStatus }}>
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
