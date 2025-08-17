
export enum PreCallTestStatus {
    FAILED = 'FAILED',
    FINISHED = 'FINISHED',
    INITIAL = 'INITIAL',
    RUNNING = 'RUNNING'
}

export interface IPreMeetingState {
    isPremeetingModerator: boolean; // 是否是会议前的主持人
    preCallTestState: IPreCallTestState;
    unsafeRoomConsent?: boolean;

    /**
     * 会议的“预先告知”，包含：
     * 1、会议是否会录音录像,
     * 2、会议是否会将会议声音转录为文本的会议纪要/会议记录.
     *
     * 注意：仅在主持人开始会议时通过开关控制上述两项，不代表会议开始时自动录音录像和做会议转录。
     * 也就是仅作为预先告知被会议主持人设置、被会议受邀人看到.
     */
    willBeRecorded: boolean; // 会议是否会录音录像
    willBeTranscribed: boolean; // 会议是否会将会议声音转录为文本的会议纪要/会议记录
}

export interface IPreCallTestState {
    result?: IPreCallResult;
    status: PreCallTestStatus;
}

export interface IPreCallResult {
    fractionalLoss: number;
    jitter: number;
    mediaConnectivity: boolean;
    rtt: number;
    throughput: number;
}
