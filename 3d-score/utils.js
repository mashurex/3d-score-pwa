export function* range(start, end) {
    yield start;
    if (start === (end - 1)) return;
    yield* range(start + 1, end);
}

export const all = {
    range,
};