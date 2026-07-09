const taskList = document.getElementById("task-list");

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const contentInput = document.getElementById("task-content");

// Function to fetch data from the backend
const fetchData = async () => {
  try {
    const response = await fetch("/api/notes");
    const data = await response.json();
    taskList.innerHTML = ""; // Clear the list before rendering
    data.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("task-item");
      li.textContent = item.title + " - " + item.content;

      // Create a delete button for each item
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.addEventListener("click", async () => {
        await fetch(`/api/notes/${item.id}`, { method: "DELETE" });
        fetchData();
      });

      // Create an edit button for each item
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-btn");
      editBtn.addEventListener("click", async () => {
        const newTitle = prompt("Enter new title:", item.title);
        const newContent = prompt("Enter new content:", item.content);
        if (newTitle && newContent) {
          await fetch(`/api/notes/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, content: newContent }),
          });
          fetchData();
        }
      });

      li.append(editBtn, deleteBtn);

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Handle form submission to add new data
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newData = { title: titleInput.value, content: contentInput.value };

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      titleInput.value = ""; // Clear input fields
      contentInput.value = "";
      fetchData(); // Refresh the list
    }
  } catch (error) {
    console.error("Error adding data:", error);
  }
});

// Fetch data on page load
fetchData();
