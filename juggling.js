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
    makeProps = props => {
        if (Array.isArray(props)) {
            return props;    
        } else if (Number.isInteger(props)) {
            const result = [];
            for (let i = 0; i < props; i+=1) {
                result.push(i);
            }
            return result;
        }
        
        return Array.from(props);
    },  
    props = function* (props) {
        while (true) {
            let distance = yield props[0],
                prop = props.splice(0,1)[0];
                
            if (!Number.isInteger(distance)) {
                throw new Error('int expected');
            }
            
            distance -=1;
            if (distance < 0) { continue; } 
            
            if (props[distance]) {
                throw new Error('multi catch forbidden');
            }
            
            props[distance] = prop;
        }
      },
    juggle = function* (hands, props, ...patterns) {
        const ticks = count();

        let hand, tick, prop;

        //init the props generator
        prop = props.next().value;
        
        for (let p of patterns) {
           for (let t of Array.from(p)) {
               console.log(t); 
           tick = ticks.next().value;
           hand = hands.next().value;
            
            yield {
                tick, hand, prop
            };
            
            prop = props.next(Number.parseInt(t, 10)).value; 
           }
        }
        
        return {
                tick, hand, prop
        };
    };