import { h } from 'preact';

const Soundbridge = () => (
    <div class="soundbridge">
        <h1>Soundbridge Preact!</h1>

        <div class="sensor" id="zero"><div class="value"></div></div>
        <div class="sensor" id="one"><div class="value"></div></div>
        <div class="sensor" id="two"><div class="value"></div></div>
        <div class="sensor" id="three"><div class="value"></div></div>

        <div class="xy-pad">
            <div class="qd sensor" id="zero"><div class="value"></div></div>
            <div class="qd sensor" id="one"><div class="value"></div></div>
            <div class="qd sensor" id="two"><div class="value"></div></div>
            <div class="qd sensor" id="three"><div class="value"></div></div>
        </div>
    </div>
);

export default Soundbridge;
