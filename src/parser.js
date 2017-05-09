import tokens from './tokens';

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
