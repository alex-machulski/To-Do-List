import React, {useState} from 'react';
import './App.css';
import ToDoList from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}


export type FilterValuesType = "all" | "active" | "completed"

type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    // BLL - Business Logic Layer

    const todoListID1 = v1();
    const todoListID2 = v1();

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListID1, title: "What to learn", filter: "all"},
        {id: todoListID2, title: "What to buy", filter: "all"}
    ])


    const [tasks, setTasks] = useState<TaskStateType>({
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
        const todoListTasks = tasks[todoListID]
        tasks[todoListID] = todoListTasks.filter(task => task.id !== taskID)
        setTasks({...tasks})
    }

    function changeFilter(filterValue: FilterValuesType, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID);
        if (todoList) {
            todoList.filter = filterValue;
            setTodoLists([...todoLists]);
        }
    }

    function addTask(newTaskTitle: string, todoListID: string) {
        const newTask: TaskType = {
            id: v1(),
            title: newTaskTitle,
            isDone: false
        }
        tasks[todoListID] = [newTask, ...tasks[todoListID]]
        setTasks({...tasks});
    }

    function changeStatus(taskID: string, isDone: boolean, todoListID: string) {
        const todoListTasks = tasks[todoListID]
        const task = todoListTasks.find(t => t.id === taskID);
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks});
        }
    }

    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        const todoListTasks = tasks[todoListID]
        const task = todoListTasks.find(t => t.id === taskID);
        if (task) {
            task.title = title;
            setTasks({...tasks});
        }
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
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID];
    }

    function addTodoList(todoListTitle: string) {
        const todoListID = v1();
        const newTodoList: TodoListType = {
            id: todoListID,
            title: todoListTitle,
            filter: "all"
        }
        setTodoLists([newTodoList, ...todoLists]);
        setTasks({
            ...tasks,
            [todoListID]: []
        })
    }

    function changeTodoListTitle(title: string, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID)
        if (todoList) {
            todoList.title = title
            setTodoLists([...todoLists])
        }
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
                            // if (tl.filter === "active") {
                            //     tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
                            // }
                            // if (tl.filter === "completed") {
                            //     tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
                            // }
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

export default App;

