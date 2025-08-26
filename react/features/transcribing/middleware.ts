import { UPDATE_CONFERENCE_METADATA } from '../base/conference/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';
import { showErrorNotification, showNotification } from '../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE } from '../notifications/constants';

import { TRANSCRIBER_LEFT } from './actionTypes';
import './subscriber';

/**
 * Implements the middleware of the feature transcribing.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch }) => next => action => {
    switch (action.type) {
    case TRANSCRIBER_LEFT:
        if (action.abruptly) {
            dispatch(showErrorNotification({
                titleKey: 'transcribing.failed'
            }));
        }
        break;

    case UPDATE_CONFERENCE_METADATA:
        if (action.metadata?.transcribingPoll?.approved) {
            dispatch(showNotification({
                titleKey: 'transcribing.pollAproved'
            }, NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
        break;
    }

    return next(action);
});
