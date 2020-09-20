import { h, render  } from 'preact';
import App from './app';

let root;
const appRootElement = document.getElementById('root');
function init() {
    root = render(<App />, appRootElement, root);
}
init();

if (module.hot) module.hot.accept('./components/app', () => requestAnimationFrame(init) );
