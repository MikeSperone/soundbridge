import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Socket from 'context/Socket';

/* * * * 
 * chat box disabled in Messages/index.js !!!
 * * * */

const ChatText = props =>  <ListGroup className="border" style={props.style} variant="flush" className="flex-column-reverse">
    {props.conversation.map(line => {
        const name = props.allUsers[line.userId].name;
        return <Row key={name + "chat"}>
            <Col xs={3} className="pr-1 border-right">{name + ": "}</Col>
            <Col xs={9} id="chat-message">{decodeURIComponent(line.msg)}</Col>
        </Row>
    }).reverse()}
</ListGroup>;

class ChatBox extends Component{

    constructor(props) {
        super(props);
        this.props = props;

        this.users = props.users;
        this.user = props.self;
        this.state = {
            conversation: [],
            textbox: ''
        }
        this._bind();
    }

    _bind() {
        this.handleMessageSend = this.handleMessageSend.bind(this);
        this.handleMessageReceive = this.handleMessageReceive.bind(this);
    }

    componentDidMount() {
        this.props.socket.on('chat.inbox', this.handleMessageReceive);
    }

    componentShouldUpdate() {
        return true;
    }

    handleMessageSend(e) {
        e.preventDefault();
        const msg = encodeURIComponent(e.target.message.value);

        const data = { userId: this.user.id, msg };
        console.info('sending message', data);
        this.props.socket.emit('chat', data);
    }

    handleMessageReceive(d) {
        this.setState(s => {
            s.conversation.push(d);
            s.textbox = '';
            return s;
        });
    }

    render() {
        return <Form onSubmit={this.handleMessageSend}>
            <ChatText
                style={this.props.style}
                allUsers={this.props.users.all}
                conversation={this.state.conversation}
            />
            <Form.Row className="row" controlId="exampleForm.ControlTextarea1">
                <Form.Control
                    type="text"
                    className="flex-1 col-10"
                    name="message"
                    value={this.state.textbox}
                    placeholder="send a message"
                />
                <Button style={{height: 'auto'}} className="col-2" variant="primary" type="submit">Send</Button>
            </Form.Row>
        </Form>;
    }
}

export default function SocketedChatBox(props) {
    return <Socket.Consumer>
        {(socket) => <ChatBox {...props } socket={socket} />}
    </Socket.Consumer>;
};

