import { h, Component  } from 'preact';
import { Router } from 'preact-router';

// import Header from './header';

import Soundbridge from './routes/soundbridge';

export default class App extends Component {
    handleRoute = e => this.currentUrl = e.url;
    componentDidMount() {
        window.$ = require('jquery');
        require('./js/index.js');
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

