import { h } from 'preact';

const Number = props => (
    <div id="number-1" style={{width: props.width, height: props.height}}>
        <input
            type="text"
            value={props.value}
            width={props.width}
            height={props.height}
            style="cursor: pointer; width: 120px; height: 80px; background-color: rgb(231, 231, 231); color: rgb(51, 51, 51); font-family: arial; font-weight: 500; font-size: 40px; border: none; outline: none; padding: 20px; box-sizing: border-box;"
            readonly="" />
    </div>
);

const SelectSetting = props => {
    return (
        <div class="setting-number">
            <h3>Setting Number</h3>
            <Number
                min={0}
                max={30}
                value={props.value}
                onChange={props.handleChange}
            />
        </div>
    );
}

export default SelectSetting;
