import React, {useCallback, useEffect} from "react";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import EditableSpan from "./components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Task from "./features/TodolistsList/Todolist/Task/Task";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "./state/todolists-reducer";
import {useDispatch} from "react-redux";
import {fetchTasksTC} from "./state/tasks-reducer";

type TodolistPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (todolistId: string, taskTitle: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist = React.memo(({demo = false, ...props}: TodolistPropsType) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (demo) {
            return;
        }
        dispatch(fetchTasksTC(props.todolist.id));
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolist.id, title)
    }, [props.addTask, props.todolist.id])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.todolist.id, props.changeFilter])

    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.todolist.id, props.changeFilter])

    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.todolist.id, props.changeFilter])

    const removeTodolist = useCallback(() =>
        props.removeTodolist(props.todolist.id), [props.removeTodolist, props.todolist.id]);

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeTodolistTitle])

    let tasksForTodolist = props.tasks
    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3 style={{textAlign: "center"}}>
                <EditableSpan title={props.todolist.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
            <div style={{marginTop: "20px"}}>
                <Button
                    variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                    color={"primary"}
                    size={"small"}
                    style={{marginRight: "3px"}}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button
                    variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                    color={"primary"}
                    size={"small"}
                    style={{marginRight: "3px"}}
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    variant={props.todolist.filter === "completed" ? "contained" : "outlined"}
                    color={"primary"}
                    size={"small"}
                    style={{marginRight: "3px"}}
                    onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
            <ul style={{listStyle: "none", padding: "0px"}}>
                {
                    tasksForTodolist.map(t => <Task
                            key={t.id}
                            changeTaskStatus={props.changeTaskStatus}
                            changeTaskTitle={props.changeTaskTitle}
                            task={t}
                            todolistId={props.todolist.id}
                            removeTask={props.removeTask}
                        />
                    )
                }
            </ul>
        </div>
    );
});


