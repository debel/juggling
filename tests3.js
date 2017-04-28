const parse = pattern => Array.from(pattern).reduce((result, step) => {
    const token = match(step)(result[result.length - 1]);
    if (token) {
        result.push(token);
    }
    return result;
});


tokenFunction = ()