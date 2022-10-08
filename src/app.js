import "preact/debug";
import "./AudioContextMonkeyPatch.js";
import { h, Fragment, Component } from 'preact';
import { useState, useContext } from 'preact/compat';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';
import Solo from 'context/Solo';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import MessageBox from 'components/Messages';
import Soundbridge from 'containers/soundbridge';
import Login from 'containers/login';
import About from 'containers/About';

const MainNav = () => {
    const solo = useContext(Solo);
    return <nav className="main-nav">
        <h1>
            <Link activeClassName="active" href="/">Soundbridge</Link>
        </h1>
        <div>
            { solo.solo ? 'Solo ' : '' }{ solo.isPerformer ? 'Performer' : 'Audience Member' }
        </div>
    </nav>
};

const WarningBox = props => {
    return <Alert variant="danger" onClose={props.onClose} dismissible>
        <Alert.Heading>{props.error.title}</Alert.Heading>
        <p> {props.error.description}</p>
    </Alert>;
}

class App extends Component {

    //TODO:  I think the best thing to do would be to step through
    //       all the events that are triggered and fired.
    //       Then re-evaluate each event and what it does.
    constructor(props) {
        super(props);
        this.props = props;
        this.ws = props.socket;
        this.solo = props.solo;
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
                type: 'audience',
            },
            settingNumber: Math.floor(Math.random() * 8),
            loggedIn: false,
            error: false,
        };
        this._bind();
    }

    _bind() {
        this.onLoggedIn = this.onLoggedIn.bind(this);
        this.onServerLogin = this.onServerLogin.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
    }

    refreshUsers({ users }) {
        this.setState(() => ({ users }), () => console.info('refreshUsers, users: ', this.state.users));
    }

    updateSetting({ currentSetting }) {
        this.setState(() => ({ settingNumber: currentSetting }));
    }

    onLoggedIn() {
        console.info('handling login');
        window.globalAudioContext = new window.AudioContext();
        console.info('got global audio context: ', window.globalAudioContext);
        if (!this.ws.connected) {
            this.onServerLogin({
                // currentSetting,
                user: {},
                solo: true,
                success: false,
                error: {
                    title: 'Server Error',
                    description: 'No connection to the server.  You are playing Soundbridge as a solo performer.'
                }
            });
        }
    }

    onServerLogin(n) {
        //TODO: I guess this should be fixed in the server:
        //    instead of this next line, the server should
        //    only emit loggedin to the user who logged in
        if (this.state.loggedIn) {
            console.info('already logged in\n', 'login info: ', n);
            return;
        }

        console.info('logging in for the 1st time');

        const { currentSetting, user, users, solo } = n;

        const isSolo = user.type === 'solo' || solo;
        this.solo.setSolo(isSolo);

        const isPerformer = user.type === 'performer' || isSolo;
        this.solo.setIsPerformer(isPerformer);

        this.setState(() => ({
            loggedIn: true,
            self: {
                id: user?.id || 1,
                name: user?.name || '--',
                type: user?.type || 'performer',
            },
            error: n.error || false
        }), () => {
            const message = user ? 'no connection, solo' : 'users:';
            console.info('logged in, ' + message, this.state.users)
        });

        console.info(`${n.success ? '' : 'NOT '}logged in and solo set to ${solo}`);
    }

    componentDidMount() {
        this.ws.on('loggedin', this.onServerLogin);
        // TODO: I think for some reason these are triggering a re-render of
        // the Sensors? or doing something to their state or in-component data.
        // this.ws.on('user.login', this.refreshUsers);
        // this.ws.on('user.exited', this.refreshUsers);
        this.ws.on('setting', this.updateSetting);
        this.ws.on('users-change', this.refreshUsers);

        // this.ws.on('disconnect', () => {
        //     // TODO: I don't think this is necessary
        //     this.ws.emit('user-left', {
        //         userType: this.state.self.type,
        //         name: this.state.self.name,
        //     });
        // });
    }

    render() {
        return <div id="app">
            <MainNav />
            <Container fluid>
                {this.ws.connected &&
                    <MessageBox
                        key="message-box"
                        loggedIn={this.state.loggedIn}
                        users={this.state.users}
                        self={this.state.self}
                    />
                }
                { this.state.error && (
                    <WarningBox
                        error={this.state.error}
                        onClose={() => this.setState({error: null})}
                    />
                )}

                {
                    this.state.loggedIn ?
                        (<Soundbridge
                                path="/"
                                key="soundbridge"
                                settingNumber={this.state.settingNumber}
                        />) :
                        <Fragment key="login-section">
                            <Login
                                path="/"
                                onLogin={this.onLoggedIn}
                                availablePerformerSlots={this.state.users.performer.length < 4}
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

    const socket = useContext(Socket);

    return <Solo.Provider value={{ solo, setSolo, isPerformer, setIsPerformer }}>
        <Solo.Consumer>
            {solo => <App {...props} socket={socket} solo={solo} />}
        </Solo.Consumer>
    </Solo.Provider>;
};
