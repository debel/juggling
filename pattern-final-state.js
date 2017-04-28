const juggle = (pattern = '3', props = 'XYZ') => {
        props = Array.from(props);
        pattern = Array.from(pattern);
        return pattern
                    .map((distance, position) => (position + distance) % props.length)
                    .reduce((result, landing, current) => {
                        result[landing] = props[current]; return result;
                    }, props);
      };
      
    