import React, {useCallback, useEffect} from "react";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Task from "./Task";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType} from "./state/todolists-reducer";
import {useDispatch} from "react-redux";
import {fetchTasksTC} from "./state/tasks-reducer";

type TodolistPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (todolistId: string, taskTitle: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = React.memo((props: TodolistPropsType) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTasksTC(props.id));
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title)
    }, [props.addTask, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])

    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])

    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])

    const removeTodolist = useCallback(() =>
        props.removeTodolist(props.id), [props.removeTodolist, props.id]);

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.id, props.changeTodolistTitle])

    let tasksForTodolist = props.tasks
    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3 style={{textAlign: "center"}}>
                <EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm addItem={addTask}/>
            <div style={{marginTop: "20px"}}>
                <Button
                    variant={props.filter === "all" ? "contained" : "outlined"}
                    color={"primary"}
                    size={"small"}
                    style={{marginRight: "3px"}}
                    onClick={onAllClickHandler}>All
                </Button>
                <Button
                    variant={props.filter === "active" ? "contained" : "outlined"}
                    color={"primary"}
                    size={"small"}
                    style={{marginRight: "3px"}}
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    variant={props.filter === "completed" ? "contained" : "outlined"}
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
                            todolistId={props.id}
                            removeTask={props.removeTask}
                        />
                    )
                }
            </ul>
        </div>
    );
});


