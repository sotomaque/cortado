#  Press
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native App 

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`


## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS
  * for Android
    * Run Genymotion
    * run `react-native run-android`

## :no_entry_sign: Standard Compliant

**helpful cl things to remember **

(1) $ Watchman watch-del-all
    $ rm -rf node_modules && npm install
    $ npm start -- --reset-cache

(2) 
	for Print: Entry, ":CFBundleIdentifier", Does Not Exist

	Go to File -> Project settings
	Click the Advanced button
	Select "Custom" and select "Relative to Workspace" in the pull down
	click done, done

  else try: react-native upgrade

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [ghooks](https://github.com/gtramontina/ghooks). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## Configuration

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file located in the root of the project:

```
API_URL=https://myapi.com
GOOGLE_MAPS_API_KEY=abcdefgh
```

and access them from React Native like so:

```
import Config from 'react-native-config'

Config.API_URL  // 'https://myapi.com'
Config.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
Config.DEBUG  // true
```

The `.env` file is ignored by git keeping those secrets out of your repo.

## Analytics

This project uses [Segment](https://segment.com/) to log analytics events. A wrapper for [this sdk](https://github.com/presshq/react-native-analytics) can be found in /app/utils/analytics.js

## Releasing an Update

We use [CodePush](https://microsoft.github.io/code-push/index.html) to publish instant app updates, bypassing the app store review process. This only works for changes to JavaScript and asset files. For updates involving changes to native code, you must publish through the app store.

**iOS**

```
code-push release-react PressCustomerIOS ios
```

**Android**

```
code-push release-react PressCustomerAndroid android
```
