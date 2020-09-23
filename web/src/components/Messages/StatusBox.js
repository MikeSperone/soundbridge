import { h, Component } from 'preact';

const Status = (props, children) => (
    <span id={props.type + '-status'} className='status'>
        {props.display || props.children}
    </span>
);

const StatusBox = props => {
    const { solo, isPerformer, performers, audienceMembers } = props;
    return (
        <div id='status-box'>
            { solo && <Status type='solo' display="SOLO" /> }
            <Status type='userType' display={isPerformer ? 'performer' : 'audience'} />
            <Status type='performers' display={performers} />
            <Status type='audience' display={audienceMembers} />
        </div>
    );
}

export default StatusBox;
