# JuggleJS

A javascript siteswap juggling patterns interpreter and simulator.  

## Definitions

* Prop - object used for juggling
* Siteswaps - popular notation for recording patterns  
* Pattern - specific sequence of prop manipulations - throws, stalls, bounces, etc
* Beat - the start of each manipulation defines a beat (0 being the null/empty manipulation)

## Siteswaps

Initially hold the X and Z ball in your right hand and the Y ball in your left.
Let's execute the 441 pattern.
    Props - X, Y, Z (3 balls)
    Alternating "hands" L - left hand, R - right hand    
    RLRLRLRLR
    XYZZXYYXZ
Let's break it down.
First we throw the X ball from our right, it will fall on the 4th beat.
The next beat is from the left hand.
    LRLRLRLR
    YZ-X
Throw the Y ball from the left hand, again it wil fall on the 4th beat.
Right hand next.
    RLRLRLRL
    Z-XY
Throw the ball across, it will fall on the next beat (in the other hand) 
    LRLRLRLR
    ZXY
You can now start the pattern again; this time left hand first, or do a different pattern altogather.

## Example Patterns
    531, 3, 441, 501, 40, 423, [53]01, [54]21

## Verification

sum of numbers / count must be integer and constitutes the number of balls
    
## Information Sources

* starting hand - juggler
* number of balls - pattern

## Sample AST
```
[{
    tick: 0,
    prop: 0,
    origin: 0,
    siteswap: 5
},
{
    tick: 1,
    prop: 1,
    origin: 1,
    siteswap: 3
},
{
    tick: 2,
    prop: 2,
    origin: 0,
    siteswap: 1
}]
```

## Sample Prop State Transitions:
 ```transitionAsString = "XYZ -4- YZ_X -4- Z_XY -1- ZXY -4- XY_Z -4- Y_ZX -1- YZX -5- ZX__Y -3- X_ZY -1- XZY -5- ZY__X -3- Y_ZX -1- YZX"
    //todo: draw with dot or svg```
