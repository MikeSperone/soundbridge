import { h, Component } from 'preact';
import { forwardRef  } from 'preact/compat';
import ChatBox from './ChatBox';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Hint from 'components/Messages/Hint';

const Status = forwardRef((props, ref) => (
    <div className='status' ref={ref}>
        <span className={'status-name'}>{props.type}</span>
        <span id={props.type + '-status'} className={'status-value'}>
            { props.display || props.children }
        </span>
    </div>
));

const StatusBox = props => {
    const { solo, isPerformer, performers, audienceMembers } = props;
    const roleHint = "You are either a performer or audience member.  Performers have control of the instrument and can start and change the sounds.  Audience members can only listen and enjoy the music.";
    return (
        <Accordion id='status-box'>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Status Box
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Col>
                            { solo && <Status type='solo' display="SOLO" /> }
                            <Hint id="role" hint={roleHint}>
                                <Status type='role' display={isPerformer ? 'performer' : 'audience'} />
                            </Hint>
                            <Status type='performers' display={performers.join(', ')} />
                            <Status type='audience' display={audienceMembers} />
                        </Col>
                        <Col>
                        {!solo && props.loggedIn && (
                            <ChatBox users={props.users} user={props.user} />
                        )}
                        </Col>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default StatusBox;
