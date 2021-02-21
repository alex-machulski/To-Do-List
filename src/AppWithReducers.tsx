import React, {useReducer} from 'react';
import './App.css';
import {ToDoList} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC,
    todoListsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

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

function AppWithReducers() {
    // BLL - Business Logic Layer

    const todoListID1 = v1();
    const todoListID2 = v1();

    const [todoLists, dispatchToTodolists] = useReducer(todoListsReducer, [
        {id: todoListID1, title: "What to learn", filter: "all"},
        {id: todoListID2, title: "What to buy", filter: "all"}
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
            [todoListID1]: [
                {id: v1(), title: "HTML & CSS", isDone: true},
                {id: v1(), title: "JS", isDone: false},
                {id: v1(), title: "React", isDone: true},
                {id: v1(), title: "Redux", isDone: true},
                {id: v1(), title: "Rest API", isDone: false},
                {id: v1(), title: "GraphQL", isDone: false}
            ],
            [todoListID2]: [
                {id: v1(), title: "Bread", isDone: true},
                {id: v1(), title: "Milk", isDone: false},
                {id: v1(), title: "Butter", isDone: true},
            ]
        }
    )

    function removeTask(taskID: string, todoListID: string) {
        dispatchToTasks(removeTaskAC(taskID, todoListID));
    }

    function changeFilter(filterValue: FilterValuesType, todoListID: string) {
        dispatchToTodolists(changeTodoListFilterAC(todoListID, filterValue));
    }

    function addTask(newTaskTitle: string, todoListID: string) {
        dispatchToTasks(addTaskAC(newTaskTitle, todoListID));
    }

    function changeStatus(taskID: string, isDone: boolean, todoListID: string) {
        dispatchToTasks(changeTaskStatusAC(taskID, isDone, todoListID));
    }

    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        dispatchToTasks(changeTaskTitleAC(taskID, title, todoListID));
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

    function removeTodoList(todoListID: string) {
        let action = removeTodolistAC(todoListID);
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    function addTodoList(todoListTitle: string) {
        let action = addTodolistAC(todoListTitle);
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    function changeTodoListTitle(title: string, todoListID: string) {
        dispatchToTodolists(changeTodoListTitleAC(todoListID, title));
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

export default AppWithReducers;

