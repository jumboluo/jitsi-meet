import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../../app/types';
import { showNotification } from '../../../../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE } from '../../../../notifications/constants';
import { JitsiConferenceEvents, JitsiConnectionEvents } from '../../../lib-jitsi-meet';
import Checkbox from '../../../ui/components/web/Checkbox';
import { getBackendSafeRoomName } from '../../../util/uri';
import { setIsPremeetingModerator, setWillBeRecorded, setWillBeTranscribed } from '../../actions.web';
/**
 * The type of the React {@code Component} props of {@link Toolbox}.
 */
interface IProps {
    /**
     * 房间名称
     */
    roomName: string;
}

const useStyles = makeStyles()(theme => {
    return {
        checkboxes: {
            padding: `0 ${theme.spacing(3)}`,
            marginBottom: theme.spacing(3)
        }
    };
});

function PriorNoticeCheckboxes({
    roomName
}: IProps) {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const my: {
        conference: any | null;
        connection: any | null;
        id: string | null;
        isModerator: boolean;
        lastNotify: number;
    } = {
        conference: null,
        connection: null,
        id: null,
        isModerator: true,
        lastNotify: 0
    };

    const { isPremeetingModerator, willBeRecorded, willBeTranscribed }
    = useSelector((state: IReduxState) => state['features/base/premeeting']);

    const setIsModerator = useCallback(
        (isModerator: boolean) => {
            dispatch(setIsPremeetingModerator(isModerator));

            const tt = new Date().getTime();

            if (tt - my.lastNotify > 2000) {
                my.lastNotify = tt;
                dispatch(showNotification({
                    titleKey: isModerator ? 'notify.moderator' : 'notify.notModerator'
                },
                NOTIFICATION_TIMEOUT_TYPE.SHORT));
            }
        }, [ dispatch ]);

    const setRecorded = useCallback(
        (recorded: boolean, sendMsg: boolean) => {
            dispatch(setWillBeRecorded(recorded));
            sendMsg && my.conference?.sendMessage('setRecorded:' + (recorded ? 'true' : 'false'));
        }, [ dispatch ]);

    const setTranscribed = useCallback(
        (transcribed: boolean, sendMsg: boolean) => {
            dispatch(setWillBeTranscribed(transcribed));
            sendMsg && my.conference?.sendMessage('setTranscribed:' + transcribed);
        }, [ dispatch ]);

    // 用于checkbox的onChange的两个回调函数
    const toggleRecorded = useCallback(
        () => setRecorded(!willBeRecorded, true)
        , [ willBeRecorded, setRecorded ]);
    const toggleTranscribed = useCallback(
        () => setTranscribed(!willBeTranscribed, true)
        , [ willBeTranscribed, setTranscribed ]);

    const backendConnection = useCallback(
        (room?: string) => {
            const domain = 'alpha.jitsi.net';
            const options = {
                hosts: {
                    domain: domain,
                    muc: `conference.${domain}`
                },
                serviceUrl: `wss://${domain}/xmpp-websocket?room=${room}`,
                websocket: `wss://${domain}/xmpp-websocket`
            };

            const connection = new JitsiMeetJS.JitsiConnection(null, null, options);

            my.connection = connection;

            function _onConnectionEstablished() {
                console.log('premeeting backend connection established');

                const confOptions = {
                    openBridgeChannel: true, // 只开数据通道
                    p2p: { enabled: false }
                };

                const preConf = connection.initJitsiConference(room, confOptions);


                preConf.on(
                    JitsiConferenceEvents.CONFERENCE_JOINED,
                    () => {
                        my.id = preConf.myUserId();
                        my.isModerator = preConf.getParticipantCount() === 1;
                        setIsModerator(my.isModerator);
                    }
                );

                preConf.on(
                    JitsiConferenceEvents.MESSAGE_RECEIVED,
                    (from: any, text: string) => {
                        if (from !== my.id) {
                            if (text === 'setRecorded:true') {
                                setRecorded(true, false);
                            }
                            if (text === 'setRecorded:false') {
                                setRecorded(false, false);
                            }
                            if (text === 'setTranscribed:true') {
                                setTranscribed(true, false);
                            }
                            if (text === 'setTranscribed:false') {
                                setTranscribed(false, false);
                            }
                        }
                    }
                );

                preConf.on(
                    JitsiConferenceEvents.USER_ROLE_CHANGED,
                    (id: string, role: string) => {
                        console.log('User role changed:', id, role);

                        if (id === my.id) {
                            const isModerat = role === 'moderator';

                            if (my.isModerator !== isModerat) {
                                my.isModerator = isModerat;
                                setIsModerator(my.isModerator);
                            }
                        }
                    }
                );

                preConf.join();

                my.conference = preConf;
            }

            connection.addEventListener(
                JitsiConnectionEvents.CONNECTION_ESTABLISHED,
                _onConnectionEstablished);
            connection.addEventListener(
                JitsiConnectionEvents.CONNECTION_FAILED,
                (err: string, message: string) => console.error(err, message));
            connection.addEventListener(
                JitsiConnectionEvents.CONNECTION_DISCONNECTED,
                () => console.log('premeeting backend connection disconnected'));

            connection.connect();
        }
        , [ ]
    );

    useEffect(() => {
        backendConnection(getBackendSafeRoomName(roomName?.replaceAll(' ', '') + 'premeeting'));
    }, []);

    return (
        <div>
            <Checkbox
                checked = { willBeRecorded }
                className = { classes.checkboxes }
                disabled = { !isPremeetingModerator }
                label = { t('recording.recordAudioAndVideo') }
                onChange = { toggleRecorded } />
            <Checkbox
                checked = { willBeTranscribed }
                className = { classes.checkboxes }
                disabled = { !isPremeetingModerator }
                label = { t('recording.recordTranscription') }
                onChange = { toggleTranscribed } />
        </div>
    );
}

export default PriorNoticeCheckboxes;
