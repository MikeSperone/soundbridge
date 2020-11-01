import { h, Component } from 'preact';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const Status = (props, children) => (
    <div className='status'>
        <span className={'status-name'}>{props.type}</span>
        <span id={props.type + '-status'} className={'status-value'}>
            { props.display || props.children }
        </span>
    </div>
);

const StatusBox = props => {
    const { solo, isPerformer, performers, audienceMembers } = props;
    return (
        <Accordion id='status-box'>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Status Box
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        { solo && <Status type='solo' display="SOLO" /> }
                        <Status type='role' display={isPerformer ? 'performer' : 'audience'} />
                        <Status type='performers' display={performers.join(', ')} />
                        <Status type='audience' display={audienceMembers} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default StatusBox;
