const TodoDatabase = (() => {
    const createProject = (name, todoList) => {
        const getName = () => name;
        const setName = (newName) => {
            name = newName;
            saveToLocalStorage();
        }

        const getTodoList = () => todoList;

        const addNewTodo = (title, description, dueDate, priority) => {
            const newTodo = createTodo(title, description, dueDate, priority, false);
            todoList.push(newTodo);
            saveToLocalStorage();
            return newTodo;
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
        const isCompleted = () => completed;

        const setName = (newTitle) => {
            name = newTitle;
            saveToLocalStorage();
        }

        const setDescription = (newDescription) => {
            description = newDescription;
            saveToLocalStorage();
        }

        const setDueDate = (newDueDate) => {
            dueDate = newDueDate;
            saveToLocalStorage();
        }

        const setPriority = (newPriority) => {
            priority = newPriority;
            saveToLocalStorage();
        }

        const setCompleted = (newCompleted) => {
            completed = newCompleted;
            saveToLocalStorage();
        }

        return {getName, setName, getDescription, setDescription, getDueDate, setDueDate, getPriority, setPriority, isCompleted, setCompleted};
    }

    const saveToLocalStorage = () => {
        const data = projectList.map(project => { return {
            name: project.getName(),
            todoList: project.getTodoList().map(todo => { return {
                title: todo.getName(),
                description: todo.getDescription(),
                dueDate: todo.getDueDate(),
                priority: todo.getPriority(),
                completed: todo.isCompleted()
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
        const newProject = createProject(name, []);
        projectList.push(newProject);
        saveToLocalStorage();

        return newProject;
    };

    const removeProject = (project) => {
        projectList.splice(projectList.indexOf(project), 1);
        saveToLocalStorage();
    };

    return {getProjects, addNewProject, removeProject};
})();

export default TodoDatabase;