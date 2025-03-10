import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/renderer/svelte.js',
	output: {
		sourcemap: true,
		format: 'cjs', // iife
		name: 'app',
		// dir: 'public/build',
		file: 'public/build/bundle.js',
		exports: 'auto'
	},
    external: [
      'fs'
	],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			preferBuiltins: true
		}),
		commonjs(),
		scss({
			output: 'public/build/base.css',
			watch: 'scss'
		}),
		nodePolyfills(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
		/*
        nativePlugin({
            // Where we want to physically put the extracted .node files
            copyTo: 'dist/libs',

            // Path to the same folder, relative to the output bundle js
            destDir: './libs',

            // Use `dlopen` instead of `require`/`import`.
            // This must be set to true if using a different file extension that '.node'
            dlopen: false,

            // Modify the final filename for specific modules
            // A function that receives a full path to the original file, and returns a desired filename
            map: (modulePath) => 'filename.node',

            // Generate sourcemap
            sourcemap: true
		})
		*/
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'svelte-start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}