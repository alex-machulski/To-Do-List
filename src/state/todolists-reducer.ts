import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC,} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            // return state.filter(tl => tl.id !== action.payload.todolistId)
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        setTodolistsAC(state, action: PayloadAction<{ todos: Array<TodolistType> }>) {
            return action.payload.todos.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.entityStatus;
        }
    }
})

export const todolistsReducer = slice.reducer;
export const {
    removeTodolistAC, addTodolistAC, changeTodolistTitleAC,
    changeTodolistFilterAC, setTodolistsAC, changeTodolistEntityStatusAC
} = slice.actions;

//thunks
export const fetchTodolistsTC = (dispatch: Dispatch, getState: () => AppRootStateType): void => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todos: res.data}))
            dispatch(setAppStatusAC({status: "succeeded"}));
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const addTodolistTC = (todolistTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistsAPI.createTodolist(todolistTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}));
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId: todolistId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const changeTodolistTitleTC = (todolistId: string, todolistTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistsAPI.updateTodolist(todolistId, todolistTitle)
        .then((res) => {
            const action = changeTodolistTitleAC({id: todolistId, title: todolistTitle});
            dispatch(action)
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

//     export const _todolistsReducer =(state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case SET_TODOLISTS: {
//             return action.todos.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
//         }
//         case REMOVE_TODOLIST: {
//             return state.filter(tl => tl.id !== action.id)
//         }
//         case ADD_TODOLIST: {
//             return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
//         }
//         case CHANGE_TODOLIST_TITLE: {
//             return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//         }
//         case CHANGE_TODOLIST_FILTER: {
//             return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
//         }
//         case CHANGE_TODOLIST_ENTITY_STATUS: {
//             return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
//         }
//         default:
//             return state;
//     }
// }

// actions
// export const removeTodolistAC = (todolistId: string) => ({type: REMOVE_TODOLIST, id: todolistId} as const);
//
// export const addTodolistAC = (todolist: TodolistType) => ({type: ADD_TODOLIST, todolist} as const);
//
// export const changeTodolistTitleAC = (id: string, title: string) =>
//     ({type: CHANGE_TODOLIST_TITLE, id, title} as const);
//
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
//     ({type: CHANGE_TODOLIST_FILTER, id, filter} as const);
//
// export const setTodolistsAC = (todos: Array<TodolistType>) => ({type: SET_TODOLISTS, todos} as const);
//
// export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
//     type: CHANGE_TODOLIST_ENTITY_STATUS, id, entityStatus
// } as const)