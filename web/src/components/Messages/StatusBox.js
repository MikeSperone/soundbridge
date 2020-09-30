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
    const { solo, isPerformer, performers, audienceMembers } = props;
    return (
        <div id='status-box'>
            { solo && <Status type='solo' display="SOLO" /> }
            <Status type='role' display={isPerformer ? 'performer' : 'audience'} />
            <Status type='performers' display={performers.join(', ')} />
            <Status type='audience' display={audienceMembers} />
        </div>
    );
}

export default StatusBox;
