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

  state.pop();
});

const comma = token(matchChar(','), (state, input) => {
  if (state.type() !== 'sync') {
    throw new Error('comma outside sync');
  }

  // ignore commas in sync
});

const crossing = token(matchChar('x'), (state, input) => {
if (!inSync(state)) {
  throw new Error('crossing outside sync');
}

if (state.last().type !== 'digit') {
  throw new Error('invalid crossing');
}

state.last().crossing = true;
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
    last() {
      return topOf(topOf(state).values);
    },
    type() {
      return topOf(state).type;
    },
    length() {
      const top = topOf(state);
      return top.values ? top.values.length : 1;
    },
    parent() {
      return state[state.length - 2];
    },
    result() {
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

const shuffle = function* (props) {
  props = inflate(props);
  while (true) {
    let distance = yield props[0];

    let prop = props.splice(0, 1)[0];

    if (!Number.isInteger(distance)) {
      throw new Error('int expected');
    }

    if (distance > 0 && !prop) {
      throw new Error('no prop');
    }

    if (distance === 0 && prop) {
      throw new Error('no toss');
    }

    if (distance === 0 && !prop) {
      continue;
    }

    props[distance - 1] = prop;

  }
};
