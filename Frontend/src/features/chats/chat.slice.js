import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        error: null,
        userMessage: '',
        ai1Response: '',
        ai2Response: '',
        judgeResult: null,
        loadingResponses: false,
        loadingJudge: false,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setUserMessage: (state, action) => {
            state.userMessage = action.payload;
        },
        setAi1Response: (state, action) => {
            state.ai1Response = action.payload;
        },
        appendAi1Response: (state, action) => {
            state.ai1Response += action.payload;
        },
        setAi2Response: (state, action) => {
            state.ai2Response = action.payload;
        },
        appendAi2Response: (state, action) => {
            state.ai2Response += action.payload;
        },
        setJudgeResult: (state, action) => {
            state.judgeResult = action.payload;
        },
        setLoadingResponses: (state, action) => {
            state.loadingResponses = action.payload;
        },
        setLoadingJudge: (state, action) => {
            state.loadingJudge = action.payload;
        },
    }
});

export const {
    addMessage,
    setError,
    setUserMessage,
    setAi1Response,
    appendAi1Response,
    setAi2Response,
    appendAi2Response,
    setJudgeResult,
    setLoadingResponses,
    setLoadingJudge,
} = chatSlice.actions;
export default chatSlice.reducer;