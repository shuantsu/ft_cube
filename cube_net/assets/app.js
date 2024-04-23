/*************************************************************************
* 
*    app.js
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

window.onload = () => {
    const outputEl = document.getElementById('output');

        const [cubeSize, alg, width, height, bgcolor,margin] = ['cubeSize','alg','width','height','bgcolor','margin'].map(s=>document.getElementById(s));
        cubeSize.onkeyup = alg.onkeyup = width.onkeyup = height.onkeyup = bgcolor.oninput = margin.onkeyup = () => {
            renderAlg(alg.value, parseInt(cubeSize.value)||3, "#cube-container", [parseInt(width.value),parseInt(height.value)||null]);
            document.getElementById('cube-container').style.backgroundColor = bgcolor.value;
            document.getElementById('cube-container').style.padding = margin.value + 'px';
            const args = [alg.value, parseInt(cubeSize.value)||3, "#cube-container", [parseInt(width.value),parseInt(height.value)||null],bgcolor.value];
            const command = `<html>
    <head>
        <script src="https://shuantsu.github.io/ft_cube/cube_net/assets/Cube.js"><\/script>
        <script src="https://shuantsu.github.io/ft_cube/cube_net/assets/Renderer.js"><\/script>
        <style>
            #cube-container {
                background: ${args[4]};
                padding: ${margin.value}px;
                display: inline-block;
                border-radius: 10px;
            }
        <\/style>
    </head>
    <body>

        <div id="cube-container"><\/div>

        <script>
            renderAlg("${args[0]}", ${args[1]}, "${args[2]}", ${JSON.stringify(args[3].filter(i=>i))});
        <\/script>

    <\/body>
<\/html>`;
        outputEl.innerText = command;
    }

    cubeSize.onkeyup();
    
    outputEl.onclick = function() {
        var auxiliar = document.createElement('textarea');
        auxiliar.value = outputEl.innerText;
        document.body.appendChild(auxiliar);
        auxiliar.select();
        document.execCommand('copy');
        document.body.removeChild(auxiliar);
        outputEl.parentElement.classList.add('copied');
        document.getElementById('output-label').innerText = "Copied!";
        window.setTimeout(()=>{
            outputEl.parentElement.classList.remove('copied');
            document.getElementById('output-label').innerText = "(Click code to copy)";
        },500);
    }
};