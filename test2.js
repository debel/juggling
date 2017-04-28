const cp = name => cb => (cb) => {
    console.log(name);
    cb(cb);
}

const a = cp('a');
const b = cp('b');
const c = cp('c');

const ab = bc => a(bc)();
const bc = ca => b(ca)();
const ca = ab => c(ab)();

const loop = cb => cp('loop')(loop)();

loop(loop);