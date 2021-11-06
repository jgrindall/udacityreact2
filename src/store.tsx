import {applyMiddleware, combineReducers, createStore} from "redux";

export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const ADD_GOAL = 'ADD_GOAL';
export const REMOVE_GOAL = 'REMOVE_GOAL';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export function addTodoAction (todo) {
    return {
        type: ADD_TODO,
        todo
    }
}

export function removeTodoAction (id) {
    return {
        type: REMOVE_TODO,
        id
    }
}

export function toggleTodoAction (id) {
    return {
        type: TOGGLE_TODO,
        id
    }
}

export function addGoalAction (goal) {
    return {
        type: ADD_GOAL,
        goal
    }
}

export function removeGoalAction (id) {
    return {
        type: REMOVE_GOAL,
        id
    }
}

export function receiveData(todos, goals){
    return {
        type: RECEIVE_DATA,
        todos,
        goals
    }
}

export function todos (state = [], action) {
    switch(action.type) {
        case ADD_TODO :
            return state.concat([action.todo]);
        case REMOVE_TODO :
            return state.filter((todo) => todo.id !== action.id);
        case TOGGLE_TODO :
            return state.map((todo) => todo.id !== action.id ? todo :
                Object.assign({}, todo, { complete: !todo.complete }));
        case RECEIVE_DATA:
            return action.todos || [];
        default :
            return state
    }
}

export function goals (state = [], action) {
    switch(action.type) {
        case ADD_GOAL :
            return state.concat([action.goal]);
        case REMOVE_GOAL :
            return state.filter((goal) => goal.id !== action.id);
        case RECEIVE_DATA:
            return action.goals || [];
        default :
            return state
    }
}

export function loading(state = true, action){
    switch(action.type) {
        case RECEIVE_DATA:
            return false;
        default :
            return state
    }
}

const checker = (store) => (next) => (action) => {
    if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('bitcoin')) {
        return alert("Nope. That's a bad idea.")
    }

    if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('bitcoin')) {
        return alert("Nope. That's a bad idea.")
    }
    return next(action)
};

const logger = (store) => (next) => (action) => {
    console.log('The action: ', action);
    const result = next(action);
    console.log('The new state: ', store.getState());
    return result;
};

export const store = createStore(combineReducers({
    todos,
    goals,
    loading
}), applyMiddleware(checker, logger));