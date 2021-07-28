import { range } from '../utils.js';

export default ({ app }, inject) => {
    inject('utils', {
        range(start, end) {
            return [...range(start, end)]
        }
    });
}