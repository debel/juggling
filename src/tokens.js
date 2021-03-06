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

const siteSwapTokens = [digit, startSync, startMulti, endSync, endMulti, comma, space, crossing];

export default siteSwapTokens;
