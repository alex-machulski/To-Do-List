import {
    ActionsType,
    addTodolistAC, changeTodoListFilterAC, changeTodoListTitleAC,
    removeTodolistAC,
    todoListsReducer
} from "./todolists-reducer";
import {v1} from 'uuid';
import {FilterValuesType, TodoListType} from "../App";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
})

test('correct todolist should be removed', () => {

    const action: ActionsType = removeTodolistAC(todolistId1);
    const endState = todoListsReducer(startState, action)

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";

    const action: ActionsType = addTodolistAC(newTodolistTitle);
    const endState = todoListsReducer(startState, action);

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const action: ActionsType = changeTodoListTitleAC(todolistId2, newTodolistTitle);
    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action: ActionsType = changeTodoListFilterAC(todolistId2, newFilter);
    const endState = todoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});




