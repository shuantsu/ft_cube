/*************************************************************************
* 
*    Cube.js
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

const Cube = (function() {
	const _ = (cubeSize) => {
		const range = n => [...Array(n).keys()];

		const objCopy = obj => JSON.parse(JSON.stringify(obj));

		const reversed = arr => arr.reduceRight((acc, current) => {
			acc.push(current);
			return acc;
		}, []);

		const divmod = (a, b) => {
			const quotient = Math.floor(a / b);
			const remainder = a % b;
			return [quotient, remainder];
		}

		const convertArrayToMatrix = (arr) => {
			const n = Math.sqrt(arr.length);
			const size = Math.ceil(arr.length / n);

			return Array.from({
					length: n
				}, (v, i) =>
				arr.slice(i * size, i * size + size)
			);
		}

		const chunkArray = (array, chunkSize) => {
			let chunks = [];
			for (let i = 0; i < array.length; i += chunkSize) {
				chunks.push(array.slice(i, i + chunkSize));
			}
			return chunks;
		}

		function shift(array, n) {
			if (n >= 0) {
				const endIndex = n;
				const itemsToMove = array.slice(0, endIndex);
				const remainingItems = array.slice(endIndex);
				return remainingItems.concat(itemsToMove);
			} else {
				const startIndex = array.length + n;
				const itemsToMove = array.slice(startIndex);
				const remainingItems = array.slice(0, startIndex);
				return itemsToMove.concat(remainingItems);
			}
		}

		const stripShift = (array, n = 1) => {
			return shift(array, (cubeSize * (n % 4)));
		}

		const matrixRotation = {
			0: matrix => matrix.flat(),
			90: matrix => {
				const rotatedMatrix = [];
				const numRows = matrix.length;
				const numCols = matrix[0].length;

				for (var i = numCols - 1; i >= 0; i--) {
					const newRow = [];

					for (var j = 0; j < numRows; j++) {
						newRow.push(matrix[j][i]);
					}
					rotatedMatrix.push(newRow);
				}

				return rotatedMatrix.flat();
			},
			180: matrix => matrix.flat().reverse(),
			270: matrix => {
				const rotatedMatrix = [];
				const numRows = matrix.length;
				const numCols = matrix[0].length;

				for (var i = 0; i < numCols; i++) {
					const newRow = [];

					for (var j = numRows - 1; j >= 0; j--) {
						newRow.push(matrix[j][i]);
					}
					rotatedMatrix.push(newRow);
				}

				return rotatedMatrix.flat();
			},
		};

		const rotate = (matrix, times = 1) => matrixRotation[(times % 4) * 90](matrix);

		const getCol = (arr, idx) => arr.map(i => i[idx]);

		const getStickerIndex = sticker => divmod(sticker, cubeSize ** 2);

		const getStickerColor = (colors, sticker) => Object.keys(colors)[getStickerIndex(sticker)[0]];

		const originalState = ((cubeSize) => cubeSize > 0 ? chunkArray(range(cubeSize ** 2 * 6), cubeSize ** 2) : [])(cubeSize);

		return {
			originalState,
			range,
			objCopy,
			reversed,
			divmod,
			convertArrayToMatrix,
			chunkArray,
			shift,
			stripShift,
			matrixRotation,
			rotate,
			getCol,
			getStickerIndex,
			getStickerColor,
		};
	};

	function moves(_, cubeSize, originalState, cubeState) {
		const {
			objCopy,
			reversed,
			convertArrayToMatrix,
			stripShift,
			rotate,
			getCol,
			getStickerIndex,
			getStickerColor,
		} = _(cubeSize);

		function getSlices(cube) {
			const [U, L, F, R, B, D] = cube.map(convertArrayToMatrix);

			function getFSlices() {
				const allSlices = [];

				for (let i = 0; i < cubeSize; i++) {
					const slices = [];
					slices.push(reversed(U)[i]);
					slices.push(getCol(R, i));
					slices.push(reversed(D[i]));
					slices.push(reversed(getCol(L, cubeSize - i - 1)));
					allSlices.push(slices.flat())
				}

				return allSlices;
			}

			function getUSlices() {
				const allSlices = [];

				for (let i = 0; i < cubeSize; i++) {

					const slices = [];
					slices.push(L[i]);
					slices.push(F[i]);
					slices.push(R[i]);
					slices.push(B[i]);

					allSlices.push(reversed(slices.flat()))
				}

				return allSlices;
			}

			function getRSlices() {
				const allSlices = [];

				for (let i = 0; i < cubeSize; i++) {
					const slices = [];
					slices.push(reversed(getCol(B, i)));
					slices.push(getCol(U, cubeSize - i - 1));
					slices.push(getCol(F, cubeSize - i - 1));
					slices.push(getCol(D, cubeSize - i - 1));

					allSlices.push(reversed(slices.flat()));
				}

				return allSlices;
			}

			const fSlices = getFSlices(originalState);
			const uSlices = getUSlices(originalState);
			const rSlices = getRSlices(originalState);
			const bSlices = reversed(fSlices.map(r => reversed(r)));
			const dSlices = reversed(uSlices.map(r => reversed(r)));
			const lSlices = reversed(rSlices.map(r => reversed(r)));

			return {
				fSlices,
				uSlices,
				bSlices,
				dSlices,
				lSlices,
				rSlices
			};
		}

		const slices = getSlices(originalState);

		const faces = {
			uFace: originalState[0],
			lFace: originalState[1],
			fFace: originalState[2],
			rFace: originalState[3],
			bFace: originalState[4],
			dFace: originalState[5],
		}

		const mIdx = (arr) => arr.map(sticker => getStickerIndex(sticker));

		const externalLayers = {
			uLayer: [faces.uFace, slices.uSlices[0]],
			lLayer: [faces.lFace, slices.lSlices[0]],
			fLayer: [faces.fFace, slices.fSlices[0]],
			rLayer: [faces.rFace, slices.rSlices[0]],
			bLayer: [faces.bFace, slices.bSlices[0]],
			dLayer: [faces.dFace, slices.dSlices[0]],
		};

		function moveLayer(layer, amount) {
			const [newFace, newSlice] = externalLayers[layer + 'Layer'];
			return [rotate(convertArrayToMatrix(newFace), amount), stripShift(newSlice, amount)];
		}

		function moveSlice(slice, n, amount) {
			const newSlice = slices[slice + 'Slices'][n];
			return stripShift(newSlice, amount);
		}

		function makePermutation(newCube, np, op) {
			for (let i in np) {
				newCube[np[i][0]][np[i][1]] = cubeState[op[i][0]][op[i][1]];
			}
			cubeState = newCube;
		}

		function makeLayerPermutation(layer, amount) {
			const np = moveLayer(layer, amount).map(mIdx).flat();
			const op = externalLayers[layer + "Layer"].map(mIdx).flat();
			const newCube = objCopy(cubeState);

			makePermutation(newCube, np, op);
			cubeState = newCube;
		}

		function makeSlicePermutation(slice, n, amount) {
			const np = moveSlice(slice, n, amount).map(sticker => getStickerIndex(sticker))
			const op = slices[slice + "Slices"][n].map(sticker => getStickerIndex(sticker))
			const newCube = objCopy(cubeState);

			makePermutation(newCube, np, op);
			cubeState = newCube;
		}

		function applyMove(face, deepness, amount) {
			amount %= 4;
			if (deepness > 0 && deepness < cubeSize - 1) {
				makeSlicePermutation(face, deepness, amount);
			} else if (deepness === 0) {
				makeLayerPermutation(face, amount);
			} else if (deepness === cubeSize - 1) {
				makeLayerPermutation({
					u: 'd',
					l: 'r',
					f: 'b',
					r: 'l',
					b: 'f',
					d: 'u'
				} [face], 4 - amount);
			} else {
				return false;
			}
			return true;
		}

		function moveLoop(face, start, end, amount) {
			for (let x = start; x < end; x++) {
				applyMove(face, x, amount);
			}
		}

		function parseMove(mv) {
			const r = mv.match(/(\d+-)?(\d+)*([xyzemsEMSulfrbdULFRBD])([w]*)(\d+)*(')*/);
			const data = r ? r.slice(1, r.length).map(i => i === undefined ? '' : i) : null;
			if (data) {
				const amount = parseInt(data[4] || 1);
				let layer = data[2];
				const wide = data[3] === 'w';
				const slice = [parseInt(data[0][0] || 0), parseInt(data[1] || 0)];
				const isCompositeSlice = data[0] !== '';
				const prime = data[5] === "'";
				if (layer.toLowerCase() === layer && wide) {
					return null
				} else if (wide) {
					layer = layer.toLowerCase();
				}
				return {
					layer,
					slice,
					amount,
					prime,
					isCompositeSlice,
					wide
				};
			}
			return data;
		}

		function applyMoveNotation(mv) {

			const move = parseMove(mv);

			if (!move) return false;

			if (move.prime) move.amount = 4 - move.amount;

            if (move.isCompositeSlice) {
                if (move.slice[1] >= cubeSize) return false;
                if (move.slice[1] - move.slice[0] <= 0 || move.slice[0] < 1 || move.slice[1] > cubeSize) return false;
                moveLoop(move.layer, move.slice[0] - 1, move.slice[1], move.amount);
            } else if (move.wide) {
				if (move.isCompositeSlice) {
					if (move.slice[1] - move.slice[0] <= 0 || move.slice[0] < 1 || move.slice[1] > cubeSize) return false;
					moveLoop(move.layer, move.slice[0] - 1, move.slice[1], move.amount);
				} else {
                    if (move.slice[1] >= cubeSize) return false
                    moveLoop(move.layer, move.slice[0], move.slice[1] > 2 ? move.slice[1] : 2, move.amount);
				}
			} else {
				if (move.layer.match(/[ULFRBD]/)) {
					let sl = move.slice[1];
					sl = sl !== 0 ? sl >= cubeSize ? -1 : sl - 1 : 0;
					applyMove(move.layer.toLowerCase(), sl, move.amount)
				} else if (move.layer.match(/[ulfrbd]/)) {
                    if (move.slice[1] >= cubeSize) return false;
                    if (move.isCompositeSlice) {
                        if (move.slice[1] - move.slice[0] <= 0 || move.slice[0] < 1 || move.slice[1] > cubeSize) return false;
					    moveLoop(move.layer, move.slice[0] - 1, move.slice[1], move.amount);
                    } else {
                        let sl = move.slice[1];
                        sl = sl !== 0 ? sl >= cubeSize ? -1 : sl : 2;
                        moveLoop(move.layer, 0, sl, move.amount);
                    }
                } else if (move.layer.match(/[xyz]/)) {
					moveLoop({
						x: 'r',
						y: 'u',
						z: 'f'
					} [move.layer], 0, cubeSize, move.amount);
				} else if (move.slice[1] > 0) {
					if (move.slice[1] === cubeSize) return false;
					applyMove(move.layer.toLowerCase(), move.slice[1] - 1, move.amount);
				} else if (move.layer.match(/[ems]/i)) {
					if (move.layer.toUpperCase() === move.layer) {
						if (cubeSize % 2 === 0) return false;
						applyMove({
							M: 'l',
							E: 'd',
							S: 'f'
						} [move.layer], cubeSize / 2 - .5, move.amount);
					} else {
						moveLoop({
							m: 'l',
							e: 'd',
							s: 'f'
						} [move.layer], 1, cubeSize - 1, move.amount);
					}
				}
			}
			return true;
		}

		const formattedAlg = alg => alg.replace(/[()]/g,'').split(/\n/g).map(i => i ? i.trim().split(/\/\//)[0].split(/\s+/) : '').filter(i => i).flat().filter(i => i);

		const invertAlg = alg => reversed(formattedAlg(alg)).map(i => i.endsWith("'") ? i.substring(0, i.length - 1) : i + "'");

		const applyAlg = alg => {
			const fa = formattedAlg(alg);
			fa.map(mv => applyMoveNotation(mv));
		}

		const applyCase = alg => {
			const fa = invertAlg(alg);
			fa.map(mv => applyMoveNotation(mv));
		}

		const getState = () => cubeState;

		return {
			formattedAlg,
			invertAlg,
			applyAlg,
			applyCase,
			getState
		};

	}

	class Cube {
		#cubeState;
		#moves;
		#utils;
		constructor(size) {
			const utils = this.#utils = _(size);
			this.#cubeState = utils.objCopy(utils.originalState);
			this.#moves = moves(_, size, utils.originalState, this.#cubeState);
			this.applyAlg = this.#moves.applyAlg;
		}
		get cubeState() {
			return this.#moves.getState();
		}
		get utils() {
			const u = this.#moves;
			Object.assign(u, this.#utils);
			return u;
		}
		get isSolved() {
			return JSON.stringify(this.cubeState) === JSON.stringify(this.#utils.originalState);
		}
		render(renderer = null) {
			if (!renderer) {
				let idx = 0;
				const output = [];

				for (let o of this.cubeState) {
					output.push('ULFRBD' [idx++] + ' -> [' + o.join(', ') + ']');
				}
				console.log(output.join('\n'));
			} else {
				renderer(this.cubeState, this.utils);
			}
		}
	}

	return Cube;
})();