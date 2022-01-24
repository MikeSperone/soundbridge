import { h, Component, Fragment } from 'preact';
import { forwardRef  } from 'preact/compat';
import { useContext } from 'preact/hooks';
import Solo from 'context/Solo';
import Hint from 'components/Messages/Hint';

const Status = forwardRef((props, ref) => (
    <div className='status' ref={ref}>
        <span className={'status-name'}>{props.type}</span>
        <span id={props.type + '-status'} className={'status-value'}>
            { props.display || props.children }
        </span>
    </div>
));

const StatusBox = props => {
    const { isPerformer } = props;
    const solo = useContext(Solo);
    const roleHint = "You are either a performer or audience member.  Performers have control of the instrument and can start and change the sounds.  Audience members can only listen and enjoy the music.";
    return <Fragment>
        { solo && <Status type='solo' display="SOLO" /> }
        <Hint id="role" hint={roleHint}>
            <Status
                type='role'
                display={isPerformer ? 'performer' : 'audience'}
            />
        </Hint>
    </Fragment>;
}

export default StatusBox;
