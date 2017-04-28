const matcher = symbol => input => symbol === input;
const symbol = (matcher, maker) => ({ matcher, maker });

const startSync = symbol(matcher('('), (state, input) => {
    if (state.sync) { throw new Error('sync in sync'); }
    else if (state.multi) { throw new Error('sync in multi'); }

    return {
        sync: true,
        props: []
    };
});

const endSync = symbol(matcher(')'), (state, input) => {
    if (!state.sync) { throw new Error('not in sync'); }
    else if (state.multi) { throw new Error('sync / multi mishmash'); }
});

const startMulti = symbol(matcher('['), (state, input) => {
    if (state.multi) { throw new Error('multi in multi'); }

    state.props.push({
        multi: true,
        props: []
    });
});

const endMulti = symbol(matcher(']'), (state, input) => {
    if (!state.multi) { throw new Error('not in multi'); }
});

const digit = symbol(input => Number.isInteger(parseInt(input, 10)), (state, input) => {
    const digitObject =  {
        digit: true,
        value: parseInt(input, 10)
    };

    if (Array.isArray(state.props)) {
        state.props.push(digitObject);
        return state;
    }
    else { return digitObject; }
});

const siteSwapSymbols = [ digit, startSync, startMulti, endSync, endMulti ];

const exactlyN = n => array => {
    if (array.length !== n) {
        throw new Error(`${array.length} != ${n}`);
    }
    return array;
};

const tryExtractSingle = array => exactlyN(1)(array)[0];

const select = (state, input) => tryExtractSingle(siteSwapSymbols.filter(symbol => symbol.matcher(input))).maker(state[state.length], input);

const parse = pattern => Array.from(pattern).reduce(select);

parse('[53]01');










