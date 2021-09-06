const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: {
            baseDir: './app'
        },
        open: "local",
        tunnel: 'freebie',
    });

    // watch(['app/scss/*.scss'], styles);
    // watch(['app/js/*.js'], scripts);
    // watch(['app/*.html']).on('change', browserSync.reload);
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function styles() {
    return src(['app/scss/style.scss'])
        .pipe(scss())
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(['app/scss/*.scss'])
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

// function watching() {
//     watch('app/scss/**/*.scss', styles);
//     // watch('app/js/**/*.js');
//     watch('app/*.html').on('change', browserSync.reload);
// }

// exports.styles = styles;
// exports.watching = watching;
exports.default = series(styles, parallel(browsersync, watching));
// exports.default = browsersync;