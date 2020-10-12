import { h, Component } from 'preact';

const Status = (props, children) => (
    <div className='status'>
        <span className={'status-name'}>{props.type}</span>
        <span id={props.type + '-status'} className={'status-value'}>
            { props.display || props.children }
        </span>
    </div>
);

const StatusBox = props => {
    const { solo, isLoggedIn, isPerformer, performers, audienceMembers } = props;
    var statusMessage = `${(isLoggedIn || "not")} logged in`;
    const roleMessage = ` as a${isPerformer ? " performer" : "n audience member"}.`;
    if (isLoggedIn) statusMessage += roleMessage;
            // <Status type='login' display={isLoggedIn ? 'logged in' : 'not logged in'} />
            // <Status type='role' display={isPerformer ? 'performer' : 'audience'} />
    return (
        <div id='status-box'>
            { solo && <Status type='solo' display="SOLO" /> }
            <Status type='role' display={statusMessage} />
            <Status type='performers' display={performers.join(', ')} />
            <Status type='audience' display={audienceMembers} />
        </div>
    );
}

export default StatusBox;
