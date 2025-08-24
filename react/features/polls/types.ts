export interface IAnswer {

    /**
     * An array of boolean: true if the answer was chosen by the responder, else false.
     */
    answers: Array<boolean>;

    /**
     * ID of the parent Poll of this answer.
     */
    pollId: string;

    /**
     * ID of the voter for this answer.
     */
    voterId: string;

    /**
     * Name of the voter for this answer.
     */
    voterName?: string;
}

export interface IPoll {

    /**
     * An array of answers:
     * the name of the answer name and a map of ids and names of voters voting for this option.
     */
    answers: Array<IAnswerData>;

    /**
     * Whether the poll vote is being edited/changed.
     */
    changingVote: boolean;

    /**
     * Whether poll is in edit mode or not?.
     */
    editing: boolean;

    /**
     * Whether poll is an approval poll or not.
     */
    isApprovalPoll: boolean;

    /**
     * Whether poll is singleChoice or not. ('not' means multiple choice)
     */
    isSingleChoice: boolean;

    /**
     * The last sent votes for this poll, or null if voting was skipped
     * Note: This is reset when voting/skipping, not when clicking "Change vote".
     */
    lastVote: Array<boolean> | null;

    /**
     * An array of participant IDs that are expected to vote in this poll.
     */
    participants: Array<string> | null;

    /**
     * The question asked by this poll.
     */
    question: string;

    /**
     * Whether poll is saved or not?.
     */
    saved: boolean;

    /**
     * ID of the sender of this poll.
     */
    senderId: string | undefined;

    /**
     * Whether the results should be shown instead of the answer form.
     */
    showResults: boolean;

    /**
     * Whether the poll can be skipped or not.
     */
    skippable: boolean;
}

export interface IPollData extends IPoll {
    id: string;
}

export interface IAnswerData {

    /**
     * The answer name chosen for the poll.
     */
    name: string;

    /**
     * An array of voters.
     */
    voters: Array<string>;
}
