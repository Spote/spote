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
    csscomb = require('gulp-csscomb'),
    plumber = require('gulp-plumber'),
    config = require('./tidy.json');

gulp.task('tidy:sass', function() {
    gulp.src(config.files.sass.src)
        .pipe(plumber())
        .pipe(csscomb())
        .pipe(gulp.dest(config.paths.sass.dest));
});

gulp.task('tidy', [
    'tidy:sass'
]);
