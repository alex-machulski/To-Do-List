import {
    ActionsType,
    addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, setTodolistsAC, TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";
import {v1} from 'uuid';
import {TodolistType} from "../api/todolists-api";


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistType>
let startDomainState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", addedDate: "", order: 0},
        {id: todolistId2, title: "What to buy", addedDate: "", order: 0}
    ]
    startDomainState = startState.map(item => ({...item, filter: "all"}));

})

test('correct todolist should be removed', () => {

    const action: ActionsType = removeTodolistAC(todolistId1);
    const endState = todolistsReducer(startDomainState, action)

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolist = {
        title: "New Todolist",
        id: "1111111",
        addedDate: "",
        order: 0
    };

    const action: ActionsType = addTodolistAC(newTodolist);
    const endState = todolistsReducer(startDomainState, action);

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolist.title);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const action: ActionsType = changeTodolistTitleAC(todolistId2, newTodolistTitle);
    const endState = todolistsReducer(startDomainState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action: ActionsType = changeTodolistFilterAC(todolistId2, newFilter);
    const endState = todolistsReducer(startDomainState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to the state', () => {
    const action = setTodolistsAC(startState)

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);

})




