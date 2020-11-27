import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

                // min={0}
                // max={30}
const RandomSetting = props => <Fragment>
        <h6>Setting Number</h6>
        <div
            id="number-1"
            style={{width: props.width, height: props.height}}
        >
            <input
                className="row"
                type="text"
                name="setting"
                value={props.value}
                width={props.width}
                height={props.height}
                readonly
            />
            <button className="row btn btn-primary btn-block" onClick={props.handleChange} type="button">
                change
            </button>
        </div>
    </Fragment>;

const SelectSetting = props => (
    <div class="setting-number col-2">
        <h3>Setting Number</h3>
        <form
            id="number-1"
            style={{width: props.width, height: props.height}}
            onSubmit={props.handleChange}
        >
            <input
                className="row"
                type="text"
                name="setting"
                value={props.value}
                width={props.width}
                height={props.height}
            />
            <button className="row btn btn-primary" type="submit">
                change
            </button>
        </form>
    </div>
);

// export default SelectSetting;
export default RandomSetting;
