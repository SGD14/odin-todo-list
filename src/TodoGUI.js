import TodoDatabase from './TodoDatabase';

const TodoGUI = () => {
    const globalContainer = document.createElement("div");
    globalContainer.id = "global-container";

    const onProjectSelected = (project) => console.log("Project Selected! " + project.getName());

    globalContainer.appendChild(ProjectNavigationMenu(TodoDatabase.getProjects(), onProjectSelected));

    return globalContainer;
};

const ProjectNavigationMenu = (projectList, onProjectSelected) => {
    const projectNavigationMenu = document.createElement("div");
    projectNavigationMenu.classList.add("project-menu");

    const header = document.createElement("h1");
    header.textContent = "To-Do App";

    const subHeader = document.createElement("h2");
    
    const line1 = document.createElement("div");
    line1.classList.add("line");
    const subHeaderText = document.createElement("span");
    subHeaderText.textContent = "Projects";
    const line2 = document.createElement("div");
    line2.classList.add("line");
    
    subHeader.appendChild(line1);
    subHeader.appendChild(subHeaderText);
    subHeader.appendChild(line2);

    const projectListContainer = document.createElement("div");
    projectListContainer.classList.add("project-list");

    projectList.forEach(project => {
        const projectButton = document.createElement("button");
        projectButton.textContent = project.getName();

        projectButton.addEventListener('click', event => onProjectSelected(project));

        projectListContainer.appendChild(projectButton);
    });

    projectNavigationMenu.appendChild(header);
    projectNavigationMenu.appendChild(subHeader);
    projectNavigationMenu.appendChild(projectListContainer);

    return projectNavigationMenu;
}

export default TodoGUI();