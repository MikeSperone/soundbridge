import { h, Component } from 'preact';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Container';
import ChatBox from './ChatBox';
import PeopleBox from './PeopleBox';


const Messages = props => {
    const { solo, audienceMembers, users } = props;
    const style={"height":'300px', "max-height":'300px', "overflow-y": 'scroll'};
    return <Accordion as={Container} id='status-box'>
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
               Messages 
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <Card.Body className="row">
                    <Col md={4}><PeopleBox style={style} users={props.users} {...props} /></Col>
                    <Col md={8}>
                        {!solo && props.loggedIn && (
                            <ChatBox style={style} users={props.users} self={props.self} />
                        )}
                    </Col>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>;
}

export default Messages;
