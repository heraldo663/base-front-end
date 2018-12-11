const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');

sass.compiler = require('node-sass');

const paths = {
    sass: {
        src: './src/scss/**/*.scss',
        dest: './src/css/'
    },
    styles: {
        src: './src/css/*.css',
        dest: './assets/css'
    },
    scripts: {
        src: './src/js/**/*.js',
        dest: './assets/js'
    }
};

function clean() {
    return del(['assets']);
}

function buildCss() {
    return gulp.src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.sass.dest));
};

function postCss() {
    var plugins = [
        autoprefixer({
            browsers: [
                "last 1 version",
                "> 1%",
                "not dead"
            ],
            grid: "autoplace"
        }),
        cssnano()
    ];
    return gulp.src(paths.styles.src)
        .pipe(postcss(plugins))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));

};

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))

}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.sass.src, buildCss);
    gulp.watch(paths.styles.src, postCss);
}

const build = gulp.series(clean, buildCss, postCss, scripts);

exports.clean = clean;
exports.sass = buildCss;
exports.css = postCss;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

exports.default = build;