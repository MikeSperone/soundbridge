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
        this.ws = props.socket;
        this.state = {
            users: {
                availablePerformerSlots: 4,
                all: [],
                performer: [],
                audience: [],
                self: {
                    id: 0,
                    isPerformer: false,
                    type: 'audience',
                },
            },
            settingNumber: Math.floor(Math.random() * 29),
            loggedIn: false,
        }
        this._bind();
    }

    _bind() {
        this.handleRoute = this.handleRoute.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
    }

    handleRoute(e) { this.currentUrl = e.url; }
    handleLogin({username, requestsPerformer}) {
        window.globalAudioContext = new window.AudioContext();
        this.ws.emit('login', { username, requestsPerformer });
    }

    refreshUsers({ users }) {
        this.setState(() => ({ users }));
    }


    startWebsocket() {
        this.ws.on('connection', d => {
            console.info('connection: ', d);
            this.setState(s => ({
                settingNumber: d.currentSetting,
                users: {...s.users, ...d.users }
            }));
        });

        this.ws.on('loggedin', n => {
            const { currentSetting, user, users } = n;
            if (n.success) {
                this.setState(() => ({
                    loggedIn: true,
                    settingNumber: currentSetting,
                    solo: false,
                    users: {
                        ...users,
                        self: {
                            id: user.id,
                            name: user.name,
                            type: user.type,
                            isPerformer: user.type === 'performer',
                        },
                    }
                }));
            } else {
                this.setState(() => ({solo: true, error: n.error}))
            }
        });

        this.ws.on('user.login', this.refreshUsers);
        this.ws.on('user.exited', this.refreshUsers);

        if (!this.state.solo) {
            this.ws.on('setting', n => {
                this.setState({ settingNumber: n.currentSetting});
            });
        }

        this.ws.on('disconnect', () => {
            this.ws.emit('user-left', {
                userType: this.state.users.self.type,
                name: 'anonymous'
            });
        });
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
                <div>{this.state.users.self.isPerformer ?
                    'Performer' :
                    'Audience Member'
                }</div>
            </nav>
            <Container fluid>
                <MessageBox
                    solo={this.state.solo}
                    loggedIn={this.state.loggedIn}
                    users={this.state.users}
                />
                {
                    this.state.loggedIn ?
                        (<Soundbridge
                                path="/"
                                settingNumber={this.state.settingNumber}
                                socket={this.props.socket}
                                solo={this.state.solo} 
                                isPerformer={this.state.users.self.isPerformer}
                        />) :
                        <Login
                            path="/"
                            onLogin={this.handleLogin}
                            availablePerformerSlots={this.state.users.availablePerformerSlots > 0}
                            socket={this.props.socket}
                        />
                }
            </Container>
        </div>;
    }
}

export default function SocketedApp(props) {
    return <Socket.Consumer>
        {socket => <App {...props} socket={socket} /> }
    </Socket.Consumer>;
};
