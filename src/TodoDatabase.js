const TodoDatabase = (() => {
    const createProject = (name, todoList) => {
        const getName = () => name;
        const setName = (newName) => {
            name = newName;
            saveToLocalStorage();
        }

        const getTodoList = () => todoList;

        const addNewTodo = (title, description, dueDate, priority) => {
            todoList.push(createTodo(title, description, dueDate, priority, false));
            saveToLocalStorage();
        }

        const removeTodo = (todo) => {
            todoList.splice(todoList.indexOf(todo), 1);
            saveToLocalStorage();
        }

        return {getName, setName, getTodoList, addNewTodo, removeTodo};
    }

    const createTodo = (name, description, dueDate, priority, completed) => {
        const getName = () => name;
        const getDescription = () => description;
        const getDueDate = () => dueDate;
        const getPriority = () => priority;
        const getCompleted = () => completed;

        const setTitle = (newTitle) => {
            name = newTitle;
            saveData();
        }

        const setDescription = (newDescription) => {
            description = newDescription;
            saveData();
        }

        const setDueDate = (newDueDate) => {
            dueDate = newDueDate;
            saveData();
        }

        const setPriority = (newPriority) => {
            priority = newPriority;
            saveData();
        }

        const setCompleted = (newCompleted) => {
            completed = newCompleted;
            saveData();
        }

        return {getName, setTitle, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, getCompleted, setCompleted};
    }

    const saveToLocalStorage = () => {
        const data = projectList.map(project => { return {
            name: project.getName(),
            todoList: project.getTodoList().map(todo => { return {
                title: todo.getTitle(),
                description: todo.getDescription(),
                dueDate: todo.getDueDate(),
                priority: todo.getPriority(),
                completed: todo.getCompleted()
            }})
        }});

        localStorage.setItem("TodoDatabase", JSON.stringify(data));
    }

    const loadFromLocalStorage = () => {
        let savedStorage = JSON.parse(localStorage.getItem("TodoDatabase"));

        if(savedStorage)
            return savedStorage.map(project => 
                createProject(project.name, project.todoList.map(todo => 
                    createTodo(todo.title, todo.description, todo.dueDate, todo.priority, todo.completed))));

        return [createProject("Default Project", [createTodo("Default To-Do", "This is a default To-Do item.", Date.now().toString(), "Normal", false)])];
    }

    let projectList = loadFromLocalStorage();

    const getProjects = () => projectList;

    const addNewProject = (name) => {
        projectList.push(createProject(name, []));
        saveToLocalStorage();
    };

    const removeProject = (project) => {
        projectList.splice(projectList.indexOf(project), 1);
        saveToLocalStorage();
    };

    return {getProjects, addNewProject, removeProject};
})();

export default TodoDatabase;