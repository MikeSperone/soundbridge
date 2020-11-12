import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import Button from 'react-bootstrap/button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';

export default function Login(props) {

    const [ solo, setSolo ] = useState(false);
    const handleSolo = e => setSolo(e.target.checked);

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, performer, solo } = e.target;
        props.onLogin({
            username: encodeURIComponent(username.value),
            requestsPerformer: performer.checked,
            solo: solo.checked
        });
    }

    const availablePerformerSlots = props.availablePerformerSlots;

    return <Col md={{ span: 6, offset: 3  }}>
        <Form onSubmit={handleLogin}>
            <h1>Login</h1>
            <Form.Row>
                <Form.Control className="m-2" autoFocus name="username" type="text" placeholder="username" />

                <Button className="m-2" variant="outline-primary" type="submit" block>Login</Button>
            </Form.Row>
            <Form.Check
                active={props.connection}
                checked={solo}
                onClick={handleSolo}
                name="solo"
                type="checkbox"
                label={"Solo"}
            />
            <Form.Check
                disabled={solo}
                checked={availablePerformerSlots || solo}
                name="performer"
                type="checkbox"
                label={"performer (" + ( availablePerformerSlots ? "if" : "not") + " available)"}
            />
        </Form>
    </Col>;
}
