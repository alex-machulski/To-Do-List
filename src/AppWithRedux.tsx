import React from 'react';
import './App.css';
import ToDoList from "./Todolist";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type FilterValuesType = "all" | "active" | "completed"

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    // BLL - Business Logic Layer

    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);

    function removeTask(taskID: string, todoListID: string) {
        dispatch(removeTaskAC(taskID, todoListID));
    }

    function changeFilter(filterValue: FilterValuesType, todoListID: string) {
        dispatch(changeTodoListFilterAC(todoListID, filterValue));
    }

    function addTask(newTaskTitle: string, todoListID: string) {
        dispatch(addTaskAC(newTaskTitle, todoListID));
    }

    function changeStatus(taskID: string, isDone: boolean, todoListID: string) {
        dispatch(changeTaskStatusAC(taskID, isDone, todoListID));
    }

    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        dispatch(changeTaskTitleAC(taskID, title, todoListID));
    }

    function removeTodoList(todoListID: string) {
        dispatch(removeTodolistAC(todoListID));
    }

    function addTodoList(todoListTitle: string) {
        dispatch(addTodolistAC(todoListTitle));
    }

    function changeTodoListTitle(title: string, todoListID: string) {
        dispatch(changeTodoListTitleAC(todoListID, title));
    }

    function filterTasksForTodoList(filterValue: FilterValuesType, todoListID: string) {
        let tasksForTodoList = tasks[todoListID]
        if (filterValue === "active") {
            tasksForTodoList = tasksForTodoList.filter(t => !t.isDone)
        }
        if (filterValue === "completed") {
            tasksForTodoList = tasksForTodoList.filter(t => t.isDone)
        }
        return tasksForTodoList
    }

    // UI
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>

                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <div>
                        <Typography variant="h6">
                            News
                        </Typography>
                    </div>
                    <Button color="inherit">Login</Button>

                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{padding: "10px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {

                            let tasksForTodoList = filterTasksForTodoList(tl.filter, tl.id);

                            return (
                                <Grid item key={tl.id}>
                                    <Paper elevation={10} style={{padding: "20px"}}>
                                        <ToDoList
                                            id={tl.id}
                                            filter={tl.filter}
                                            title={tl.title}
                                            tasks={tasksForTodoList}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeStatus={changeStatus}
                                            removeTodoList={removeTodoList}
                                            changeTaskTitle={changeTaskTitle}
                                            changeTodoListTitle={changeTodoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>

        </div>
    );
}

export default AppWithRedux;

