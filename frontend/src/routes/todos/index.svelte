<script context="module" lang="ts">
	import * as api from '$lib/utils/api';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async () => {
		const res = await api.get('./todos');

		const todos = res.data;

		return {
			props: { todos }
		};
	};
</script>

<script lang="ts">
	// import { flip } from 'svelte/animate';

	import type { Todo } from '$lib/todo/todo';
	import Item from '$lib/todo/item.svelte';

	export let todos: Todo[];
	let newTodo: Todo = {} as Todo;

	async function add () {
		const res = await api.post('./todos', {
			title: newTodo.title,
		});

		let todo = res.data;

		todos = [...todos, todo];
		newTodo.title = '';
	}

	async function modified ({ detail: todo }: { detail: Todo }) {
		await api.patch('./todos', {
			id: todo.id,
			title: todo.title,
			isComplete: todo.isComplete,
		})
	}

	async function removed ({ detail: todo }: { detail: Todo }) {
		todos = todos.filter(n => n.id !== todo.id);
		await api.remove('./todos', {
			id: todo.id,
		})
	}
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="todos">
	<h1>Todos</h1>

	<form
		class="new"
		action="javascript:"
		on:submit={add}
	>
		<input aria-label="Add todo" placeholder="+ tap to add a todo" bind:value={newTodo.title} />
	</form>

	{#each todos as todo (todo.id)}
		<Item todo={todo} on:modified={modified} on:removed={removed} />
	{/each}
</div>

<style>
	.todos {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
		line-height: 1;
	}

	.new {
		margin: 0 0 0.5rem 0;
	}

	input {
		border: 1px solid transparent;
	}

	input:focus-visible {
		box-shadow: inset 1px 1px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}

	.new input {
		font-size: 28px;
		width: 100%;
		padding: 0.5em 1em 0.3em 1em;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		text-align: center;
	}
</style>
