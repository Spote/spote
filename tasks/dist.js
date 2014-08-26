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
    rimraf = require('gulp-rimraf'),
    traceur = require('gulp-traceur'),
    plumber = require('gulp-plumber'),
    modRewrite = require('connect-modrewrite'),
    jade = require('gulp-jade'),
    config = require('./dist.json');

gulp.task('dist:clean', function() {
    return gulp.src(config.paths.dest)
        .pipe(plumber())
        .pipe(rimraf());
});

gulp.task('dist:build:js:vendor', ['dist:clean'], function() {
    gulp.src(config.files.js.vendor)
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.js.vendor));
});

gulp.task('dist:build:js', ['dist:clean'], function() {
    gulp.src(config.files.js.src)
        .pipe(plumber())
        .pipe(traceur({
                experimental: true,
                modules: 'instantiate'
           })
        )
        .pipe(gulp.dest(config.paths.js.dest));
});

gulp.task('dist:build:css:vendor', ['dist:clean'], function() {
    gulp.src(config.files.css.vendor)
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.css.vendor));
});

gulp.task('dist:build:sass', function() {
    gulp.src(config.files.sass.src)
        .pipe(plumber())
        .pipe(sass({
                loadPath: config.files.sass.includes,
                compass: true
            })
        )
        .pipe(gulp.dest(config.paths.css.dest));
});

gulp.task('dist:build:images', ['dist:clean'], function() {
    gulp.src(config.files.images.src)
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.images.dest));
});

gulp.task('dist:build:fonts', ['dist:clean'], function() {
    gulp.src(config.files.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(config.paths.fonts.dest));
});

gulp.task('dist:build:jade', ['dist:clean'], function() {
    gulp.src(config.files.jade.src)
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest(config.paths.jade.dest));
});

gulp.task('dist:build', function() {
    gulp.start([
        'dist:clean',
        'dist:build:js:vendor',
        'dist:build:js',
        'dist:build:css:vendor',
        'dist:build:sass',
        'dist:build:images',
        'dist:build:fonts',
        'dist:build:jade'
    ]);
});

gulp.task('dist', [
    'dist:build'
]);
