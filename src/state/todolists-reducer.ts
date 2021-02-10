import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodoListActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodoListActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
type ChangeTodoListTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
type ChangeTodoListFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}

export type ActionsType = RemoveTodoListActionType | AddTodoListActionType | ChangeTodoListTitleActionType |
    ChangeTodoListFilterActionType

const initialState: Array<TodoListType> = [];

export function todoListsReducer(state: Array<TodoListType> = initialState, action: ActionsType): Array<TodoListType> {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListType = {
                id: action.todolistId,
                title: action.title,
                filter: "all"
            }
            return [newTodoList, ...state]
        case 'CHANGE-TODOLIST-TITLE': {
            const todoLists = state.map(tl => {
                if (tl.id === action.id) {
                    return {...tl, title: action.title};
                }
                return tl;
            })
            return todoLists;
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todoLists = state.map(tl => {
                if (tl.id === action.id) {
                    return {...tl, filter: action.filter};
                }
                return tl;
            })
            return todoLists;
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodoListActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId};
}

export const addTodolistAC = (title: string): AddTodoListActionType => {
    return {type: "ADD-TODOLIST", title: title, todolistId: v1()};
}

export const changeTodoListTitleAC = (todolistId: string, newTitle: string): ChangeTodoListTitleActionType => {
    return {type: "CHANGE-TODOLIST-TITLE", id: todolistId, title: newTitle};
}

export const changeTodoListFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodoListFilterActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id: todolistId, filter: filter};
}
