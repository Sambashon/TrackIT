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
    newPencil.textContent = "✎";
    newPencil.classList.add("pencilButton");
    
    const newItemButton = document.createElement("span");
    newItemButton.textContent = "+ Agregar Item";
    newItemButton.classList.add("addItemButton");

    

    const itemList = document.createElement("ul");
    itemList.classList.add("itemList");

    const newHeader = document.createElement("header");
    newHeader.classList.add("boxheader");


    //seteo los padres de los elementos
    newBox.appendChild(newHeader);
    newHeader.appendChild(newPencil);
    newHeader.appendChild(nameInput);
    newBox.appendChild(newX);
    newBox.appendChild(newItemButton);
    newBox.appendChild(itemList);

    rightside.appendChild(newBox);
    nameInput.focus();

    function replaceInputWithTitle() {
        const newTitle = document.createElement("h1");
        newTitle.textContent = nameInput.value.trim() || "Caja sin nombre";
        newHeader.replaceChild(newTitle, nameInput);

        //editar con click de lapiz
        newPencil.addEventListener("click", () => {
            newHeader.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });
        //reeditable con doble click
        newTitle.addEventListener("dblclick", () => {
            newHeader.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });
    }

    function itemInput(){
        const itemRow = document.createElement("div");
        itemRow.classList.add("itemRow");


        const deleteItemButton = document.createElement("img");
        deleteItemButton.alt = "deleteItem";
        deleteItemButton.src = 'Resources/bin.png';
        deleteItemButton.classList.add("deleteitembutton");

        const itemContainerInput = document.createElement("input");
        itemContainerInput.type = "text";
        itemContainerInput.placeholder = "Nombre de item";
        itemContainerInput.classList.add("itemContainerInput");

        itemList.appendChild(itemRow);
        itemRow.appendChild(itemContainerInput);

        itemContainerInput.focus();

        itemContainerInput.addEventListener("keydown", (e) => {
            const newItem = document.createElement("li");
            newItem.textContent = itemContainerInput.value.trim() || "Item sin nombre";
            if(e.key === "Enter"){
                
                itemRow.replaceChild(newItem, itemContainerInput);
                itemRow.appendChild(deleteItemButton);
            }
        });
        itemContainerInput.addEventListener("blur", () => {
            console.log("Blur is working");
            const newItem = document.createElement("li"); //ERA ESTOOOOO AAAAAAAAAAAAAAAGHHHHHHHHHH ME OLVIDE DE CREAR EL ELEMENT Y POR ESO NO FUNCABA SEBA NO TE OLVIDES
            newItem.textContent = itemContainerInput.value.trim() || "Item sin nombre";

            itemRow.replaceChild(newItem, itemContainerInput);
            itemRow.appendChild(deleteItemButton);
            
            newItem.addEventListener("dblclick", () => {
                deleteItemButton.remove();
                itemRow.replaceChild(itemContainerInput, newItem);
                itemContainerInput.value = newItem.textContent;
                itemContainerInput.focus();
            });
        });
        
        deleteItemButton.addEventListener("click", () => {
            deleteItemButton.parentElement.remove();
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
        const confirmation = confirm("Seguro desea eliminar la caja?");
        if (confirmation){
            newBox.remove();
        }  
    });

    newItemButton.addEventListener("click", () => {
        itemInput();
    });
});