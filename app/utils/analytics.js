import { Platform } from 'react-native';

import SegmentAnalytics from 'react-native-analytics-segment';
import Config from 'react-native-config';


export default {
    setup: function() {
        const flushEverySecondsCount = 1;
        const segmentWriteKey = Platform.select({
            ios: Config.SEGMENT_IO_WRITE_KEY_IOS,
            android: Config.SEGMENT_IO_WRITE_KEY_ANDROID
        });

        console.log('[Analytics] Initializing...');
        SegmentAnalytics.setup(segmentWriteKey, flushEverySecondsCount);
        console.log('[Analytics] Initialization complete');
    },

    identifyUserByEmail: function(email) {
        console.log('[Analytics] Identified user: ' + email);
        SegmentAnalytics.identify(email);
    },

    sendEvent: function(eventType, properties = {}) {
        console.log('[Analytics] Sending event: ' + eventType);
        if (properties) {
            console.log(properties);
        }
        SegmentAnalytics.track(eventType, properties);
    },

    sendPageView: function(pageName, properties = {}) {
        console.log('[Analytics] Sending page view: ' + pageName);
        if (properties) {
            console.log(properties);
        }
        SegmentAnalytics.screen(pageName, properties);
    },

    reset: function() {
        console.log('[Analytics] Clearing identified user...');
        SegmentAnalytics.reset();
    }
};
