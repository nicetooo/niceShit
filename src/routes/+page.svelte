<script lang="ts">
	import { next } from '../store/stream';
	import * as math from 'mathjs';
	import { onMount } from 'svelte';

	let expression = '0';

	async function calculate(e: any) {
		try {
			const { attributes } = e.target;

			if (attributes['data-math']) {
				const { value } = attributes['data-math'];
				if (expression === '0') {
					expression = value;
				} else if (value === '.') {
					if (expression[expression.length - 1] !== '.') {
						expression += value;
					}
				} else {
					expression += value;
				}
			} else if (attributes['data-act']) {
				const { value } = attributes['data-act'];
				if (value === '=') {
					if (expression === '19891121.00000') {
						location.href = '/' + $next;
					}
					expression = math.evaluate(expression);
				} else if (value === 'AC') {
					expression = '0';
				} else if (value === 'AC') {
					expression = '0';
				} else if (value === '±') {
					expression = math.evaluate('-' + expression);
				} else if (value === '%') {
					expression = math.evaluate(expression + '%');
				}
			} else if (attributes['data-op']) {
				const { value } = attributes['data-op'];
				const lastOne = expression[expression.length - 1];

				console.log(lastOne, isOperator(lastOne));
				if (isOperator(lastOne)) {
					console.log('is');
					const newExpArr = expression.split('');
					newExpArr.pop();
					const newExp = newExpArr.join('') + value;
					expression = newExp;
				} else {
					expression += value;
				}
			}
		} catch (error) {}
	}

	function isOperator(str: string) {
		return str === '/' || str === '*' || str === '-' || str === '+';
	}

	let calculator: HTMLDivElement;
	let pad: HTMLDivElement;

	let width: number;
	let height: number;

	onMount(() => {
		let rect = calculator.getBoundingClientRect();
		let padRect = pad.getBoundingClientRect();

		width = rect.width;
		height = padRect.height;
		const resizeObserver = new ResizeObserver(() => {
			rect = calculator.getBoundingClientRect();
			padRect = pad.getBoundingClientRect();
			width = rect.width;
			height = padRect.height;
		});

		resizeObserver.observe(calculator);
	});
</script>

<svelte:head>
	<title>Calculator</title>
</svelte:head>

<div class="wrapper" style={`visibility:${pad ? 'visible' : 'hidden'};`}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		id="calculator"
		style="--width:{width}px;--pad-height:{height}px;"
		bind:this={calculator}
		class="calculator"
		on:click={calculate}
	>
		<div class="result">{expression}</div>

		<div class="pad" bind:this={pad}>
			<span data-act="AC" class="clear grey">AC</span>
			<span data-act="±" class="grey">±</span>
			<span data-act="%" class="grey">%</span>
			<span data-op="/" class="operator">÷</span>

			<span data-math="7">7</span>
			<span data-math="8">8</span>
			<span data-math="9">9</span>
			<span data-op="*" class="operator">x</span>

			<span data-math="4">4</span>
			<span data-math="5">5</span>
			<span data-math="6">6</span>
			<span data-op="-" class="operator">-</span>

			<span data-math="1">1</span>
			<span data-math="2">2</span>
			<span data-math="3">3</span>
			<span data-op="+" class="operator">+</span>

			<span data-math="0" class="double">0</span>
			<span data-math=".">.</span>
			<span data-act="=" class="operator">=</span>
		</div>
	</div>
</div>

<style>
	:global(body) {
		color: var(--font-color);
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 30px;
		background-color: #000;
		cursor: default;
		-webkit-user-select: none; /* Safari */
		user-select: none;
		font-family: monospace;
	}

	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.calculator {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		width: 100%;
		height: 100vh;
		max-width: 400px;
		position: fixed;
		bottom: 30px;
	}
	.result {
		display: flex;
		justify-content: end;
		align-items: end;
		flex-wrap: wrap;
		word-break: break-all;
		font-size: calc(var(--width) * 0.24);
		line-height: calc(var(--width) * 0.2);
		width: 100%;
		height: calc(100vh - var(--pad-height) - 10px);
		background-color: #000;
		color: white;
		padding: 0 1rem;
		padding-bottom: 20px;
		overflow: hidden;
	}

	.pad {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		width: 100%;
		max-width: 400px;
		/* position: fixed;
		bottom: 0; */
	}

	span {
		font-size: calc(var(--width) * 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		width: calc(var(--width) * 0.2);
		height: calc(var(--width) * 0.2);
		margin: calc(var(--width) * 0.022);
		border-radius: calc(calc(var(--width) * 0.21) / 2);
		background-color: #505050;
	}

	.double {
		width: calc(var(--width) * 0.36);
		justify-content: start;
		padding-left: calc(var(--width) * 0.08);
	}

	.operator {
		background-color: #ff9500;
		color: white;
	}

	.grey {
		background-color: #aaa;
		color: #1c1c1c;
	}
	.clicked {
		background-color: darken(orange, 10%);
	}
</style>
