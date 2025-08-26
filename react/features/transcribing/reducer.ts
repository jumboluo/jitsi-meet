import { CONFERENCE_PROPERTIES_CHANGED, UPDATE_CONFERENCE_METADATA } from '../base/conference/actionTypes';
import ReducerRegistry from '../base/redux/ReducerRegistry';

import {
    TRANSCRIBER_JOINED,
    TRANSCRIBER_LEFT
} from './actionTypes';

/**
 * Returns initial state for transcribing feature part of Redux store.
 *
 * @returns {{
 * isTranscribing: boolean,
 * transcriberJID: null
 * }}
 * @private
 */
function _getInitialState() {
    return {
        /**
         * Indicates whether there is currently an active transcriber in the
         * room.
         *
         * @type {boolean}
         */
        isTranscribing: false,

        /**
         * Whether the poll to start transcribing has been approved.
         */
        poll: {
            approved: false
        },

        /**
         * The JID of the active transcriber.
         *
         * @type { string }
         */
        transcriberJID: null
    };
}

export interface ITranscribingState {
    isTranscribing: boolean;
    poll: {
        approved: boolean;
    };
    transcriberJID?: string | null;
}

/**
 * Reduces the Redux actions of the feature features/transcribing.
 */
ReducerRegistry.register<ITranscribingState>('features/transcribing',
    (state = _getInitialState(), action): ITranscribingState => {
        switch (action.type) {
        case CONFERENCE_PROPERTIES_CHANGED: {
            const audioRecording = action.properties?.['audio-recording-enabled'];

            if (typeof audioRecording !== 'undefined') {
                const audioRecordingEnabled = audioRecording === 'true';

                if (state.isTranscribing !== audioRecordingEnabled) {
                    return {
                        ...state,
                        isTranscribing: audioRecordingEnabled
                    };
                }
            }

            return state;
        }
        case TRANSCRIBER_JOINED:
            return {
                ...state,
                isTranscribing: true,
                transcriberJID: action.transcriberJID
            };
        case TRANSCRIBER_LEFT:
            return {
                ...state,
                isTranscribing: false,
                transcriberJID: undefined
            };
        case UPDATE_CONFERENCE_METADATA:
            if (action.metadata?.transcribingPoll?.approved) {
                return {
                    ...state,
                    poll: {
                        approved: true,
                    }
                };
            } else {
                return state;
            }
        default:
            return state;
        }
    });
