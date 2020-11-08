import { h, Fragment, Component } from 'preact';
import { useState } from 'preact/compat';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Socket from 'context/Socket';


const ChatText = props =>  <ListGroup style={{height:'300px', "max-height":'300px', "overflow-y": 'scroll'}} className="flex-column-reverse">
    {props.conversation.map(line => <ListGroup.Item>
            <div className="w-25">{props.allUsers[line.userId].name + ": "}</div>
            <div id="chat-message" className="w-75">{decodeURIComponent(line.msg)}</div>
        </ListGroup.Item>
    ).reverse()}
</ListGroup>;

class ChatBox extends Component{

    constructor(props) {
        super(props);
        this.props = props;

        this.users = props.users;
        this.user = props.user;
        console.info('user: ', this.user);
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
            <ChatText allUsers={this.props.users.all} conversation={this.state.conversation} />
            <Form.Row controlId="exampleForm.ControlTextarea1">
                <Form.Control className="flex-1" value={this.state.textbox} name="message" type="text" placeholder="send a message"/>
                <Button variant="primary" type="submit">Send</Button>
            </Form.Row>
        </Form>;
    }
}

export default function SocketedChatBox(props) {
    return <Socket.Consumer>
        {socket => <ChatBox {...props } socket={socket} />}
    </Socket.Consumer>;
};

