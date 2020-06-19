export default function clip(num: number, { min = 0, max = 1 }: {min?:number; max?: number}): number {
    num = Math.max(min, num);
    num = Math.min(max, num);
    return num;
}
