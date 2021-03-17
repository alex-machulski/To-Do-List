import {TaskStatuses, TaskType, todolistsAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {
    ADD_TODOLIST,
    AddTodolistActionType,
    REMOVE_TODOLIST,
    RemoveTodolistActionType, SET_TODOLISTS,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TasksStateType} from "../app/AppWithRedux";

const REMOVE_TASK = "REMOVE-TASK";
const ADD_TASK = "ADD-TASK";
const CHANGE_TASK_STATUS = "CHANGE-TASK-STATUS";
const CHANGE_TASK_TITLE = "CHANGE-TASK-TITLE";
const SET_TASKS = "SET-TASKS";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type SetTasksActionType = ReturnType<typeof setTasksAC>;

type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

const initialState: TasksStateType = {}

export function tasksReducer(state: TasksStateType = initialState, action: ActionsType): TasksStateType {
    switch (action.type) {
        case SET_TASKS: {
            return {...state, [action.todolistId]: action.tasks}
        }
        case SET_TODOLISTS: {
            let stateCopy = {...state};
            action.todos.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case REMOVE_TASK: {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        case ADD_TASK: {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case CHANGE_TASK_STATUS: {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
            }
        }
        case CHANGE_TASK_TITLE: {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            }
        }
        case ADD_TODOLIST: {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case REMOVE_TODOLIST: {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: REMOVE_TASK, taskId: taskId, todolistId: todolistId} as const);

export const addTaskAC = (task: TaskType) => ({type: ADD_TASK, task} as const);

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) =>
    ({type: CHANGE_TASK_STATUS, status, todolistId, taskId} as const);

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) =>
    ({type: CHANGE_TASK_TITLE, title, todolistId, taskId} as const);

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: SET_TASKS, tasks, todolistId} as const);

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const action = setTasksAC(tasks, todolistId)
            dispatch(action)
        })
}

export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, taskTitle)
        .then((res) => {
            const task = res.data.data.item
            const action = addTaskAC(task);
            dispatch(action)
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            const action = removeTaskAC(taskId, todolistId);
            dispatch(action)
        })
}

export const updateTaskStatusTC = (id: string, status: TaskStatuses, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
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
        //const model = {...currentTask, status: status}
        todolistsAPI.updateTask(todolistId, id, {
            status: status,
            title: currentTask.title,
            startDate: currentTask.startDate,
            priority: currentTask.priority,
            description: currentTask.description,
            deadline: currentTask.deadline
        })
            .then((res) => {
                const action = changeTaskStatusAC(id, status, todolistId);
                dispatch(action)
            })
    }

export const updateTaskTitleTC = (id: string, taskTitle: string, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState();
        const tasks = state.tasks;
        const tasksForCurrentTodolist = tasks[todolistId];
        const currentTask: any = tasksForCurrentTodolist.find((el) => {
            return el.id === id
        })
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
                const action = changeTaskTitleAC(id, taskTitle, todolistId);
                dispatch(action)
            })
    }



