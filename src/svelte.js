import './../scss/app.scss';
import App from './App/App.svelte';

const app = new App({
	target: document.body,
	props: {
	}
});

window.app = app;

export default app;
