const rightside = document.querySelector(".stuff");

document.querySelector(".AddButton").addEventListener("click", () => {
    //defino los elementos y sus caracteristicas
    const newBox = document.createElement("article");
    newBox.classList.add("box");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Nombre de la caja";
    nameInput.classList.add("boxNameInput");

    const newX = document.createElement("p");
    newX.textContent = "x";
    newX.classList.add("xButton");

    const newPencil = document.createElement("span");
    newPencil.textContent = "✎"
    newPencil.classList.add("pencilButton");
    
    //seteo los padres de los elementos
    newBox.appendChild(newPencil);
    newBox.appendChild(nameInput);
    newBox.appendChild(newX);
    rightside.appendChild(newBox);
    
    nameInput.focus();

    function replaceInputWithTitle() {
        const newTitle = document.createElement("h1");
        newTitle.textContent = nameInput.value.trim() || "Caja sin nombre";
        newBox.replaceChild(newTitle, nameInput);

        //editar con click de lapiz
        newPencil.addEventListener("click", () => {
            newBox.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });
        //reeditable con doble click
        newTitle.addEventListener("dblclick", () => {
            newBox.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });
    }

    nameInput.addEventListener("keydown", (e) => {//e es basicamente cualquier tecla que yo haya apretado
        if (e.key === "Enter") {
            replaceInputWithTitle();
        }
    });

    nameInput.addEventListener("blur", () => {
        replaceInputWithTitle();
    });

    newX.addEventListener("click", () => {
        newBox.remove();
    });
});