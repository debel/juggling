input:
    pattern e.g 531, 3, 441, 501, 40, 423, [53]01, [54]21

output:
    ast?
    state transitions
    info: number of balls, 
    

verification:
    sum of numbers / count must be integer and constitutes the number of balls
    

informationSources: {
    startingHand: 'external',
    numberOfBalls: 'pattern'
}

sampleAST: [{
    t: 0,
    ball: 0,
    origin: 0,
    destination: 1,
    power: 5
},
{
    t: 1,
    ball: 1,
    origin: 1,
    destination: 0,
    power: 3
},
{
    t: 2,
    ball: 2,
    origin: 0,
    destination: 1,
    power: 1
}]

//todo: draw with dot or svg
sampleStateTransitions: "XYZ -4- YZ_X -4- Z_XY -1- ZXY -4- XY_Z -4- Y_ZX -1- YZX -5- ZX__Y -3- X_ZY -1- XZY -5- ZY__X -3- Y_ZX -1- YZX"