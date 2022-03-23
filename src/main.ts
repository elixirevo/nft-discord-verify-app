import '@/assets/scss/common.scss';
import App from '@/App.svelte';

declare global {
	interface Window {
		klaytn: any,
		caver: any
	}
}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;