/*************************************************************************
* 
*    renderer.js
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

const renderer = (cubeState, _) => {
    const createHTMLElement = (tagName) => document.createElement(tagName);
    const cubeContainer = document.getElementById('cube-container');
    const tableElements = [];

    for (let face of cubeState) {
        const table = createHTMLElement('table');
        
        for (let row of _.convertArrayToMatrix(face)) {
            const tableRow = createHTMLElement('tr');
            
            for (let sticker of row) {
                const tableData = createHTMLElement('td');
                tableData.style.backgroundColor = colors[_.getStickerColor(colors, sticker)];
                
                if (displayCodes) {
                    tableData.innerText = sticker;
                }
                
                tableRow.appendChild(tableData);
            }
            
            table.appendChild(tableRow);
        }
        
        tableElements.push(table);
    }
    
    for (let index in tableElements) {
        const table = cubeContainer.querySelector(`#f${parseInt(index) + 1}`);
        table.innerHTML = '';
        table.appendChild(tableElements[index]);
    }
}

window.onload = function() {

    let cube = new Cube(cubeSize);
    const {
        formattedAlg,
        invertAlg,
    } = cube.utils;
    const {applyAlg, applyCase}  = cube.utils;
    const renderCube = () => cube.render(renderer);
    
    if (!showHud) document.querySelectorAll('.hud').forEach(el=>el.style.display = 'none');

    const alg = formattedAlg(_alg);
    if (solveCase) applyCase(_alg);
    let n = -1;
    renderCube();

    const algRender = (alg,n) => {
        document.getElementById('alg').innerHTML = alg.map((i,idx)=>{
            return idx === n ? `<span style="color:red!important;font-size:18pt">${i}</span>` : i;
        }).join(' ');
        document.getElementById('mov').innerHTML =`${alg[n]||"-"}, ${n+1}/${alg.length}`;
    }

    const lastMove = () => {
        while (true) {
            if (n>=alg.length-1) break;
            n++;
            algRender(alg, n);
            applyAlg(alg[n]);
        }
        algRender(alg, n);
        renderCube();
    }
    const firstMove = () => {
        while (n >= 0) {
            applyCase(alg[n--]);
        }
        algRender(alg, n);
        renderCube();
    }
    const nextMove = () => {
        if (n>=alg.length-1) return;
        n++;
        algRender(alg, n);
        applyAlg(alg[n]);
        renderCube();
    };
    const prevMove = () => {
        if (n<0) return;
        algRender(alg, n-1);
        applyCase(alg[n]);
        n--;
        renderCube();
    };
    window.onkeydown = (ev) => {
        if (ev.keyCode === 35) lastMove();
        if (ev.keyCode === 36) firstMove();
        if (ev.keyCode === 37) prevMove();
        if (ev.keyCode === 39) nextMove();
    }

    if (solveCase) {
        firstMove();
    } else {
        lastMove();
    }

    const cubeContainer = document.querySelector('.cube3d');

    cubeContainer.style.transform = `rotateX(${xyz.x}deg) rotateZ(${xyz.z}deg) rotateY(${xyz.y}deg)`;

    document.body.onclick = (ev) => {
        if (['is-label', 'ignore-click'].indexOf(ev.target.classList.value) === -1) {
            mouseMove = !mouseMove;
            document.body.onmousemove(ev);
            document.body.style.cursor = mouseMove ? 'move' : 'pointer';
        }        
    }

    document.body.style.cursor = 'pointer';

    if (cubeContainer) {
        let rotateX = 0;
        let rotateY = 0;

        let mouseDown = 1;
        document.body.onmousedown = function() { 
            mouseDown = 1;
            rotateX = 0;
            rotateY = 0;
            document.body.style.cursor = 'pointer';
        }

        document.body.onmousemove = function(event) {
            if (!mouseMove) return;
            if (mouseDown) {
                const { clientX, clientY } = event;

                const cubeCenterX = document.body.offsetLeft + document.body.offsetWidth / 2;
                const cubeCenterY = document.body.offsetTop + document.body.offsetHeight / 2;

                const mouseXPercent = (clientX - cubeCenterX) / document.body.offsetWidth;
                const mouseYPercent = (clientY - cubeCenterY) / document.body.offsetHeight;

                rotateX = -90 * mouseYPercent; // Adjust rotation range as desired
                rotateY = 90 * mouseXPercent; // Adjust rotation range as desired

                cubeContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        }
    }
}