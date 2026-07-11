const taskList = document.getElementById("task-list");

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const contentInput = document.getElementById("task-content");
const errorMessage = document.getElementById("error-message");

// Function to display error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

// Function to clear error message
const clearError = () => {
  errorMessage.classList.add("hidden");
};

// Function to fetch data from the backend
const fetchData = async () => {
  try {
    const response = await fetch("/api/notes");
    const data = await response.json();
    taskList.innerHTML = "";
    if (data.length === 0) {
      const emptyListMessage = document.createElement("li");
      emptyListMessage.textContent = "No notes yet. Add one above!";
      taskList.appendChild(emptyListMessage);
      return;
    }
    data.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("task-item");
      li.textContent = item.title + " - " + item.content;

      // Create a delete button for each item
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/notes/${item.id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            clearError();
            fetchData();
          } else {
            showError("Couldn't delete note. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting data:", error);
          showError("Couldn't delete note. Please try again.");
        }
      });

      // Create an edit button for each item
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", async () => {
        const newTitle = prompt("Enter new title:", item.title);
        const newContent = prompt("Enter new content:", item.content);

        if (newTitle === null || newContent === null) {
          return; // User cancelled the edit action
        }

        const trimmedTitle = newTitle.trim();
        const trimmedContent = newContent.trim();

        if (!trimmedTitle || !trimmedContent) {
          showError(
            "Both title and content are required. Note hasn't been edited.",
          );
          return;
        }

        try {
          const response = await fetch(`/api/notes/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: trimmedTitle,
              content: trimmedContent,
            }),
          });
          if (response.ok) {
            clearError();
            fetchData();
          } else {
            showError("Couldn't update note. Please try again.");
          }
        } catch (error) {
          console.error("Error updating data:", error);
          showError("Couldn't update note. Please try again.");
        }
      });

      li.append(editBtn, deleteBtn);

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    showError("Couldn't fetch notes. Please try again.");
  }
};

// Handle form submission to add new data
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newData = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
  };

  if (!newData.title || !newData.content) {
    showError("Both title and content are required.");
    return;
  }

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      clearError();
      titleInput.value = ""; // Clear input fields
      contentInput.value = "";
      fetchData(); // Refresh the list
    } else {
      showError("Couldn't add note. Please try again.");
    }
  } catch (error) {
    console.error("Error adding data:", error);
    showError("Couldn't add note. Please try again.");
  }
});

// Fetch data on page load
fetchData();
