const assertArg = () => { throw new Error('expected arg') },
    assertInt = n => { if (!Number.isInteger(n)) throw new Error('expected int'); },
    sum = (s, n) => { s += Number.parseInt(n, 10); return s; },
    count = function* (n = Number.POSITIVE_INFINITY) {
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
    },
    inflate = arg => {
        if (Array.isArray(arg)) {
            return arg;
        } else if (Number.isInteger(arg)) {
            const result = [];
            for (let id = 0; id < arg; id += 1) {
                result.push({ id });
            }
            return result;
        }

        return Array.from(arg);
    },
    shuffle = function* (props) {
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
            if (distance < 0) { continue; }

            if (props[distance]) {
                throw new Error('multi catch forbidden');
            }

            props[distance] = prop;
        }
    },
    siteswapSymbols = {
        '\\[': (scope, current) => {
            if (scope.state && scope.state.multiplex) {
                throw new Error(['cannot multi-multiplex', current]);
            }

            scope.state = { group: [], multiplex: true };
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

            scope.state = { group:[], sync: true };
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
            const value = { number: true, value: number};

            if (scope.state && scope.state.group) {
                scope.state.group.push(value);
            }  else {
                return value;
            }
        }
    },
    _errorSymbol = (state, char) => {
        throw new Error('unknown symbol', char);
    },
    parse = function* (pattern) {
        pattern = Array.from(pattern);

        const regexs = Object.keys(siteswapSymbols)
                             .map(key => [key, new RegExp(key)]);

        let scope = { state: null };

        for (let p of pattern) {
            let matches = regexs.map(([key, regex]) => [key, regex.exec(p)])
                                .filter(([key, match]) => match);

            if (matches.length === 0) {
                _errorSymbol('no match for', p);
            } else if (matches.length > 1) {
                _errorSymbol(['ambigous', p]);
            } else {
                let [key, match] = matches[0];

                const result = siteswapSymbols[key](scope, match);
                if (result) {
                    yield result;
                }
            }
        }
    },
    juggle = function* (hands, props, ...patterns) {
        const ticks = count();

        let hand, tick, prop;

        //init the props generator
        prop = props.next().value;

        for (let p of patterns) {
            for (let move of parse(p)) {
                tick = ticks.next().value;
                hand = hands.next().value;

                yield {
                    tick, hand, prop, move
                };

                prop = props.next(Number.parseInt(move, 10)).value;
            }
        }

        return {
            tick, hand, prop
        };
    };


const three = juggle(count(2), shuffle(3), '5421'),
    four = juggle(count(2), shuffle(3), '[54]21');

