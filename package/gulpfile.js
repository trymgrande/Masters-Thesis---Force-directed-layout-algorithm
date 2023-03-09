const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript2');
const resolve = require("rollup-plugin-node-resolve");


gulp.task('build', () => {
    return rollup
        .rollup({
            input: './src/index.ts',
            plugins: [rollupTypescript(), resolve()]
        })
        .then(bundle => {
            return bundle.write({
                file: './lib/bundle.js',
                format: 'umd',
                name: 'app',
            });
        });
});

gulp.task('watch', () => {
    gulp.watch(['./src/*'], gulp.series('build'))
});

