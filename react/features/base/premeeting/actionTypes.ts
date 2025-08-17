
/**
 * set IS_PREMEETING_MODERATOR
 */
export const IS_PREMEETING_MODERATOR = 'IS_PREMEETING_MODERATOR';

/**
 * Action type to set the precall test data.
 */
export const SET_PRECALL_TEST_RESULTS = 'SET_PRECALL_TEST_RESULTS';

/**
 * Type for setting the user's consent for unsafe room joining.
 *
 * {
 *     type: SET_UNSAFE_ROOM_CONSENT,
 *     consent: boolean
 * }
 */
export const SET_UNSAFE_ROOM_CONSENT = 'SET_UNSAFE_ROOM_CONSENT'

/**
 * Type for setting whether the meeting will be recorded (audio & video).
 *
 * {
 *     type: SET_WILL_BE_RECORDED,
 *     record: boolean
 * }
 */
export const SET_WILL_BE_RECORDED = 'SET_WILL_BE_RECORDED'


/**
 * Type for setting whether the meeting will be transcribed into written minutes.
 *
 * {
 *     type: SET_WILL_BE_TRANSCRIBED,
 *     transcrib: boolean
 * }
 */
export const SET_WILL_BE_TRANSCRIBED = 'SET_WILL_BE_TRANSCRIBED'
