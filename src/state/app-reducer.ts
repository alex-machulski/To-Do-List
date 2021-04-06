import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
        SetAppIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        }
    }
})

export const appReducer = slice.reducer;
export const {setAppStatusAC, setAppErrorAC, SetAppIsInitializedAC} = slice.actions;


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
                //dispatch(setAppStatusAC('succeeded'))
            } else {
            }
        })
        .finally(() => {
            dispatch(SetAppIsInitializedAC({isInitialized: true}))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// loading - show progress bar
// idle, succeeded, failed - hide progress bar

// export const appReducer = (state: AppReducerStateType = initialState, action: ActionsType): AppReducerStateType => {
//     switch (action.type) {
//         case APP_SET_STATUS:
//             return {...state, status: action.status}
//         case APP_SET_ERROR:
//             return {...state, error: action.error}
//         case APP_SET_INITIALIZED:
//             return {...state, isInitialized: action.isInitialized}
//         default:
//             return state
//     }
// }

//export const setAppStatusAC = (status: RequestStatusType) => ({type: APP_SET_STATUS, status} as const)
//export const setAppErrorAC = (error: string | null) => ({type: APP_SET_ERROR, error} as const)
//export const SetAppIsInitializedAC = (isInitialized: boolean) => ({type: APP_SET_INITIALIZED, isInitialized} as const)