import { h, Component } from 'preact';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Container';
import ChatBox from './ChatBox';
import PeopleBox from './PeopleBox';

const Messages = props => {
    const { solo, isPerformer, performers, audienceMembers, users, user } = props;
    return <Accordion id='status-box'>
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
               Messages 
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <Card.Body className="row">
                    <Col md><PeopleBox users={props.users} {...props} /></Col>
                    <Col md>
                        {!solo && props.loggedIn && (
                            <ChatBox users={props.users} user={props.user} />
                        )}
                    </Col>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>;
}

export default Messages;
