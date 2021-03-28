import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {Dispatch} from "redux";

const APP_SET_STATUS = "APP/SET-STATUS";
const APP_SET_ERROR = "APP/SET-ERROR";
const APP_SET_INITIALIZED = "APP/SET-INITIALIZED";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: AppReducerStateType = initialState, action: ActionsType): AppReducerStateType => {
    switch (action.type) {
        case APP_SET_STATUS:
            return {...state, status: action.status}
        case APP_SET_ERROR:
            return {...state, error: action.error}
        case APP_SET_INITIALIZED:
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                //dispatch(setAppStatusAC('succeeded'))
            } else {
            }
        })
        .finally(() => {
            dispatch(SetIsInitializedAC(true))
        })
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: APP_SET_STATUS, status} as const)
export const setAppErrorAC = (error: string | null) => ({type: APP_SET_ERROR, error} as const)
export const SetIsInitializedAC = (isInitialized: boolean) => ({type: APP_SET_INITIALIZED, isInitialized} as const)

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetIsInitializedActionType = ReturnType<typeof SetIsInitializedAC>

type ActionsType = SetAppStatusActionType | SetAppErrorActionType | SetIsInitializedActionType;

export type AppReducerStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// loading - show progress bar
// idle, succeeded, failed - hide progress bar