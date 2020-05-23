import { h, Component  } from 'preact';
import { Router } from 'preact-router';
import jquery from 'jquery';

// import Header from './header';

import Soundbridge from './routes/soundbridge';

export default class App extends Component {
    handleRoute = e => this.currentUrl = e.url;
    componentDidMount() {
        window.$ = jquery;
    }
    render() {
        return (
            <div id="app">
                <h1>HELLLO</h1>
                <Router onChange={this.handleRoute}>
                    <Soundbridge path="/" />
                </Router>
            </div>
        );
    }
}

