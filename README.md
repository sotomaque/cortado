#  Press React Native Customer App

## :arrow_up: How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`


## :arrow_forward: How to Run App

  * for Android
    * Run Genymotion
    * run `react-native run-android`

## Helpful Commands

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
# Check Deployment Status
code-push deployment list PressCustomerIOS

# Deploy to Staging
code-push release-react PressCustomerIOS ios

# Promote Staging to Production
code-push promote PressCustomerIOS Staging Production
```

**Android**

```
# Check Deployment Status
code-push deployment list PressCustomerAndroid

# Deploy to Staging
code-push release-react PressCustomerAndroid android

# Promote Staging to Production
code-push promote PressCustomerAndroid Staging Production
```
