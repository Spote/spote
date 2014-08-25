/* Copyright 2014 Jack Wakefield
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require('gulp-rimraf'),
    watch = require('gulp-watch'),
    traceur = require('gulp-traceur'),
    plumber = require('gulp-plumber'),
    modRewrite = require('connect-modrewrite'),
    jade = require('gulp-jade'),
    config = require('./dev.json');

gulp.task('dev:connect', function() {
    connect.server({
        root: config.paths.dest,
        livereload: true,
        middleware: function() {
            return [
                modRewrite([
                    '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.jpeg|\\.gif|\\.svg|' +
                    '\\.woff|\\.ttf$ /index.html [L]'
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

gulp.task('dev:build:js:vendor', function() {
    watch({ glob: config.files.js.vendor })
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.js.vendor));
});

gulp.task('dev:build:js', function() {
    watch({ glob: config.files.js.src })
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

gulp.task('dev:build:css:vendor', function() {
    watch({ glob: config.files.css.vendor })
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.css.vendor));
});

gulp.task('dev:build:css', function() {
    watch({ glob: config.files.css.src })
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('dev:build:sass', function() {
    gulp.src(config.files.sass.src)
        .pipe(plumber())
        .pipe(sass({
            loadPath: config.files.sass.includes,
            compass: true
        }))
        .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('dev:build:images', function() {
    watch({ glob: config.files.images.src })
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.images.dest));
});

gulp.task('dev:build:fonts', function() {
    gulp.src(config.files.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.fonts.dest));
});

gulp.task('dev:build:jade', function() {
    watch({ glob: config.files.jade.src })
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest(config.paths.jade.dest));
});

gulp.task('dev:watch', function() {
    gulp.watch(config.files.sass.watch, ['dev:build:sass']);
});

gulp.task('dev:build', ['dev:clean'], function() {
    gulp.start([
        'dev:build:js:vendor',
        'dev:build:js',
        'dev:build:css:vendor',
        'dev:build:css',
        'dev:build:sass',
        'dev:build:images',
        'dev:build:fonts',
        'dev:build:jade'
    ]);
});

gulp.task('dev', [
    'dev:clean',
    'dev:build',
    'dev:watch',
    'dev:connect'
]);
