import ReducerRegistry from '../redux/ReducerRegistry';

import { IS_PREMEETING_MODERATOR, SET_PRECALL_TEST_RESULTS, SET_UNSAFE_ROOM_CONSENT, SET_WILL_BE_RECORDED, SET_WILL_BE_TRANSCRIBED } from './actionTypes';
import { IPreMeetingState, PreCallTestStatus } from './types';


const DEFAULT_STATE: IPreMeetingState = {
    isPremeetingModerator: false,
    preCallTestState: {
        status: PreCallTestStatus.INITIAL
    },
    unsafeRoomConsent: false,
    willBeRecorded: false,
    willBeTranscribed: false
};

/**
 * Listen for actions which changes the state of known and used devices.
 *
 * @param {IDevicesState} state - The Redux state of the feature features/base/devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {IPreMeetingState}
 */
ReducerRegistry.register<IPreMeetingState>(
    'features/base/premeeting',
    (state = DEFAULT_STATE, action): IPreMeetingState => {
        switch (action.type) {
        case IS_PREMEETING_MODERATOR:
            return {
                ...state,
                isPremeetingModerator: action.isModerator
            };
        case SET_PRECALL_TEST_RESULTS:
            return {
                ...state,
                preCallTestState: action.value
            };

        case SET_UNSAFE_ROOM_CONSENT: {
            return {
                ...state,
                unsafeRoomConsent: action.consent
            };
        }
        case SET_WILL_BE_RECORDED: {
            return {
                ...state,
                willBeRecorded: action.record
            };
        }
        case SET_WILL_BE_TRANSCRIBED: {
            return {
                ...state,
                willBeTranscribed: action.transcrib
            };
        }
        default:
            return state;
        }
    });

