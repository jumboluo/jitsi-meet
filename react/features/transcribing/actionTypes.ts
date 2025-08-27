

/**
 * The type of Redux action to set whether the transcribering poll has been approved
 */
export const SET_TRANSCRIBERING_POLL_APPROVED = 'SET_TRANSCRIBERING_POLL_APPROVED';

/**
 * The type of Redux action triggering storage of participantId of transcriber,
 * so that it can later be kicked
 *
 * {
 *     type: TRANSCRIBER_JOINED,
 *     participantId: String
 * }
 * @private
 */
export const TRANSCRIBER_JOINED = 'TRANSCRIBER_JOINED';

/**
 * The type of Redux action signalling that the transcriber has left
 *
 * {
 *     type: TRANSCRIBER_LEFT,
 *     participantId: String
 * }
 * @private
 */
export const TRANSCRIBER_LEFT = 'TRANSCRIBER_LEFT';
