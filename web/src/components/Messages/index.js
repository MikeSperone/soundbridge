import { h, Component } from 'preact';
import StatusBox from './StatusBox';
import ChatBox from './ChatBox';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Container';

const Messages = props => {
    const { solo, isPerformer, performers, audienceMembers, users, user } = props;
    return <Row>
        <Col md>
            <StatusBox {...props} />
        </Col>
        <Col md>
        {!solo && props.loggedIn && (
            <ChatBox users={props.users} user={props.user} />
        )}
        </Col>
    </Row>;
}

export default Messages;
