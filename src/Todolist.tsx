import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";

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
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <button onClick={removeTodoList}>x</button>
            </h3>

            <AddItemForm addItem={addTask}/>

            <ul>
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
                                <input
                                    onChange={changeStatus}
                                    type="checkbox"
                                    checked={t.isDone}
                                />
                                <EditableSpan title={t.title} changeTitle={changeTitle}/>
                                {/*<span>{t.title}</span>*/}
                                <button onClick={removeTask}>x</button>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
                </button>
                <button
                    className={props.filter === "active" ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
                </button>
                <button
                    className={props.filter === "completed" ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    );
}

export default ToDoList;