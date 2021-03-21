export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// loading - show progress bar
// idle, succeeded, failed - hide progress bar
const APP_SET_STATUS = "APP/SET-STATUS";
const APP_SET_ERROR = "APP/SET-ERROR";

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case APP_SET_STATUS:
            return {...state, status: action.status}
        case APP_SET_ERROR:
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: APP_SET_STATUS, status} as const)
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

export const setAppErrorAC = (error: string | null) => ({type: APP_SET_ERROR, error} as const)
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

type ActionsType = SetAppStatusActionType | SetAppErrorActionType;