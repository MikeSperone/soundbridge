import { h, Component } from 'preact';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Hint = (props, children) => (
    <OverlayTrigger
        key={props.id}
        placement={props.placement}
        overlay={
            <Tooltip id={`tooltip-${id}`}>
                {props.hint}
            </Tooltip>
        }
    >
        {children}
    </OverlayTrigger>
);

export default Hint;
