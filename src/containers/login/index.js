import { h, Component } from 'preact';
import { useState, useContext } from 'preact/compat';
import Socket from 'context/Socket';
import Solo from 'context/Solo';
import Button from 'react-bootstrap/button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';

export default function Login(props) {

    const soloContext = useContext(Solo);
    const socket = useContext(Socket);
    const handleSolo = e => soloContext.setSolo(e.target.checked);

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, performer, solo } = e.target;

        socket.connected && socket.emit('login', {
            username: encodeURIComponent(username.value),
            requestsPerformer: performer.checked,
            solo: solo.checked
        });
        props.onLogin();
    };

    const availablePerformerSlots = props.availablePerformerSlots;

    return <Col md={{ span: 6, offset: 3  }}>
        <Form onSubmit={handleLogin}>
            <span>Enter your name before joining in:</span>
            <Form.Row>
                <Form.Control className="m-2" autoFocus name="username" type="text" placeholder="your name" />
                <Button className="m-2" variant="outline-primary" type="submit" block>
                    sign in
                </Button>
            </Form.Row>
            <Form.Check
                active={props.connection}
                checked={soloContext.solo}
                onClick={handleSolo}
                name="solo"
                type="checkbox"
                label={"Solo"}
            />
            <Form.Check
                disabled={soloContext.solo}
                checked={availablePerformerSlots && !soloContext.solo}
                name="performer"
                type="checkbox"
                label={"performer (" + ( availablePerformerSlots ? "if" : "not") + " available)"}
            />
        </Form>
    </Col>;
}
