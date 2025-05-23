const rightside = document.querySelector(".stuff");
const datoscaja = [];

function asideSync(){
    const aside = document.querySelector("aside");
    if (!aside) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const currentHeightPx = aside.offsetHeight;
    let currentHeightRem = currentHeightPx / rootFontSize;
    currentHeightRem += addRem;
    aside.style.height = currentHeightRem + "rem";
}


// Move setupItemEdit here so both createBoxFromData and AddButton handler can use it
function setupItemEdit(newItem, itemRow, deleteItemButton) {
    newItem.addEventListener("dblclick", () => {
        deleteItemButton.remove();

        const itemContainerInput = document.createElement("input");
        itemContainerInput.type = "text";
        itemContainerInput.classList.add("itemContainerInput");
        itemContainerInput.value = newItem.textContent;

        itemRow.replaceChild(itemContainerInput, newItem);
        itemContainerInput.focus();

        const oldText = newItem.textContent;

        itemContainerInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveChanges();
            }
        });

        itemContainerInput.addEventListener("blur", () => {
            saveChanges();
        });

        function saveChanges() {
            const updatedText = itemContainerInput.value.trim() || "Item sin nombre";

            const index = boxObject.items.indexOf(oldText);
            if (index !== -1) {
                boxObject.items[index] = updatedText;
            }

            const updatedItem = document.createElement("li");
            updatedItem.textContent = updatedText;

            itemRow.replaceChild(updatedItem, itemContainerInput);
            itemRow.appendChild(deleteItemButton);

            setupItemEdit(updatedItem, itemRow, deleteItemButton);
        }
    });
}

function createBoxFromData(boxData) {
    // Simulate clicking "Add" to create the box UI and add object to datoscaja
    document.querySelector(".AddButton").click();

    // Grab the newly created box and object
    const lastBox = rightside.lastElementChild;
    const boxInput = lastBox.querySelector(".boxNameInput");
    const boxObject = datoscaja[datoscaja.length - 1];

    // Set the box name and trigger title replacement
    boxInput.value = boxData.nombre;
    boxInput.dispatchEvent(new Event("blur")); // triggers replaceInputWithTitle()

    const itemList = lastBox.querySelector(".itemList");

    boxData.items.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.classList.add("itemRow");

        const deleteItemButton = document.createElement("img");
        deleteItemButton.alt = "deleteItem";
        deleteItemButton.src = 'Resources/bin.png';
        deleteItemButton.classList.add("deleteitembutton");

        const newItem = document.createElement("li");
        newItem.textContent = item;
        itemRow.appendChild(newItem);
        itemRow.appendChild(deleteItemButton);
        itemList.appendChild(itemRow);

        boxObject.items.push(item);

        // Add editing ability to imported items
        setupItemEdit(newItem, itemRow, deleteItemButton);

        // Deletion logic
        deleteItemButton.addEventListener("click", () => {
            const index = boxObject.items.indexOf(item);
            if (index !== -1) {
                boxObject.items.splice(index, 1);
            }
            itemRow.remove();
        });
    });
}

document.querySelector(".Save").addEventListener("click", () => {
    const jsonString = JSON.stringify(datoscaja, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "datoscaja.json";
    link.click();

    URL.revokeObjectURL(link.href);
});

document.querySelector(".Import").addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const loadedData = JSON.parse(event.target.result);

                rightside.innerHTML = "";
                datoscaja.length = 0;

                loadedData.forEach(boxData => {
                    createBoxFromData(boxData);
                });

            } catch (e) {
                alert("El archivo no es válido.");
                console.error("Invalid JSON:", e);
            }
        };

        reader.readAsText(file);
    });

    fileInput.click();
});

document.querySelector(".AddButton").addEventListener("click", () => {
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

    newBox.appendChild(newHeader);
    newHeader.appendChild(newPencil);
    newHeader.appendChild(nameInput);
    newBox.appendChild(newX);
    newBox.appendChild(newItemButton);
    newBox.appendChild(itemList);

    rightside.appendChild(newBox);

    const boxObject = {
        nombre: "",
        items: []
    };
    datoscaja.push(boxObject);

    nameInput.focus();

    function replaceInputWithTitle() {
        const newTitle = document.createElement("h1");
        newTitle.textContent = nameInput.value.trim() || "Caja sin nombre";
        boxObject.nombre = newTitle.textContent;
        newHeader.replaceChild(newTitle, nameInput);

        newPencil.addEventListener("click", () => {
            newHeader.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });

        newTitle.addEventListener("dblclick", () => {
            newHeader.replaceChild(nameInput, newTitle);
            nameInput.value = newTitle.textContent;
            nameInput.focus();
        });
    }

    function itemInput() {
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

        let saved = false;

        function saveItem() {
            if (saved) return;
            saved = true;

            const itemText = itemContainerInput.value.trim() || "Item sin nombre";
            const newItem = document.createElement("li");
            newItem.textContent = itemText;

            boxObject.items.push(itemText);

            itemRow.replaceChild(newItem, itemContainerInput);
            itemRow.appendChild(deleteItemButton);

            setupItemEdit(newItem, itemRow, deleteItemButton);
        }

        itemContainerInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveItem();
            }
        });

        itemContainerInput.addEventListener("blur", () => {
            saveItem();
        });

        deleteItemButton.addEventListener("click", () => {
            const itemText = deleteItemButton.parentElement.querySelector("li")?.textContent;
            if (itemText) {
                const index = boxObject.items.indexOf(itemText);
                if (index !== -1) {
                    boxObject.items.splice(index, 1);
                }
            }
            deleteItemButton.parentElement.remove();
        });
    }

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            replaceInputWithTitle();
        }
    });

    nameInput.addEventListener("blur", () => {
        replaceInputWithTitle();
    });

    newX.addEventListener("click", () => {
        const confirmation = confirm("Seguro desea eliminar la caja?");
        if (confirmation) {
            const index = datoscaja.indexOf(boxObject);
            if (index !== -1) {
                datoscaja.splice(index, 1);
            }
            newBox.remove();
        }
    });

    newItemButton.addEventListener("click", () => {
        itemInput();
    });
});
