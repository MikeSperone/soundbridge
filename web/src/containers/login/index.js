import { h, Component } from 'preact';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/button';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';

export default function Login(props) {

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, performer } = e.target;
        props.onLogin({
            username: encodeURIComponent(username.value),
            requestsPerformer: performer.value === 'on'
        });
    }

    const availablePerformerSlots = props.availablePerformerSlots;

    return <Form onSubmit={handleLogin}>
        <h1>Login</h1>
        <Form.Row>
            <Form.Control autoFocus name="username" type="text" placeholder="username" />

            <Button variant="outline-primary" type="submit" block>Login</Button>
        </Form.Row>
        <Form.Check
            active={availablePerformerSlots}
            checked={availablePerformerSlots}
            name="performer"
            type="checkbox"
            label={"performer (" + ( availablePerformerSlots ? "if" : "not") + " available)"}
        />
    </Form>
}

