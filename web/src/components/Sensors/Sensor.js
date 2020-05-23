import { h  } from 'preact';

const Sensor = props => {
    const type = props.type || '';
    return <div class={`sensor ${type}`} id={props.name}><div class="value"></div></div>;
}

export default Sensor;
