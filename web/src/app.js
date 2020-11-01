import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import StatusBox from 'components/Messages/StatusBox';
import Soundbridge from 'containers/soundbridge';
import Login from 'containers/login';
// import Lobby from './containers/lobby';

class App extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.ws = props.socket;
        this.state = {
            users: {},
            user: {
                id: 0,
                isPerformer: false,
                type: 'audience',
            },
            settingNumber: Math.floor(Math.random() * 29),
            loggedIn: false,
            performers: [],
            audience: [],
        }
        this._bind();
    }

    _bind() {
        this.handleRoute = this.handleRoute.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
        this.refreshUserList = this.refreshUserList.bind(this);
    }

    handleRoute(e) { this.currentUrl = e.url; }
    handleLogin({username, requestsPerformer}) {
        window.globalAudioContext = new window.AudioContext();
        this.ws.emit('login', { username, requestsPerformer });
    }

    refreshUserList(users) {
        const performers = users.performer.map(p => decodeURIComponent(users.all[p].name));
        const audience = users.audience.map(a => decodeURIComponent(users.all[a].name));
        this.setState(() => ({
            users,
            performers,
            audience
        }));
    }

    startWebsocket() {
        this.ws.on('connection', d => {
            this.setState(() => ({ settingNumber: d.currentSetting }));
            this.refreshUserList(d.users);
        });

        this.ws.on('loggedin', n => {
            const { currentSetting, user, users } = n;
            if (n.success) {
                this.setState(() => ({
                    loggedIn: true,
                    settingNumber: currentSetting,
                    solo: false,
                    user: {
                        id: user.id,
                        name: user.name,
                        type: user.type,
                        isPerformer: user.type === 'performer',
                    },
                }));
                this.refreshUserList(users);
            } else {
                this.setState(() => ({solo: true, error: n.error}))
            }
        });

        this.ws.on('user.login', n => {
            this.refreshUserList(n.users);
        });

        this.ws.on('user.exited', n => {
            this.refreshUserList(n.users)
        });

        if (!this.state.solo) {
            this.ws.on('setting', n => {
                this.setState({ settingNumber: n.currentSetting});
            });
        }

        this.ws.on('disconnect', () => {
            this.ws.emit('user-left', {
                userType: this.state.user.type,
                name: 'anonymous'
            });
        });
    }

    componentDidMount() {
        this.startWebsocket();
    }

    render() {
        return (
            <div id="app">
                <nav className="main-nav">
                    <h1>
                        <Link activeClassName="active" href="/">Soundbridge</Link>
                    </h1>
                    <Link activeClassName="active" href="/login">Login</Link>
                    <Link activeClassName="active" href="/test">Test</Link>
                </nav>
                <Container>
                    <Row>
                            <StatusBox
                                solo={this.state.solo}
                                loggedIn={this.state.loggedIn}
                                users={this.state.users}
                                user={this.state.user}
                                isPerformer={this.state.user.isPerformer}
                                performers={this.state.performers}
                            />
                    </Row>
                    <Router>
                        {
                            this.state.loggedIn ?
                                (<Soundbridge
                                        path="/"
                                        settingNumber={this.state.settingNumber}
                                        socket={this.props.socket}
                                        solo={this.state.solo} 
                                        isPerformer={this.state.user.isPerformer}
                                />) :
                                <Login
                                    path="/"
                                    onLogin={this.handleLogin}
                                    availablePerformerSlots={this.state.performers.length <= 4}
                                    socket={this.props.socket}
                                />
                        }
                    </Router>
                </Container>
            </div>
        );
    }
}

export default function SocketedApp(props) {
    return <Socket.Consumer>
        {socket => <App {...props} socket={socket} /> }
    </Socket.Consumer>;
};
