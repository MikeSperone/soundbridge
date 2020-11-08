import { h, Component, Fragment } from 'preact';
import { forwardRef  } from 'preact/compat';
import Hint from 'components/Messages/Hint';
import ListGroup from 'react-bootstrap/ListGroup';

            // { props.display || props.children }
            // <ListGroup.Item id={props.type + '-status'} className={'status-value'}>

const People = forwardRef((props, ref) => {

    const { users } = props;
    const User = props => <ListGroup.Item variant={props.variant}>
        {props.user.name}
    </ListGroup.Item>;

    const Performers = users.performer.map(u => <User variant="success" user={users.all[u]} />);
    const Audience = users.audience.map(u => <User variant="" user={users.all[u]} />);

    return (
        <ListGroup ref={ref}>
            <ListGroup.Item className={'status-name'}>{props.type}</ListGroup.Item>
            {Performers}
            {Audience}
        </ListGroup>
    );
});

const PeopleBox = props => {
    const { solo, isPerformer, users } = props;
    const roleHint = "You are either a performer or audience member.  Performers have control of the instrument and can start and change the sounds.  Audience members can only listen and enjoy the music.";
    return <Fragment>
        { solo && <People type='solo' display="SOLO" /> }
        <Hint id="role" hint={roleHint}>
            <span>{isPerformer ? 'performer' : 'audience'}</span>
        </Hint>
        {!!props.users && <People type='people' users={users} /> }
    </Fragment>;
}
        // <People type='performer' display={performer.join(', ')} />
        // <People type='audience' display={audienceMembers} />

export default PeopleBox;

