import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {tasksReducer} from "../state/tasks-reducer";
import {todolistsReducer} from "../state/todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {appReducer} from "../state/app-reducer";
import {AppRootStateType} from "../state/store";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", addedDate: "", order: 0, filter: "all", entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", addedDate: "", order: 0, filter: "all", entityStatus: "idle"}
    ],
    tasks: {
        ["todolistId1"]: [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
            {id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
        ],
        ["todolistId2"]: [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
            {id: "3", title: "tea",status: TaskStatuses.New, todoListId: "todolistId2", description: "",
                startDate: "", deadline: "", addedDate: "", order: 0, priority: TaskPriorities.Low},
        ]
    },
    app: {
        error: null,
        status: "idle"
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>
)
