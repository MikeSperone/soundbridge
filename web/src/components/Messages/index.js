import { h, Component } from 'preact';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Container';
// import ChatBox from './ChatBox';
import PeopleBox from './PeopleBox';


/* * * * 
 * chat box disabled!!!
 * * * */
const Messages = props => {
    const { audienceMembers, users } = props;
    const style={"height":'300px', "max-height":'300px', "overflow-y": 'scroll'};
    return <Accordion as={Container} id='status-box'>
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
               Messages 
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <Card.Body className="row mr-1">
                    <Col md={4}>
                        <PeopleBox
                            style={style}
                            users={props.users}
                            {...props}
                        />
                    </Col>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>;
}
                    // <Col className="border" md={8}>
                    //     {props.loggedIn && false && (
                    //         <ChatBox style={style} users={props.users} self={props.self} />
                    //     )}
                    // </Col>

export default Messages;
