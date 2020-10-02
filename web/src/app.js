import { h, Component } from 'preact';
import { Router, Link } from 'preact-router';
import Socket from 'context/Socket';

// import Header from './header';

import Soundbridge from './containers/soundbridge';
// import Login from './containers/login';
// import Lobby from './containers/lobby';

class App extends Component {
    handleRoute = e => this.currentUrl = e.url;
    render() {
        return (
            <div id="app">
                <nav className="main-nav">
                    <h1>
                        <Link activeClassName="active" href="/">Soundbridge</Link>
                    </h1>
                    <Link activeClassName="active" href="/test">Test</Link>
                </nav>
                <Soundbridge path="/" />
            </div>
        );
    }
}

export default App;
