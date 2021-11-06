export interface IAPI{

    fetchGoals:()=> Promise<any>;

    fetchTodos:()=> Promise<any>;

    saveTodo:(name:any)=> Promise<any>;

    saveGoal:(name:any)=> Promise<any>;

    deleteGoal:(id: any)=> Promise<any>;

    deleteTodo:(id: any)=> Promise<any>;

    saveTodoToggle:(id: any)=> Promise<any>;

}