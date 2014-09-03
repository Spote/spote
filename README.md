# Spote [![](http://img.shields.io/travis/Spote/spote.svg?style=flat-square)](http://travis-ci.org/Spote/spote) [![](http://img.shields.io/coveralls/Spote/spote.svg?style=flat-square)](https://coveralls.io/r/Spote/spote) ![](http://img.shields.io/david/Spote/spote.svg?style=flat-square) ![](http://img.shields.io/david/dev/Spote/spote.svg?style=flat-square)

Spote is a headless media server for Spotify with no dependence on the
official Spotify software.

This repository contains the web frontend for Spote which connects to and relies
on [spote-service](https://github.com/Spote/spote-service).

## Project Setup

### Dependencies

Install the Ruby dependencies.

```bash
$ gem install bundler
$ bundler install
```

Install the node.js dependencies.

```bash
$ npm install
```

Install the bower components.

```bash
$ npm install bower -g
$ bower install
```

### Building

The app uses the [gulp.js](http://gulpjs.com/) build system. As gulp is
included as a node.js dependency it does not need to be installed (provided the
dependecies above have been installed).

#### Development

```bash
$ gulp
```

This is an alias for the `dev` task.

The files are built to the `dev` directory, a watcher is
setup to rebuild the individual components on file change, and a web server is
ran on the address `http://localhost:8080` (with LiveReload).

#### Distribution

Execute the `dist` task. The files are built to the `dist` directory.

```bash
$ gulp dist
```

## Testing

Tests are executed using [Karma](http://karma-runner.github.io/). JavaScript
unit testing is done using [Jasmine](http://jasmine.github.io/).

### Unit Tests

Unit tests can be ran with Google Chrome.

```bash
$ karma start --browsers Chrome
```

Or Firefox.

```bash
$ karma start --browsers Firefox
```

## License

> Copyright 2014 Jack Wakefield
>
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>     http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
