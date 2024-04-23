/*************************************************************************
* 
*    config.js
*    
*    Copyright (c) 2023 by Filipe Martins Teixeira. All rights reserved.
*    
*    This code is licensed for personal and non-commercial use. You may
*    modify the code solely for personal use and may not distribute or
*    sell the modified code.
*    
*    Redistribution of this code without written permission from the
*    author is strictly prohibited. Using this code in competing
*    products or services is prohibited. You may not remove or modify
*    any copyright notices included in this code.
*    
*    This code is provided "as is," without warranty of any kind,
*    expressed or implied. The author assumes no liability for any
*    damages or issues arising from the use of this code.
* 
*************************************************************************/

const showHud = 1;
const displayCodes = 0;
const data = window.location.hash.slice(1);

function initVars() {
    if (data.length) {
        let [c, _alg, m] = atob(data).split(';');
        const cubeSize = parseInt(c);
        const mode = Boolean(parseInt(m)) || false;
        return [cubeSize, _alg, mode];
    } else {
        return [3, "M2 E2 S2", false];
    }
}

const [cubeSize, _alg, solveCase] = initVars();

const colors = {
    "U": "white",
    "L": "orange", 
    "F": "lime",
    "R": "red",
    "B": "blue",
    "D": "yellow",
};
const xyz = {
    x:-45,
    y:-45,
    z:0
};
let mouseMove = 0;