import { h, Component } from 'preact';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Hint = (props) => (
    <OverlayTrigger
        key={props.id}
        placement={props.placement || "bottom"}
        overlay={
            <Tooltip id={`tooltip-${props.id}`}>
                {props.hint}
            </Tooltip>
        }
    >
        {props.children}
    </OverlayTrigger>
);

export default Hint;
