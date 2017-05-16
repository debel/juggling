const count = function* (n = Number.POSITIVE_INFINITY) {
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

const juggle = function* (hands, props, pattern) {
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
          const prop = _props.next(move.value)
          yield { tick, hand, prop, move };
        }
        else if (move.type === 'sync' || move.type === 'multi') {
          move.values.forEach(m => {
            const prop = _props.next(m.value)
            yield { tick, hand, prop, move: m };
          });
        }
      }
    }
  }
};
