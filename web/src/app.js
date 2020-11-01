import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';

// import Header from './header';

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
            user: {
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
        console.info('hello username: ', username);
        this.ws.emit('login', { username, requestsPerformer });
    }

    refreshUserList(users) {
        console.info('users: ', users);
        console.info('users.all', users.all);
        const performers = users.performer.map(p => users.all[p].name);
        const audience = users.audience.map(a => users.all[a].name);
        this.setState(() => ({
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
            console.info('joined: ', n);
            const { currentSetting, user, users } = n;
            if (n.success) {
                this.setState(() => ({
                    loggedIn: true,
                    settingNumber: currentSetting,
                    solo: false,
                    user: {
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
            console.info('user gone');
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
                <StatusBox
                    solo={this.state.solo}
                    isPerformer={this.state.user.isPerformer}
                    performers={this.state.performers}
                    audienceMembers={this.state.audience}
                />
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
            </div>
        );
    }
}

export default function SocketedApp(props) {
    return <Socket.Consumer>
        {socket => <App {...props} socket={socket} /> }
    </Socket.Consumer>;
};
