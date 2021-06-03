import { h, Component } from 'preact';

const SettingsBox = props => {

    const { sample, delay, grain } = props.settings || {};
    return props.show ? (
        <table className="settings-box">
            <tr>
                <th>sample</th>
                <td>{sample}</td>
            </tr>
            <tr>
                <th>delay</th>
                <td>{delay ? "on" : "off"}</td>
            </tr>
            <tr>
                <th>grain</th>
                <td>{JSON.stringify(grain)}</td>
            </tr>
        </table>
    ) : null;
}

export default SettingsBox;
