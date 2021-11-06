import * as React from 'react';
import './App.css';
import {ISearchState} from "../../myreads/src/types";
import {ChangeEvent} from 'react';
import {addTodoAction, removeTodoAction, toggleTodoAction, addGoalAction, removeGoalAction, receiveData} from "./store";
import List from "./List";
import {IAPI} from "./types";

const api = (window as any).API as IAPI;

function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

class Todos extends React.Component<any, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            value:""
        };
    }
    addItem = (e) => {
        e.preventDefault()
        const value = this.state.value;
        this.setState((currentState:ISearchState)=>{
            return {
                ...currentState,
                value:""
            };
        });
        api.saveTodo(value)
            .then(todo=>{
                this.props.store.dispatch(addTodoAction(todo));
            })
            .catch(()=>{
                console.log("oops");
            })
    };
    removeItem = (todo) => {
        this.props.store.dispatch(removeTodoAction(todo.id));
        api.deleteTodo(todo.id)
            .then(()=> {
                console.log("ok");
            })
            .catch(()=>{
                console.log("oops");
                this.props.store.dispatch(addTodoAction(todo));
            });
    };
    toggleItem = (id) => {
        this.props.store.dispatch(toggleTodoAction(id));
        api.saveTodoToggle(id)
            .then(()=> {
                console.log("ok");
            })
            .catch(()=>{
                console.log("oops");
                this.props.store.dispatch(toggleTodoAction(id));
            });
    };
    onChange = (e:ChangeEvent)=>{
        const value = (e.target as HTMLSelectElement).value;
        this.setState((currentState:any)=>{
            return {
                ...currentState,
                value
            };
        });
    };
    render() {
        return (
            <div>
                <h1>Todo List</h1>
                <input
                    type='text'
                    placeholder='Add Todo'
                    value={this.state.value}
                    onChange={(e)=>this.onChange(e)}
                />
                <button onClick={this.addItem}>Add</button>
                <List
                    toggle={this.toggleItem}
                    items={this.props.todos}
                    remove={this.removeItem}
                />
            </div>
        )
    }
}

class Goals extends  React.Component<any, any> {
    constructor(props:any) {
        console.log(props);
        super(props);
        this.state = {
            value:""
        };
    }
    addItem = (e) => {
        e.preventDefault();
        const value = this.state.value;
        this.setState((currentState:ISearchState)=>{
            return {
                ...currentState,
                value:""
            };
        });
        this.props.store.dispatch(addGoalAction({
            name:value,
            complete: false,
            id: generateId()
        }))
    };
    removeItem = (goal) => {
        this.props.store.dispatch(removeGoalAction(goal.id))
    };
    onChange = (e:ChangeEvent)=>{
        const value = (e.target as HTMLSelectElement).value;
        this.setState((currentState:any)=>{
            return {
                ...currentState,
                value
            };
        });
    };
    render() {
        return (
            <div>
                <h1>Goals List</h1>
                <input
                    type='text'
                    placeholder='Add Goal'
                    value={this.state.value}
                    onChange={(e)=>this.onChange(e)}
                />
                <button onClick={this.addItem}>Add</button>
                <List
                    items={this.props.goals}
                    remove={this.removeItem}
                />
            </div>
        )
    }
}

class App extends React.Component {
    componentDidMount () {
        const store = this.props.store;

        Promise.all([api.fetchGoals(), api.fetchTodos()]).then((arr:any[])=>{
            const [goals, todos] = [arr[0], arr[1]];
            store.dispatch(receiveData(todos, goals));
        });
        store.subscribe(() => this.forceUpdate())
    }
    render() {
        const store = this.props.store;
        const { todos, goals, loading } = store.getState();
        const loadingEl = loading ? <p>loading...</p> : '';
        return (
            <div>
                {loadingEl}
                <Todos todos={todos} store={this.props.store} />
                <Goals goals={goals} store={this.props.store} />
            </div>
        )
    }
}

export default App;
