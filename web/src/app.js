import { h, Component  } from 'preact';
import { Router, Link } from 'preact-router';

// import Header from './header';

import Soundbridge from './routes/soundbridge';
import Test from './routes/test';

export default class App extends Component {
    handleRoute = e => this.currentUrl = e.url;
    render() {
        return (
            <div id="app">
                <h1>
                    <Link activeClassName="active" href="/">Soundbridge</Link>
                </h1>
                <nav>
                    <Link activeClassName="active" href="/test">Test</Link>
                </nav>
                <Router onChange={this.handleRoute}>
                    <Soundbridge path="/" />
                    <Test path="/test" />
                </Router>
            </div>
        );
    }
}

