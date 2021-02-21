import React, {useCallback} from "react";
import {FilterValuesType, TaskType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Task from "./Task";

type TodolistPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: string, todoListID: string) => void
    changeFilter: (filterValue: FilterValuesType, todoListID: string) => void
    addTask: (newTaskTitle: string, todoListID: string) => void
    changeStatus: (taskID: string, isDone: boolean, todoListID: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (taskID: string, title: string, todoListID: string) => void
    changeTodoListTitle: (title: string, todoListID: string) => void
}

export const ToDoList = React.memo((props: TodolistPropsType) => {
    // const todolist = useSelector<AppRootStateType, TodoListType>(state =>
    //     state.todolists.filter(tl => tl.id === props.id)[0]);
    // const tasks = useSelector<AppRootStateType, Array<TaskType>>(state =>
    //     state.tasks[props.id]);
    // const dispatch = useDispatch();

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id]);

    const onAllClickHandler = useCallback(() =>
        props.changeFilter("all", props.id), [props.changeFilter, props.id]);

    const onActiveClickHandler = useCallback(() =>
        props.changeFilter("active", props.id), [props.changeFilter, props.id]);

    const onCompletedClickHandler = useCallback(() =>
        props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

    const removeTodoList = useCallback(() =>
        props.removeTodoList(props.id), [props.removeTodoList, props.id]);

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.id);
    }, [props.id, props.changeTodoListTitle]);

    let tasksForTodolist = props.tasks;
    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => !t.isDone)
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.isDone)
    }

    return (
        <div>
            <h3 style={{textAlign: "center"}}>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
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
                            changeStatus={props.changeStatus}
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


