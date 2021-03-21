import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from "./app-reducer";

export const SET_TODOLISTS = "SET-TODOLISTS";
export const REMOVE_TODOLIST = "REMOVE-TODOLIST";
export const ADD_TODOLIST = "ADD-TODOLIST";
const CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE";
const CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER";
const CHANGE_TODOLIST_ENTITY_STATUS = "CHANGE-TODOLIST-ENTITY-STATUS";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case SET_TODOLISTS: {
            return action.todos.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        }
        case REMOVE_TODOLIST: {
            return state.filter(tl => tl.id !== action.id)
        }
        case ADD_TODOLIST: {
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        }
        case CHANGE_TODOLIST_TITLE: {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case CHANGE_TODOLIST_FILTER: {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case CHANGE_TODOLIST_ENTITY_STATUS: {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state;
    }
}

// actions
export const removeTodolistAC = (todolistId: string) => ({type: REMOVE_TODOLIST, id: todolistId} as const);

export const addTodolistAC = (todolist: TodolistType) => ({type: ADD_TODOLIST, todolist} as const);

export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: CHANGE_TODOLIST_TITLE, id, title} as const);

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: CHANGE_TODOLIST_FILTER, id, filter} as const);

export const setTodolistsAC = (todos: Array<TodolistType>) => ({type: SET_TODOLISTS, todos} as const);

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: CHANGE_TODOLIST_ENTITY_STATUS, id, entityStatus
} as const)

//thunks
export const fetchTodolistsTC = (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType): void => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI.getTodolists().then((res) => {
        let todos = res.data
        dispatch(setTodolistsAC(todos))
        dispatch(setAppStatusAC("succeeded"));
    })
}

export const addTodolistTC = (todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI.createTodolist(todolistTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC("some error"))
                }
                dispatch(setAppStatusAC("failed"))
            }
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                dispatch(setAppErrorAC(res.data.messages[0]))
            }
        })
}

export const changeTodolistTitleTC = (todolistId: string, todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI.updateTodolist(todolistId, todolistTitle)
        .then((res) => {
            const action = changeTodolistTitleAC(todolistId, todolistTitle);
            dispatch(action)
            dispatch(setAppStatusAC("succeeded"))
        })
}

// types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;

export type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ChangeTodolistEntityStatusActionType

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}