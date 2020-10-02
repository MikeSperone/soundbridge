import { h, render  } from 'preact';

let root;
const appRootElement = document.getElementById('root');
export default function init(Page) {
    root = render(<Page />, appRootElement, root);
}

// if (module.hot) module.hot.accept('./components/app', () => requestAnimationFrame(init) );
