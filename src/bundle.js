const matchChar = symbol => input => symbol === input;

const matchInt = input => Number.isInteger(parseInt(input, 16));

const inSync = state => (
  state.type() === 'sync' ||
  (state.type() === 'multi' && state.parent().type === 'sync')
);

const token = (match, build) => ({
  match,
  build
});

const digit = token(matchInt, (state, input) => {
  const value = parseInt(input, 16);

  if (inSync(state) && value % 2 !== 0) {
    throw new Error('only even throws allowed in sync');
  }

  if (!inSync(state) && state.type() !== 'multi') {
    state.globals().length += 1;
  }

  state.globals().total += value;

  state.push({
    type: 'digit',
    value
  });
});

const space = token(matchChar(' '), (state, input) => {
  // ignore whitespace
});

const startSync = token(matchChar('('), (state, input) => {
  if (state.type() === 'sync') {
    throw new Error('sync in sync');
  }
  if (state.type() === 'multi') {
    throw new Error('sync in multi');
  }

  state.globals().hasSync = true;

  state.push({
    type: 'sync',
    values: []
  });
});

const endSync = token(matchChar(')'), (state, input) => {
  if (state.type() !== 'sync') {
    throw new Error('not in sync');
  }
  if (state.type() === 'multi') {
    throw new Error('sync / multi mishmash');
  }
  if (state.length() <= 1) {
    throw new Error('empty sync');
  }

  state.globals().length += state.length();

  state.pop();
});

const comma = token(matchChar(','), (state, input) => {
  if (state.type() !== 'sync') {
    throw new Error('comma outside sync');
  }

  // ignore commas in sync
});

const crossing = token(matchChar('x'), (state, input) => {
  const in_sync = inSync(state);
  const has_sync = state.globals().hasSync;
  const last = state.last();

  if (last.type !== 'digit') {
    throw new Error('invalid crossing');
  }

  if (in_sync && last.value % 2 === 0) {
    last.crossing = true;
    return;
  }

  if (!in_sync && has_sync && last.value % 2 !== 0) {
    last.nonCrossing = true;
    return;
  }

  throw new Error("invalid crossing");
});

const startMulti = token(matchChar('['), (state, input) => {
  if (state.type() === 'multi') {
    throw new Error('multi in multi');
  }

  state.push({
    type: 'multi',
    values: []
  });
});

const endMulti = token(matchChar(']'), (state, input) => {
  if (state.type() !== 'multi') {
    throw new Error('not in multi');
  }
  if (state.length() <= 1) {
    throw new Error('empty multi');
  }

  if (!inSync(state)) {
    state.globals().length += 1;
  }

  state.pop();
});

const tokens = [digit, startSync, startMulti, endSync, endMulti, comma, space, crossing];

const topOf = array => array[array.length - 1];

const matchToken = input => {
  const matched = tokens.filter(token => token.match(input));

  if (matched.length != 1) {
    throw new Error(`Unexpected token`);
  }

  return matched[0];
};

const makePattern = () => ({
  type: 'pattern',
  values: []
});

const stateTracker = (startingState) => {
  const state = [startingState];
  const globals = {
    total: 0,
    length: 0
  };

  return {
    push(token) {
      topOf(state).values.push(token);

      if (token.values) {
        state.push(token);
      }
    },
    pop() {
      if (topOf(state).type === 'pattern') {
        throw new Error('Unexpected end of pattern');
      }

      state.pop();
    },
    type() {
      return topOf(state).type;
    },
    length() {
      const top = topOf(state);
      return top.values ? top.values.length : 1;
    },
    last() {
      return topOf(topOf(state).values);
    },
    parent() {
      return state[state.length - 2];
    },
    globals() {
      return globals;
    },
    result() {
      const props = globals.total / globals.length;
      if (!Number.isInteger(props)) {
        throw new Error("invalid pattern");
      }

      startingState.length = globals.length;
      startingState.props = props;

      return startingState;
    }
  };
};

const parse = (pattern) => {
  const state = stateTracker(makePattern());

  Array.from(pattern).forEach((input, index) => {
    try {
      matchToken(input).build(state, input);
    } catch (ex) {
      throw new Error(`${ex.message} at ${input}:${index}`);
    }
  });

  return state.result();
};

const inflate = arg => {
  if (Array.isArray(arg)) {
    return arg;
  } else if (Number.isInteger(arg)) {
    const result = [];
    for (let id = 0; id < arg; id += 1) {
      result.push({
        id
      });
    }
    return result;
  }

  return Array.from(arg);
};

const shuffle = function(props) {
  props = inflate(props);
  return {
    next(distance) {
      if (!Number.isInteger(distance)) {
        throw new Error('int expected');
      }

      let prop = props.splice(0, 1)[0];

      if (distance > 0 && !prop) {
        throw new Error('no prop');
      }

      if (distance === 0 && prop) {
        throw new Error('no toss');
      }

      if (distance === 0 && !prop) {
        return;
      }

      props[distance - 1] = prop;

      return prop;
    }
  }
};

const count = function*(n = Number.POSITIVE_INFINITY) {
  if (Number.isFinite(n) && !Number.isInteger(n)) {
    throw new Error('expected int');
  }

  let i = 0;
  while (true) {
    let k = yield i;
    i += k || 1;
    if (Number.isFinite(n)) {
      i %= n;
    }
  }
};

const juggle = function*(hands, props, pattern) {
  const _ticks = count();

  const _hands = shuffle(hands);
  const _numberOfHands = Number.isInteger(hands) ? hands : hands.length;

  const _props = shuffle(props);

  const _pattern = parse(pattern);

  while (true) {
    for (let move of pattern) {
      const tick = _ticks.next().value;
      const hand = _hands.next(_numberOfHands);

      if (move.type === 'digit') {
        const prop = _props.next(move.value);
        yield {
          tick,
          hand,
          prop,
          move
        };
      } else if (move.type === 'sync' || move.type === 'multi') {
        move.values.forEach(m => {
          const prop = _props.next(m.value);
          yield ({
            tick,
            hand,
            prop,
            move: m
          });
        });
      }
    }
  }
};
