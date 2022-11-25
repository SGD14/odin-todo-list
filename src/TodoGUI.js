import TodoDatabase from './TodoDatabase';

const TodoGUI = () => {
    const globalContainer = document.createElement("div");
    globalContainer.id = "global-container";

    const onProjectSelected = (project) => {
        globalContainer.removeChild(globalContainer.lastChild);
        globalContainer.appendChild(ProjectContent(project));
    }

    globalContainer.appendChild(ProjectNavigationMenu(onProjectSelected));
    globalContainer.appendChild(ProjectContent(TodoDatabase.getProjects()[0]));

    return globalContainer;
};

const ProjectNavigationMenu = (onProjectSelected) => {
    const projectNavigationMenu = createElement("div", ["project-menu"], "");

    const header = createElement("h1", [], "To-Do App");
    projectNavigationMenu.appendChild(header);

    const subHeader = document.createElement("h2");
    
    const line1 = createElement("div", ["line"], "");
    subHeader.appendChild(line1);

    const subHeaderText = createElement("span", [], "Projects");
    subHeader.appendChild(subHeaderText);

    const line2 = createElement("div", ["line"], "");
    subHeader.appendChild(line2);

    projectNavigationMenu.appendChild(subHeader);

    let projectNavigationList = ProjectNavigationList(TodoDatabase.getProjects(), TodoDatabase.getProjects()[0], onProjectSelected);
    projectNavigationMenu.appendChild(projectNavigationList);

    const addNewProject = (newProjectName) => {
        const newProject = TodoDatabase.addNewProject(newProjectName);

        const oldNode = projectNavigationList;
        const newNode = ProjectNavigationList(TodoDatabase.getProjects(), newProject, onProjectSelected);
        onProjectSelected(newProject);

        projectNavigationMenu.replaceChild(newNode, oldNode);

        projectNavigationList = newNode;
    }

    projectNavigationMenu.appendChild(ProjectCreationInput(projectName => addNewProject(projectName)));
    
    return projectNavigationMenu;
}

const ProjectNavigationList = (projectList, selectedProject, onProjectSelected) => {
    const projectNavigationList = createElement("div", ["project-list"], "");

    const markSelected = (projectNavigationElement) => {
        projectNavigationList.childNodes.forEach(projectElement => {
            if(projectElement === projectNavigationElement) {
                projectElement.classList.add("selected");
            } else {
                projectElement.classList.remove("selected");
            }
        });
    };

    const handleProjectClicked = (projectNavigationElement, project) => {
        markSelected(projectNavigationElement);
        onProjectSelected(project);
    };

    const handleProjectRemoveClicked = (projectNavigationElement, project) => {
        if(TodoDatabase.getProjects().length <= 1)
            return;

        projectNavigationList.removeChild(projectNavigationElement);
        TodoDatabase.removeProject(project);

        if(projectNavigationElement.classList.contains("selected")) {
            markSelected(projectNavigationList.firstChild);
            onProjectSelected(TodoDatabase.getProjects()[0]);
        }
    };

    projectList.forEach(project => {
        const projectNavigationElement = ProjectNavigationElement(project, () => handleProjectClicked(projectNavigationElement, project), () => handleProjectRemoveClicked(projectNavigationElement, project));

        if(project === selectedProject)
            projectNavigationElement.classList.add("selected");

        projectNavigationList.appendChild(projectNavigationElement);
    });

    return projectNavigationList;
}

const ProjectNavigationElement = (project, onClick, onDeleteClick) => {
    const projectNavigationElement = createElement("button", [], "");

    projectNavigationElement.appendChild(createElement("span", [], project.getName()));

    const deleteButton = createElement("button", ["delete-button"], "X");
    projectNavigationElement.appendChild(deleteButton);

    projectNavigationElement.addEventListener("click", event => onClick());

    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        onDeleteClick();
    });

    return projectNavigationElement;
}

const ProjectCreationInput = (onSubmit) => {
    const newProjectInput = createElement("input", [], "");
    newProjectInput.type = "text";
    newProjectInput.placeholder = "New Project...";

    newProjectInput.addEventListener("keypress", event => {
        if(event.key === "Enter") {
            const newProjectName = newProjectInput.value;

            if(newProjectName) {
                newProjectInput.value = "";
                newProjectInput.blur();
                onSubmit(newProjectName);
            }
        }
    })

    return newProjectInput;
}

const ProjectContent = (project) => {
    const projectContent = createElement("div", ["project-content"], "");

    const onTodoComplete = (todoItem, todo) => {
        project.removeTodo(todo);
        projectContent.removeChild(todoItem);
    }

    const onTodoCreated = (name, description, dueDate, priority) => {
        const newTodo = project.addNewTodo(name, description, dueDate, priority);
        const newTodoItem = TodoItem(newTodo, () => onTodoComplete(newTodoItem, newTodo));

        projectContent.appendChild(newTodoItem);
    }

    projectContent.appendChild(TodoCreationContainer(onTodoCreated));

    project.getTodoList().filter(todo => !todo.isCompleted()).forEach(todo => {
        const newTodoItem = TodoItem(todo, () => onTodoComplete(newTodoItem, todo));
        projectContent.appendChild(newTodoItem);
    });

    return projectContent;
}

const TodoCreationContainer = (onTodoSubmit) => {
    const todoCreationContainer = createElement("div", ["todo-creation-container"], "");
    todoCreationContainer.appendChild(createElement("label", [], "New To-Do Name"));
    
    const newTodoNameField = createElement("input", ["new-todo-name"], "");
    newTodoNameField.type = "text";
    newTodoNameField.placeholder = "New To-Do Name...";

    todoCreationContainer.appendChild(newTodoNameField);
    todoCreationContainer.appendChild(createElement("label", [], "New To-Do Description"));

    const newTodoDescriptionField = createElement("textarea", ["new-todo-description"], "");
    newTodoDescriptionField.placeholder = "New To-Do Description...";

    todoCreationContainer.appendChild(newTodoDescriptionField);

    const newTodoDateAndPriorityContainer = createElement("div", ["date-and-priority"], "");
    newTodoDateAndPriorityContainer.appendChild(createElement("label", [], "Due Date"));
    newTodoDateAndPriorityContainer.appendChild(createElement("label", [], "Priority"));
    const newTodoDueDateField = createElement("input", ["new-todo-date"], "");
    newTodoDueDateField.type = "date";
    newTodoDateAndPriorityContainer.appendChild(newTodoDueDateField);
    const newTodoPriorityContainer = createElement("div", [], "");
    ["Low", "Normal", "High"].forEach(priority => {
        const priorityContainer = createElement("span", [], "");
        const priorityRadioButton = createElement("input", [], "");
        priorityRadioButton.type = "radio";
        priorityRadioButton.name = "priority";
        priorityRadioButton.value = priority;
        if(priority === "Normal") priorityRadioButton.checked = true;
        priorityContainer.appendChild(priorityRadioButton);
        priorityContainer.appendChild(createElement("span", [], priority));
        
        newTodoPriorityContainer.appendChild(priorityContainer);
    })
    newTodoDateAndPriorityContainer.appendChild(newTodoPriorityContainer);
    todoCreationContainer.appendChild(newTodoDateAndPriorityContainer);

    const createButton = createElement("button", ["new-todo-create-button"], "Create To-Do");

    createButton.addEventListener("click", event => {
        const newTodoName = newTodoNameField.value;
        const newTodoDescription = newTodoDescriptionField.value;
        const newTodoDueDate = newTodoDueDateField.value;
        const newTodoPriority = document.querySelector('input[name="priority"]:checked').value;

        if(!newTodoName) return;
        if(!newTodoDueDate) return;
        if(!newTodoPriority) return;

        newTodoNameField.value = "";
        newTodoDescriptionField.value = "";
        newTodoDueDateField.value = "";
        document.querySelector('input[value="Normal"]').checked = true;

        onTodoSubmit(newTodoName, newTodoDescription, newTodoDueDate, newTodoPriority);
    });

    todoCreationContainer.appendChild(createButton);

    return todoCreationContainer;
}

const TodoItem = (todo, onCompleteClick) => {
    const todoContainer = createElement("div", ["todo-item"], "");

    const todoContent = createElement("div", ["item-content"], "");
    todoContent.appendChild(createElement("span", ["arrow"], ">"));
    const nameSpan = createElement("span", ["name"], todo.getName());
    todoContent.appendChild(nameSpan);
    const dueDateSpan = createElement("span", ["due"], todo.getDueDate().toString());
    todoContent.appendChild(dueDateSpan);
    const prioritySpan = createElement("span", ["priority"], todo.getPriority());
    todoContent.appendChild(prioritySpan);

    todoContainer.appendChild(todoContent);

    const todoExpand = createElement("div", ["item-expand"], "");
    const descriptionSpan = createElement("span", ["description"], todo.getDescription())
    todoExpand.appendChild(descriptionSpan);

    const buttonsContainer = createElement("div", ["buttons"], "");

    const completeButton = createElement("button", ["complete-button"], "Mark Completed");
    const editButton = createElement("button", ["edit-button"], "Edit");

    buttonsContainer.appendChild(completeButton);
    buttonsContainer.appendChild(editButton);

    completeButton.addEventListener("click", event => onCompleteClick());

    const enterEditMode = () => {
        const nameEdit = createElement("input", [], "");
        nameEdit.type = "text";
        nameEdit.value = todo.getName();

        const descriptionEdit = createElement("textarea", [], "");
        descriptionEdit.value = todo.getDescription();

        const dueDateEdit = createElement("input", [], "");
        dueDateEdit.type = "date";
        dueDateEdit.value = todo.getDueDate();

        const priorityEdit = createElement("select", [], "");
        const highPriorityOption = createElement("option", [], "High");
        highPriorityOption.value = "High";
        const normalPriorityOption = createElement("option", [], "Normal");
        normalPriorityOption.value = "Normal";
        const lowPriorityOption = createElement("option", [], "Low");
        lowPriorityOption.value = "Low";

        priorityEdit.appendChild(highPriorityOption);
        priorityEdit.appendChild(normalPriorityOption);
        priorityEdit.appendChild(lowPriorityOption);

        priorityEdit.value = todo.getPriority();

        const saveButton = createElement("button", [], "Save");

        nameEdit.addEventListener("click", event => event.stopPropagation());
        dueDateEdit.addEventListener("click", event => event.stopPropagation());
        priorityEdit.addEventListener("click", event => event.stopPropagation());
        descriptionEdit.addEventListener("click", event => event.stopPropagation());

        todoContent.replaceChild(nameEdit, nameSpan);
        todoContent.replaceChild(dueDateEdit, dueDateSpan);
        todoContent.replaceChild(priorityEdit, prioritySpan);
        todoExpand.replaceChild(descriptionEdit, descriptionSpan);
        buttonsContainer.replaceChild(saveButton, editButton);

        saveButton.addEventListener("click", event => {
            nameSpan.textContent = nameEdit.value;
            dueDateSpan.textContent = dueDateEdit.value;
            prioritySpan.textContent = priorityEdit.value;
            descriptionSpan.textContent = descriptionEdit.value;

            todo.setName(nameEdit.value);
            todo.setDueDate(dueDateEdit.value);
            todo.setPriority(priorityEdit.value);
            todo.setDescription(descriptionEdit.value);

            todoContent.replaceChild(nameSpan, nameEdit);
            todoContent.replaceChild(dueDateSpan, dueDateEdit);
            todoContent.replaceChild(prioritySpan, priorityEdit);
            todoExpand.replaceChild(descriptionSpan, descriptionEdit);
            buttonsContainer.replaceChild(editButton, saveButton);
        })
    }

    editButton.addEventListener("click", event => enterEditMode());

    todoExpand.appendChild(buttonsContainer);

    todoExpand.style["display"] = "none";

    todoContainer.appendChild(todoExpand);

    todoContent.addEventListener("click", event => todoExpand.style["display"] = todoExpand.style["display"] === "none" ? "" : "none");

    return todoContainer;
}

const createElement = (elementType, classList, textContent) => {
    const element = document.createElement(elementType);

    if(classList)
        classList.forEach(elementClass => element.classList.add(elementClass));

    if(textContent)
        element.textContent = textContent;

    return element;
}

export default TodoGUI();