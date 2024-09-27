const fetchTodos = (tbody) => {
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }
      return response.json();
    })
    .then((data) => {
      tbody.innerHTML = "";
      data.todos.forEach((todo) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.classList.add("border", "px-4", "py-2");
        td1.textContent = todo.id;

        const td2 = document.createElement("td");
        td2.classList.add("border", "px-4", "py-2");
        td2.textContent = todo.title;

        const td3 = document.createElement("td");
        td3.classList.add("border", "px-4", "py-2");
        td3.textContent = todo.completed ? "Sí" : "No";

        const td4 = document.createElement("td");
        td4.classList.add("border", "px-4", "py-2");
        td4.textContent = todo.owner;

        const td5 = document.createElement("td");
        td5.classList.add("border", "px-4", "py-2");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add(
          "bg-red-500",
          "text-white",
          "p-2",
          "rounded",
          "hover:bg-red-600",
          "mr-2"
        );
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          fetch(`http://localhost:4000/todos/${todo.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((data) => {
                  throw new Error(data.message);
                });
              }
              return response.json();
            })
            .then((data) => {
              alert(data.message);
              fetchTodos(tbody);
            })
            .catch((error) => {
              alert("Error al eliminar tarea: " + error.message);
            });
        });

        const updateBtn = document.createElement("button");
        updateBtn.classList.add(
          "bg-blue-200",
          "text-black",
          "p-2",
          "rounded",
          "hover:bg-blue-300",
          "mr-2"
        );
        updateBtn.textContent = "Actualizar";
        updateBtn.addEventListener("click", () => {
          showModal(todo, tbody);
        });

        td5.appendChild(deleteBtn);
        td5.appendChild(updateBtn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      alert("Error al obtener las tareas: " + error.message);
    });
};

const showModal = (todo, tbody) => {
  const modal = document.createElement("div");
  modal.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "bg-gray-800",
    "bg-opacity-50",
    "flex",
    "items-center",
    "justify-center"
  );

  const modalContent = document.createElement("div");
  modalContent.classList.add("bg-white", "p-8", "w-1/3");

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = todo.id ? "Edit Todo" : "Create Todo";
  modalContent.appendChild(modalTitle);

  const inputTitle = document.createElement("input");
  inputTitle.value = todo.title;
  inputTitle.classList.add(
    "border",
    "border-gray-400",
    "p-2",
    "mb-4",
    "w-full"
  );
  modalContent.appendChild(inputTitle);

  const completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.checked = todo.completed;
  modalContent.appendChild(completedCheckbox);
  modalContent.appendChild(document.createTextNode("Completed"));

  const confirmButton = document.createElement("button");
  confirmButton.textContent = todo.id ? "Actualizar" : "Crear";
  confirmButton.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mr-2"
  );
  confirmButton.addEventListener("click", () => {
    if (todo.id) {
      const updatedTodo = {
        title: inputTitle.value,
        completed: completedCheckbox.checked,
      };

      fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message || "Tarea actualizada correctamente");
          fetchTodos(tbody);
          modal.remove();
        })
        .catch((error) => {
          alert("Error al actualizar tarea: " + error.message);
        });
    } else {
      const newTodo = {
        title: inputTitle.value,
        completed: completedCheckbox.checked,
      };

      fetch("http://localhost:4000/todos", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message || "Tarea creada correctamente");
          fetchTodos(tbody);
          modal.remove();
        })
        .catch((error) => {
          alert("Error al crear tarea: " + error.message);
        });
    }
  });
  modalContent.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancelar";
  cancelButton.classList.add(
    "bg-red-200",
    "text-black",
    "p-2",
    "rounded",
    "hover:bg-red-300"
  );
  cancelButton.addEventListener("click", () => {
    modal.remove();
  });
  modalContent.appendChild(cancelButton);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  const table = document.createElement("table");
  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  const th1 = document.createElement("th");
  th1.classList.add("border", "px-4", "py-2");
  th1.textContent = "ID";

  const th2 = document.createElement("th");
  th2.classList.add("border", "px-4", "py-2");
  th2.textContent = "Title";

  const th3 = document.createElement("th");
  th3.classList.add("border", "px-4", "py-2");
  th3.textContent = "Completed";

  const th4 = document.createElement("th");
  th4.classList.add("border", "px-4", "py-2");
  th4.textContent = "Owner Id";

  const th5 = document.createElement("th");
  th5.classList.add("border", "px-4", "py-2");
  th5.textContent = "Actions";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);

  thead.appendChild(tr);

  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  container.appendChild(btnHome);
  fetchTodos(tbody);

  const addButton = document.createElement("button");
  addButton.classList.add(
    "bg-green-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-green-600",
    "mb-4"
  );
  addButton.textContent = "Agregar Tarea";
  addButton.addEventListener("click", () => {
    showModal({ title: "", completed: false }, tbody);
  });
  container.appendChild(addButton);
  container.appendChild(title);
  container.appendChild(table);

  return container;
};
