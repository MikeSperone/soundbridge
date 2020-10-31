import { h, Component } from 'preact';
import Form from 'react-bootstrap/form';
import Button from 'react-bootstrap/button';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/scss/bootstrap.scss';

export default function Login(props) {

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, performer } = e.target;
        props.onLogin({
            username: username.value,
            requestsPerformer: performer.value === 'on'
        });
    }

    return <Form onSubmit={handleLogin}>
        <h1>Login</h1>
        <Form.Control name="username" type="text" placeholder="username" />
        <Form.Check name="performer" type="checkbox" label="performer (if available)" />
        <Button type="submit">Login</Button>
    </Form>
}

