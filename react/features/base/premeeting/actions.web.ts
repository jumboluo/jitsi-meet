import { IStore } from '../../app/types';
import JitsiMeetJS from '../lib-jitsi-meet';

import { IS_PREMEETING_MODERATOR, SET_PRECALL_TEST_RESULTS, SET_UNSAFE_ROOM_CONSENT, SET_WILL_BE_RECORDED, SET_WILL_BE_TRANSCRIBED } from './actionTypes';
import { getPreCallICEUrl } from './functions';
import logger from './logger';
import { IPreCallResult, IPreCallTestState, PreCallTestStatus } from './types';

/**
 * Sets whether the meeting will be recorded (audio & video),
 * prior notice only, not that the meeting will be recorded automatically.
 *
 * @param {boolean} isModerator - whether the meeting will be recorded
 * @returns {{
 *      type: SET_UNSAFE_ROOM_CONSENT,
*       isModerator: boolean
* }}
 */
export function setIsPremeetingModerator(isModerator: boolean) {
    return {
        type: IS_PREMEETING_MODERATOR,
        isModerator
    };
}

/**
 * Sets the consent of the user for joining the unsafe room.
 *
 * @param {boolean} consent - The user's consent.
 * @returns {{
 *      type: SET_UNSAFE_ROOM_CONSENT,
*       consent: boolean
* }}
 */
export function setUnsafeRoomConsent(consent: boolean) {
    return {
        type: SET_UNSAFE_ROOM_CONSENT,
        consent
    };
}

/**
 * Sets whether the meeting will be recorded (audio & video),
 * prior notice only, not that the meeting will be recorded automatically.
 *
 * @param {boolean} record - whether the meeting will be recorded
 * @returns {{
 *      type: SET_WILL_BE_RECORDED,
*       record: boolean
* }}
 */
export function setWillBeRecorded(record: boolean) {
    return {
        type: SET_WILL_BE_RECORDED,
        record
    };
}

/**
 * Sets whether the meeting will be transcribed into written minutes,
 * prior notice only, not that the meeting will be transcribed automatically.
 *
 * @param {boolean} transcrib - whether the meeting will be transcribed
 * @returns {{
 *      type: SET_WILL_BE_TRANSCRIBED,
*       transcrib: boolean
* }}
 */
export function setWillBeTranscribed(transcrib: boolean) {
    return {
        type: SET_WILL_BE_TRANSCRIBED,
        transcrib
    };
}

/**
 * Initializes the 'precallTest' and executes one test, storing the results.
 *
 * @returns {Function}
 */
export function runPreCallTest() {
    return async function(dispatch: Function, getState: IStore['getState']) {
        try {

            dispatch(setPreCallTestResults({ status: PreCallTestStatus.RUNNING }));

            const turnCredentialsUrl = getPreCallICEUrl(getState());

            if (!turnCredentialsUrl) {
                throw new Error('No TURN credentials URL provided in config');
            }

            const turnCredentials = await fetch(turnCredentialsUrl);
            const { iceServers } = await turnCredentials.json();
            const result: IPreCallResult = await JitsiMeetJS.runPreCallTest(iceServers);

            dispatch(setPreCallTestResults({ status: PreCallTestStatus.FINISHED,
                result }));
        } catch (error) {
            logger.error('Failed to run pre-call test', error);

            dispatch(setPreCallTestResults({ status: PreCallTestStatus.FAILED }));
        }
    };
}

/**
 * Action used to set data from precall test.
 *
 * @param {IPreCallTestState} value - The precall test results.
 * @returns {Object}
 */
export function setPreCallTestResults(value: IPreCallTestState) {
    return {
        type: SET_PRECALL_TEST_RESULTS,
        value
    };
}
