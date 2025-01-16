# Saka [![GitHub license](https://img.shields.io/github/license/lusakasa/saka.svg)](https://github.com/lusakasa/saka/blob/master/LICENSE) [![Build Status](https://travis-ci.org/lusakasa/saka.svg?branch=master&style=popout-square)](https://travis-ci.org/lusakasa/saka) [![codecov.io Code Coverage](https://codecov.io/gh/lusakasa/saka/branch/master/graph/badge.svg?maxAge=2592000)](https://codecov.io/github/lusakasa/saka?branch=master) [![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/nbdfpcokndmapcollfpjdpjlabnibjdi.svg)](https://chrome.google.com/webstore/detail/saka/nbdfpcokndmapcollfpjdpjlabnibjdi)

## FORK This is my own fork of the latest version (0.17.3) of the original Saka extension

Changes:

1. Limit url length in suggestions because I sometimes have some sensitive information in them and often record my screen
2. Close popup when the background is clicked
3. Do google search if the prompt starts or ends with `>` (or `<`, or `\` for lucky searches)
4. Open new tabs next to the current one


## Original readme

A browsing assistant for [Firefox](https://addons.mozilla.org/firefox/addon/saka/) and [Chrome](https://chrome.google.com/webstore/detail/saka/nbdfpcokndmapcollfpjdpjlabnibjdi) designed to be fast, intuitive, and beautiful. Inspired by Spotlight. Keyboard-focused but mouse friendly too.

* Lists tabs in order of recency by default, then fuzzy search by title or URL.
* Search recently closed tabs
* Search all bookmarks
* Search all browsing history
* Search all modes at once

<img src="./images/preview.png" width="70%" height="70%">


## Install

Install Saka from the [Firefox Marketplace](https://addons.mozilla.org/firefox/addon/saka/) or [Chrome Webstore](https://chrome.google.com/webstore/detail/saka/nbdfpcokndmapcollfpjdpjlabnibjdi).

## Development
See the [Getting Started](https://github.com/lusakasa/saka/wiki/Getting-Started) page on the project Wiki.

## Release Instructions (for maintainers)

1.  Update the version number in `manifest/common.json`

2.  Make a commit and set the message to the version: `git commit -m "v0.15.2"`

3.  Tag the commit with the version and a message describing changes since the last release: `git tag -a v0.15.2`

4.  Push the commit to github with tags: `git push origin --follow-tags`

5.  View the build status at https://travis-ci.org/lusakasa/saka/ and generated releases at https://github.com/lusakasa/saka/releases

## License

MIT Licensed, Copyright (c) 2017 Sufyan Dawoodjee, Uzair Shamim
