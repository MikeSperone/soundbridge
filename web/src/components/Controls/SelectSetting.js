import { h } from 'preact';
import { useState } from 'preact/hooks';

                // min={0}
                // max={30}
const RandomSetting = props => (
    <div class="setting-number">
        <h3>Setting Number</h3>
        <div
            id="number-1"
            style={{width: props.width, height: props.height}}
        >
            <input
                type="text"
                name="setting"
                value={props.value}
                width={props.width}
                height={props.height}
                style="cursor: pointer; width: 120px; height: 80px; background-color: rgb(231, 231, 231); color: rgb(51, 51, 51); font-family: arial; font-weight: 500; font-size: 40px; border: none; outline: none; padding: 20px; box-sizing: border-box;"
                readonly
            />
            <button onClick={props.handleChange} type="button">change</button>
        </div>
    </div>
);

const SelectSetting = props => (
    <div class="setting-number">
        <h3>Setting Number</h3>
        <form
            id="number-1"
            style={{width: props.width, height: props.height}}
            onSubmit={props.handleChange}
        >
            <input
                type="text"
                name="setting"
                value={props.value}
                width={props.width}
                height={props.height}
                style="cursor: pointer; width: 120px; height: 80px; background-color: rgb(231, 231, 231); color: rgb(51, 51, 51); font-family: arial; font-weight: 500; font-size: 40px; border: none; outline: none; padding: 20px; box-sizing: border-box;"
            />
            <button type="submit">change</button>
        </form>
    </div>
);

export default SelectSetting;
