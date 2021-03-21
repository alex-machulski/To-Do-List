import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    removeTodolistTC,
    TodolistDomainType
} from "../../state/todolists-reducer";
import {AppRootStateType} from "../../state/store";
import {addTaskTC, removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../../state/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {FilterValuesType, TasksStateType} from "../../app/AppWithRedux";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "../../Todolist";


export const TodolistsList: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC)
    }, []);

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskTC(todolistId, id);
        dispatch(thunk);
    }, []);

    const addTask = useCallback(function (todolistId: string, taskTitle: string) {
        dispatch(addTaskTC(todolistId, taskTitle));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskStatusTC(id, status, todolistId));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTitleTC(id, newTitle, todolistId));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id);
        dispatch(thunk);
    }, []);

    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(addTodolistTC(todolistTitle));
    }, [dispatch]);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC(id, title);
        dispatch(thunk);
    }, []);

    return (
        <>
            <Grid container style={{padding: "10px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {

                        let tasksForTodoList = tasks[tl.id];

                        return (
                            <Grid item key={tl.id}>
                                <Paper elevation={10} style={{padding: "20px"}}>
                                    <Todolist
                                        id={tl.id}
                                        filter={tl.filter}
                                        title={tl.title}
                                        tasks={tasksForTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                        entityStatus={tl.entityStatus}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}