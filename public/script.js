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
      li.textContent = item.id + ": " + item.title + " - " + item.content;
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
