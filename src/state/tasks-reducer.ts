import {TaskStatuses, TaskType, todolistsAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {TasksStateType} from "../app/AppWithRedux";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task);
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, status: TaskStatuses, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].status = action.payload.status;
            }
        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, title: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index].title = action.payload.title;
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId];
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todos.forEach(tl => {
                state[tl.id] = [];
            })
        });
    }
})

export const tasksReducer = slice.reducer;
export const {removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC, setTasksAC} = slice.actions;

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC({tasks, todolistId}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const addTaskTC = (todolistId: string, taskTitle: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        let res = await todolistsAPI.createTask(todolistId, taskTitle)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(addTaskAC({task}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: "succeeded"}))
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            const action = removeTaskAC({taskId, todolistId});
            dispatch(action);
            dispatch(setAppStatusAC({status: "succeeded"}));
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

export const updateTaskStatusTC = (id: string, status: TaskStatuses, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const tasks = state.tasks;
        const tasksForCurrentTodolist = tasks[todolistId];
        const currentTask = tasksForCurrentTodolist.find((el) => {
            return el.id === id
        })
        if (!currentTask) {
            console.warn("Task is not found")
            return;
        }
        dispatch(setAppStatusAC({status: "loading"}));
        todolistsAPI.updateTask(todolistId, id, {
            status: status,
            title: currentTask.title,
            startDate: currentTask.startDate,
            priority: currentTask.priority,
            description: currentTask.description,
            deadline: currentTask.deadline
        })
            .then((res) => {
                if (res.data.resultCode === 0) {
                    const action = changeTaskStatusAC({taskId: id, status, todolistId});
                    dispatch(action)
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }

export const updateTaskTitleTC = (id: string, taskTitle: string, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const tasks = state.tasks;
        const tasksForCurrentTodolist = tasks[todolistId];
        const currentTask: any = tasksForCurrentTodolist.find((el) => {
            return el.id === id
        })
        dispatch(setAppStatusAC({status: "loading"}));
        //const model = {...currentTask, status: status}
        todolistsAPI.updateTask(todolistId, id, {
            status: currentTask.status,
            title: taskTitle,
            startDate: currentTask.startDate,
            priority: currentTask.priority,
            description: currentTask.description,
            deadline: currentTask.deadline
        })
            .then((res) => {
                if (res.data.resultCode === 0) {
                    const action = changeTaskTitleAC({taskId: id, title: taskTitle, todolistId});
                    dispatch(action);
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(err, dispatch)
            })
    }

// export function tasksReducer(state: TasksStateType = initialState, action: ActionsType): TasksStateType {
//     switch (action.type) {
//         case SET_TASKS: {
//             return {...state, [action.todolistId]: action.tasks}
//         }
//         case SET_TODOLISTS: {
//             let stateCopy = {...state};
//             action.todos.forEach(tl => {
//                 stateCopy[tl.id] = []
//             })
//             return stateCopy
//         }
//         case REMOVE_TASK: {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
//             }
//         }
//         case ADD_TASK: {
//             return {
//                 ...state,
//                 [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
//             }
//         }
//         case CHANGE_TASK_STATUS: {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
//             }
//         }
//         case CHANGE_TASK_TITLE: {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId]
//                     .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
//             }
//         }
//         case ADD_TODOLIST: {
//             return {
//                 ...state,
//                 [action.todolist.id]: []
//             }
//         }
//         case REMOVE_TODOLIST: {
//             const stateCopy = {...state};
//             delete stateCopy[action.id];
//             return stateCopy;
//         }
//         default:
//             return state;
//     }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: REMOVE_TASK, taskId: taskId, todolistId: todolistId} as const);
//
// export const addTaskAC = (task: TaskType) => ({type: ADD_TASK, task} as const);
//
// export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) =>
//     ({type: CHANGE_TASK_STATUS, status, todolistId, taskId} as const);
//
// export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) =>
//     ({type: CHANGE_TASK_TITLE, title, todolistId, taskId} as const);
//
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//     ({type: SET_TASKS, tasks, todolistId} as const);

// {
//     [addTodolistAC.type]: (state, action: PayloadAction<{ }>) => {},
//     [removeTodolistAC.type]: (state, action: PayloadAction<{ }>) => {},
//     [setTodolistsAC.type]: (state, action: PayloadAction<{ }>) => {}
// }

