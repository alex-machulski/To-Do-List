import React, {useState} from 'react';
import './App.css';
import ToDoList from "./Todolist";
import {v1} from "uuid";

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

    // const [filter, setFilter] = useState<FilterValuesType>("all")

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

    function filterTasksForTodoList(filterValue: FilterValuesType, todoListID: string) {
        let tasksForTodoList = tasks[todoListID]
        if (filterValue === "active") {
            tasksForTodoList = tasks[todoListID].filter(t => t.isDone === false)
        }
        if (filterValue === "completed") {
            tasksForTodoList = tasks[todoListID].filter(t => t.isDone === true)
        }
        return tasksForTodoList
    }

    function removeTodoList(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID];
    }

    // UI
    return (
        <div className="App">
            {
                todoLists.map(tl => {

                    let tasksForTodoList = filterTasksForTodoList(tl.filter, tl.id);
                    // if (tl.filter === "active") {
                    //     tasksForTodoList = tasks[tl.id].filter(t => t.isDone === false)
                    // }
                    // if (tl.filter === "completed") {
                    //     tasksForTodoList = tasks[tl.id].filter(t => t.isDone === true)
                    // }

                    return (
                        <ToDoList
                            key={tl.id}
                            id={tl.id}
                            filter={tl.filter}
                            title={tl.title}
                            tasks={tasksForTodoList}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask={addTask}
                            changeStatus={changeStatus}
                            removeTodoList={removeTodoList}
                        />
                    )
                })
            }

        </div>
    );
}

export default App;

