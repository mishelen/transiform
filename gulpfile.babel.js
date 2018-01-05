import gulp from 'gulp';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import jade from 'gulp-jade';
import jadeInheritance from 'gulp-jade-inheritance';

import gulpIf from 'gulp-if';
import cashed from 'gulp-cached';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import include from 'gulp-include';

import composer from 'gulp-uglify/composer';
import uglifyES from 'uglify-es';
const uglify = composer(uglifyES, console);

import {create} from 'browser-sync';
import del from 'del';
import {obj as combiner} from 'stream-combiner2';

const browserSync = create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const processors = [
    autoprefixer({
        browsers: [
            'last 10 version', 'safari 5', 'ie 9', 'opera' +
            ' 12.1', 'ios 6', 'android 4'
        ]
    }),
    cssnano
];

gulp.task('styles', () => combiner(
    gulp.src('src/styles/*.scss', {base: 'src'}),
    gulpIf(isDev, sourcemaps.init()),
    sass(),
    cashed('sass'),
    postcss(processors),
    rename({suffix: '.min'}),
    gulpIf(isDev, sourcemaps.write('.')),
    gulp.dest('dist')
    //browserSync.stream()
).on('error', notify.onError()));

gulp.task('templates', () => combiner(
    gulp.src('src/*.jade'),
    //changed('dist', {extension: '.html'}), // not work with extends and includes
    //gulpif(global.isWatching, cached('jade')), // more then 1 entry
    jadeInheritance({basedir: 'src'}),
    //gulpFilter(file => !/\/_/.test(file.path) || !/^_/.test(file.relative)), // when pages placed mutually with blocks
    jade({pretty: true, client: false}),
    gulp.dest('dist')
).on('error', notify.onError()));

gulp.task('scripts', () => combiner(
    gulp.src('src/scripts/*.js'),
    include(),
    gulp.dest('dist'),
    rename({suffix: '.min'}),
    uglify(),
    gulp.dest('dist')
).on('error', notify.onError()));

gulp.task('assets', () => combiner(
    gulp.src('src/{images,backs}/*', {since: gulp.lastRun('assets'), base: 'src'}),
    newer('dist'),
    gulp.dest('dist')
).on('error', notify.onError()));

gulp.task('browser-sync:init', (done) => {
        browserSync.init({
            open: true,
            server: {
                baseDir: 'dist'
            }
        });
        done();
    }
);

gulp.task('browser-sync:reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('clean', () => del('dist'));

gulp.task('watch', () => {
    gulp.watch('src/**/*.scss', gulp.series('styles'));
    gulp.watch('src/**/*.js', gulp.series('scripts'));
    gulp.watch('src/**/*.jade', gulp.series('templates'));
    gulp.watch('src/assets/*', gulp.series('assets'));
    
    gulp.watch('dist/**/*.css').on('change', browserSync.reload);
    gulp.watch('dist/**/*.js').on('change', browserSync.reload);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('build',
    gulp.series(
        'clean',
        gulp.parallel(
            'styles',
            'templates',
            'scripts',
            'assets'
        )
    )
);

gulp.task('default',
    gulp.series(
        'clean',
        gulp.parallel(
            'styles',
            'templates',
            'scripts',
            'assets'
        ),
        gulp.parallel(
            'browser-sync:init',
            'watch'
        )
    )
);

