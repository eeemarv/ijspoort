import './../scss/app.scss';
import App from './components/App.svelte';
import settings from 'electron-settings';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

window.app = app;

export default app;
