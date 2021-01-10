import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";

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
}

export function ToDoList(props: PropsType) {

    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null)

    const addTask = () => {
        const taskTitle = title.trim();
        if (taskTitle) {
            props.addTask(taskTitle, props.id);
        } else {
            setError("Title is required!");
        }
        setTitle("");
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null);
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addTask()
    }
    const onAllClickHandler = () => props.changeFilter("all", props.id)
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);
    const removeTodoList = () => props.removeTodoList(props.id);

    return (
        <div>
            <h3>{props.title}<button onClick={removeTodoList}>x</button></h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                    className={error ? "error" : ""}
                />
                <button onClick={addTask}>+</button>
                {error && <div className={"error-message"}>{error}</div>}
            </div>
            <ul>
                {
                    props.tasks.map(t => {
                        const removeTask = () => {
                            props.removeTask(t.id, props.id)
                        }
                        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(t.id, e.currentTarget.checked, props.id)
                        }

                        return (
                            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                                <input
                                    onChange={changeStatus}
                                    type="checkbox"
                                    checked={t.isDone}
                                />
                                <span>{t.title}</span>
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