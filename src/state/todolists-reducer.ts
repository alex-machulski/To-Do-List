import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export const SET_TODOLISTS = "SET-TODOLISTS";
export const REMOVE_TODOLIST = "REMOVE-TODOLIST";
export const ADD_TODOLIST = "ADD-TODOLIST";
const CHANGE_TODOLIST_TITLE = "CHANGE-TODOLIST-TITLE";
const CHANGE_TODOLIST_FILTER = "CHANGE-TODOLIST-FILTER";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

const initialState: Array<TodolistDomainType> = [];

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case SET_TODOLISTS: {
            return action.todos.map(tl => ({...tl, filter: "all"}))
        }
        case REMOVE_TODOLIST: {
            return state.filter(tl => tl.id !== action.id)
        }
        case ADD_TODOLIST: {
            return [{
                ...action.todolist,
                filter: "all"
            }, ...state]
        }
        case CHANGE_TODOLIST_TITLE: {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title}: tl)
        }
        case CHANGE_TODOLIST_FILTER: {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter}: tl)
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

//thunks
export const setTodosTC = (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType): void => {
    // 1. side effects
    // 2. dispatch actions (thunk)
    todolistsAPI.getTodolists().then((res) => {
        let todos = res.data
        dispatch(setTodolistsAC(todos))
    })
}

export const addTodolistTC = (todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTodolist(todolistTitle)
        .then((res) => {
            const todolist = res.data.data.item
            const action = addTodolistAC(todolist);
            dispatch(action)
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            const action = removeTodolistAC(todolistId);
            dispatch(action)
        })
}

export const changeTodolistTitleTC = (todolistId: string, todolistTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistId, todolistTitle)
        .then((res) => {
            const action = changeTodolistTitleAC(todolistId, todolistTitle);
            dispatch(action)
        })
}