const assertArg = () => {
  throw new Error('expected arg')
};

const assertInt = n => {
  if (!Number.isInteger(n)) throw new Error('expected int');
};

const sum = (s, n) => {
  s += Number.parseInt(n, 10);
  return s;
};

const count = function* (n = Number.POSITIVE_INFINITY) {
  if (Number.isFinite(n)) {
    assertInt(n);
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
    let distance = yield props[0],
      prop = props.splice(0, 1)[0];

    if (typeof prop !== 'object') {
      throw new Error('no prop');
    }

    if (!Number.isInteger(distance)) {
      throw new Error('int expected');
    }

    distance -= 1;
    if (distance < 0) {
      continue;
    }

    if (props[distance]) {
      throw new Error('multi catch forbidden');
    }

    props[distance] = prop;
  }
};

const siteswapSymbols = {
  '\\[': (scope, current) => {
    if (scope.state && scope.state.multiplex) {
      throw new Error(['cannot multi-multiplex', current]);
    }

    scope.state = {
      group: [],
      multiplex: true
    };
  },
  '\\]': (scope, current) => {
    if (!scope.state || !scope.state.multiplex) {
      throw new Error('not in a multiplex', current);
    }

    const result = scope.state;

    scope.state = null;

    return result;
  },
  '\\(': (scope, current) => {
    if (scope.state && scope.state.sync) {
      throw new Error('cannot multi-sync', current);
    }

    scope.state = {
      group: [],
      sync: true
    };
  },
  '\\)': (scope, current) => {
    if (!scope.state || !scope.state.sync) {
      throw new Error('not in a sync', current);
    }

    const result = scope.state;
    scope.state = null;

    return result;
  },
  '\\d': (scope, number) => {
    const value = {
      number: true,
      value: number
    };

    if (scope.state && scope.state.group) {
      scope.state.group.push(value);
    } else {
      return value;
    }
  }
};

const regexs = Object.keys(siteswapSymbols)
  .map(key => [key, new RegExp(key)]);

const parse = function* (pattern) {
  pattern = Array.from(pattern);

  let scope = {
    state: null
  };

  for (let move of pattern) {
    let matches = regexs.map(([key, regex]) => [key, regex.exec(move)])
      .filter(([key, match]) => match);

    if (matches.length === 0) {
      throw new Error('invalid', move);
    } else if (matches.length > 1) {
      throw new Error('ambigous', move);
    } else {
      let [key, match] = matches[0];

      const result = siteswapSymbols[key](scope, match);
      if (result) {
        yield result;
      }
    }
  }
};

const juggle = function* (hands, props, ...patterns) {
  const ticks = count();

  let hand, tick, prop;

  //init the props generator
  prop = props.next().value;

  while (true) {
    for (let pattern of patterns) {
      for (let { value: move } of parse(pattern)) {
        tick = ticks.next().value;
        hand = hands.next().value;

        yield { tick, hand, prop, move };

        prop = props.next(Number.parseInt(move, 10)).value;
      }
    }
  }
};
