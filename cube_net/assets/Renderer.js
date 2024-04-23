/*************************************************************************
 *
 *    Renderer.js
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

const renderAlg = (() => {
	function renderer(cube, args) {
		const {selector, bgColor} = args;

		const el = document.querySelector(selector);
		const canvas = document.createElement("canvas");
		canvas.width = args.width || 100;
		canvas.height = args.height || 100;
		const ctx = canvas.getContext("2d");

		el.innerHTML = "";

		el.appendChild(canvas);

		const drawRect = (x, y, w, h, borders, fillColor = null, borderColor = null, lineWidth = 1) => {
			ctx.beginPath();
			ctx.roundRect(x, y, w, h, borders);
			if (borderColor) {
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = lineWidth;
				ctx.stroke();
			}
			if (fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fill();
			}
		};
		console.log(bgColor);
		ctx.fillStyle = bgColor || "transparent";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		function drawFace(face, faceX, faceY, faceSize) {
			const squareSize = faceSize / cube.size;
			const margin = 2;
			let idx = 0;
			for (let y = 0; y < cube.size; y++) {
				for (let x = 0; x < cube.size; x++) {
					const outerRadius = squareSize / 12;
					const innerRadius = squareSize / 5;

					const firstRow = y === 0;
					const lastRow = y === cube.size - 1;
					const firstCol = x === 0;
					const lastCol = x === cube.size - 1;

					const isA = (firstRow && firstCol) || firstRow || firstCol;
					const isB = (firstRow && lastCol) || firstRow || lastCol;
					const isC = (lastRow && lastCol) || lastRow || lastCol;
					const isD = (lastRow && firstCol) || lastRow || firstCol;

					const a = isA ? outerRadius : innerRadius;
					const b = isB ? outerRadius : innerRadius;
					const c = isC ? outerRadius : innerRadius;
					const d = isD ? outerRadius : innerRadius;

					const color = cube.getColor(face[idx]);

					const borders = [a, b, c, d];
					drawRect(
						faceX + x * squareSize + margin,
						faceY + y * squareSize + margin,
						squareSize - margin,
						squareSize - margin,
						borders,
						color,
					);
					idx++;
				}
			}
		}
		const renderNet = cubeState => {
			const m = canvas.width / 4;
			const h = canvas.height / 2 - (m * 3) / 2;
			const margin = (m - m / 1.08) / 2;
			const coordinates = [
				[1, 0],
				[0, 1],
				[1, 1],
				[2, 1],
				[3, 1],
				[1, 2],
			];
			let idx = 0;
			for (let [x, y] of coordinates) {
				drawFace(cubeState[idx++], x * m + margin / 2, y * m + h + margin / 2, m - margin);
			}
		};
		renderNet(cube.cubeState);
	}

	return (alg, size, selector, dim, bgColor) => {
		const cube = new Cube(size);
		cube.applyAlg(alg);

		const defaultSize = 500;

		cube.render(renderer, {
			selector,
			width: dim ? dim[0] || defaultSize : defaultSize,
			height: dim ? dim[1] || (dim[0] / 4) * 3 || defaultSize : defaultSize,
			bgColor,
		});
	};
})();