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

    let projectNavigationList = ProjectNavigationList(TodoDatabase.getProjects(), TodoDatabase.getProjects()[0], project => console.log("Project " + project.getName() + " selected!"));
    projectNavigationMenu.appendChild(projectNavigationList);

    const addNewProject = (newProjectName) => {
        const newProject = TodoDatabase.addNewProject(newProjectName);

        const oldNode = projectNavigationList;
        const newNode = ProjectNavigationList(TodoDatabase.getProjects(), newProject, project => console.log("Project " + project.getName() + " selected!"));

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

    projectContent.appendChild(TodoCreationContainer());

    console.log(project);

    project.getTodoList().forEach(todo => {
        projectContent.appendChild(TodoItem(todo));
    });

    return projectContent;
}

const TodoCreationContainer = () => {
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
    const newTodoDateField = createElement("input", ["new-todo-date"], "");
    newTodoDateField.type = "date";
    newTodoDateAndPriorityContainer.appendChild(newTodoDateField);
    const newTodoPriorityContainer = createElement("div", [], "");
    ["Low", "Normal", "High"].forEach(priority => {
        const priorityContainer = createElement("span", [], "");
        const priorityRadioButton = createElement("input", [], "");
        priorityRadioButton.type = "radio";
        priorityRadioButton.name = "priority";
        priorityRadioButton.id = priority.toLowerCase() + "-priority";
        if(priority === "Normal") priorityRadioButton.checked = true;
        priorityContainer.appendChild(priorityRadioButton);
        priorityContainer.appendChild(createElement("span", [], priority));
        
        newTodoPriorityContainer.appendChild(priorityContainer);
    })
    newTodoDateAndPriorityContainer.appendChild(newTodoPriorityContainer);
    todoCreationContainer.appendChild(newTodoDateAndPriorityContainer);

    const createButton = createElement("button", ["new-todo-create-button"], "Create To-Do");
    createButton.addEventListener("click", event => console.log("Create Button Clicked!"));
    todoCreationContainer.appendChild(createButton);

    return todoCreationContainer;
}

const TodoItem = (todo) => {
    const todoContainer = createElement("div", ["todo-item"], "");

    console.log(todo);

    const todoContent = createElement("div", ["item-content"], "");
    todoContent.appendChild(createElement("span", ["arrow"], ">"));
    todoContent.appendChild(createElement("span", ["name"], todo.getName()));
    todoContent.appendChild(createElement("span", ["due"], todo.getDueDate().toString()));
    todoContent.appendChild(createElement("span", ["priority"], todo.getPriority()));

    todoContainer.appendChild(todoContent);

    const todoExpand = createElement("div", ["item-expand"], "");
    todoExpand.appendChild(createElement("span", ["description"], todo.getDescription()));

    const buttonsContainer = createElement("div", ["buttons"], "");
    buttonsContainer.appendChild(createElement("button", ["complete-button"], "Mark Completed"));
    buttonsContainer.appendChild(createElement("button", ["edit-button"], "Edit"));
    buttonsContainer.appendChild(createElement("button", ["delete-button"], "Delete"));

    todoExpand.appendChild(buttonsContainer);

    todoContainer.appendChild(todoExpand);

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