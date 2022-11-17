const createTodo = (title, description, dueDate, priority) => {
    return {title, description, dueDate, priority};
}

const createProject = (name, todoList) => {
    return {name, todoList};
}