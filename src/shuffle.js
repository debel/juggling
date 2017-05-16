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
        return { empty: true };
      }

      props[distance - 1] = prop;

      return prop;
    }
  }
};
