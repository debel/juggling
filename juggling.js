const assertArg = () => { throw new Error('expected arg') },
    assertInt = n => { if (!Number.isInteger(n)) throw new Error('expected int'); },        
    sum = (s, n) => { s += Number.parseInt(n, 10); return s; },
    getNumberOfProps = pattern => {
        const props = Array.from(pattern).reduce(sum, 0) / pattern.length;

        if (Number.isInteger(props)) {
            return props;
        }

        throw new Error('bad pattern');
    },
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
    propsArray = function (n = assertArg()) {
        assertInt(n);
        
        const result = [];
           
        
        for (let i = 0; i < n; i+=1) {
            result.push(i);
        }
              
        return result 
    },
    juggle = function* (pattern) {
        const props = getNumberOfProps(pattern),
            hands = count(2),
            balls = count(props),
            ticks = count();

        let hand, tick, ball, index;

        while (true) {
            tick = ticks.next().value;
            hand = hands.next().value;
            action = pattern[tick % pattern.length],
            ball = balls.next(action).value;
            

            yield {
                tick, hand, ball
            };
        }
    };