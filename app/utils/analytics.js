import SegmentAnalytics from 'react-native-analytics-segment';
import Config from 'react-native-config';


export default {
    setup: function() {
        const flushEverySecondsCount = 1;
        console.log('[Analytics] Initializing...');
        SegmentAnalytics.setup(Config.SEGMENT_IO_WRITE_KEY, flushEverySecondsCount);
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
