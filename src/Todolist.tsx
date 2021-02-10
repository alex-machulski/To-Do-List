import React, {ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type PropsType = {
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

export function ToDoList(props: PropsType) {
    // const todolist = useSelector<AppRootStateType, TodoListType>(state =>
    //     state.todolists.filter(todo => todo.id === props.id)[0]);
    // const tasks = useSelector<AppRootStateType, Array<TaskType>>(state =>
    //     state.tasks[props.id]);
    // const dispatch = useDispatch();

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }

    const onAllClickHandler = () => props.changeFilter("all", props.id)
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const removeTodoList = () => props.removeTodoList(props.id);
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.id);
    }

    return (
        <div>
            <h3 style={{textAlign: "center"}}>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                {/*<button onClick={removeTodoList}>x</button>*/}
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
                    props.tasks.map(t => {
                        const removeTask = () => {
                            props.removeTask(t.id, props.id)
                        }
                        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(t.id, e.currentTarget.checked, props.id)
                        }
                        const changeTitle = (title: string) => {
                            props.changeTaskTitle(t.id, title, props.id)
                        }

                        return (
                            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                                <Checkbox
                                    onChange={changeStatus}
                                    checked={t.isDone}
                                />
                                <EditableSpan title={t.title} changeTitle={changeTitle}/>
                                {/*<span>{t.title}</span>*/}
                                <IconButton onClick={removeTask}>
                                    <Delete/>
                                </IconButton>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default ToDoList;