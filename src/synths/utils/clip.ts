export default function clip(num: number, m: {min: number; max: number;} = {min:0.0, max:1}): number {
    if (!m) {
        m = {
            min: 0.0,
            max: 1,
        }
    } else {
        if (!m.min) m.min = 0.0;
        if (!m.max) m.max = 1;
    }

    num = Math.max(m.min, num);
    num = Math.min(m.max, num);
    return num;
}
