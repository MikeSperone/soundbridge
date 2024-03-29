import { h, Component, Fragment } from 'preact';
import { forwardRef  } from 'preact/compat';
import Hint from 'components/Messages/Hint';
import ListGroup from 'react-bootstrap/ListGroup';

            // { props.display || props.children }
            // <ListGroup.Item id={props.type + '-status'} className={'status-value'}>

const People = forwardRef((props, ref) => {

    const { users } = props;
    const User = props => {
        if (props.user) {
            <ListGroup.Item key={props.user.name + "people"} variant={props.variant}>
                {props.user.name}
            </ListGroup.Item>
        } else {
            console.warn('User not found.');
        }
    }

    const Performers = users.performer.map(u => <User variant="success" user={users.all[u]} />);
    const Audience = users.audience.map(u => <User variant="" user={users.all[u]} />);

    return (
        <ListGroup ref={ref} variant="flush">
            <ListGroup.Item className={'status-name'}>{props.type}</ListGroup.Item>
            {Performers}
            {Audience}
        </ListGroup>
    );
});

const PeopleBox = props => {
    const { solo, users, self } = props;
    const roleHint = "You are either a performer or audience member.  Performers have control of the instrument and can start and change the sounds.  Audience members can only listen and enjoy the music.";
    return <div style={props.style}>
        // { solo && <People users={users} type='solo' display="SOLO" /> }
        <Hint id="role" hint={roleHint}>
            <span>{self.isPerformer ? 'performer' : 'audience'}</span>
        </Hint>
        {!!props.users && <People type='people' users={users} /> }
    </div>;
}
        // <People type='performer' display={performer.join(', ')} />
        // <People type='audience' display={audienceMembers} />

export default PeopleBox;

