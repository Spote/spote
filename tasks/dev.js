var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('gulp-rimraf'),
    watch = require('gulp-watch'),
    traceur = require('gulp-traceur'),
    plumber = require('gulp-plumber'),
    modRewrite = require('connect-modrewrite'),
    config = require('./dev.json');

gulp.task('dev:connect', function() {
    connect.server({
        root: config.paths.dest,
        livereload: true,
        middleware: function() {
            return [
                modRewrite([
                    '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.jpeg$ /index.html [L]'
                ])
            ];
        }
    });
});

gulp.task('dev:clean', function() {
    return gulp.src(config.paths.dest, { read: false })
        .pipe(plumber())
        .pipe(rimraf());
});

gulp.task('dev:build:js:vendor', ['dev:clean'], function() {
    watch({ glob: config.files.js.vendor })
        .pipe(watch())
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.js.vendor));
});

gulp.task('dev:build:js', ['dev:clean'], function() {
    watch({ glob: config.files.js.src })
        .pipe(watch())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(traceur({
                experimental: true,
                modules: 'instantiate'
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.js.dest));
});

gulp.task('dev:build:css', ['dev:clean'], function() {
    watch({ glob: config.files.css.src })
        .pipe(watch())
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('dev:build:sass', ['dev:clean'], function() {
    watch({ glob: config.files.sass.src })
        .pipe(watch())
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('dev:build:html', ['dev:clean'], function() {
    watch({ glob: config.files.html.src })
        .pipe(watch())
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task('dev:build', [
    'dev:build:js:vendor',
    'dev:build:js',
    'dev:build:css',
    'dev:build:sass',
    'dev:build:html'
]);

gulp.task('dev', [
    'dev:clean',
    'dev:build',
    'dev:connect'
]);