


function showAllTodo() {
  $(document).ready(function () {
    var outputContainer = document.querySelector(".outputData");

    function parsedData(data) {
      outputContainer.innerHTML = "";

      data.forEach((element) => {
        var newOutput = document.createElement("div");
        newOutput.className = "output";
        newOutput.setAttribute("data-id", element.id);

        if (element.completed) {
          newOutput.classList.add("completed");
        }

        var titleParagraph = document.createElement("p");
        titleParagraph.id = "title";
        titleParagraph.innerHTML = element.title;

        var descParagraph = document.createElement("p");
        descParagraph.id = "desc";
        descParagraph.innerHTML = element.description;

        // Mark as Done button
        var doneBtn = document.createElement("button");
        doneBtn.className = "doneBtn";
        doneBtn.innerHTML = element.completed ? "✔ Done" : "Mark as Done";
        doneBtn.style.backgroundColor = element.completed ? "#90EE90" : "white";
        doneBtn.style.marginRight = "10px";
        doneBtn.style.borderRadius = "6px";
        doneBtn.style.border = "none";
        doneBtn.style.padding = "5px 15px";
        doneBtn.style.cursor = "pointer";
        doneBtn.disabled = element.completed;

        doneBtn.onclick = function () {
          markAsDone(element.id);
        };

        // Delete button
        var deleteBtn = document.createElement("button");
        deleteBtn.id = "deleteBtn";
        deleteBtn.innerHTML = "Delete";
        deleteBtn.setAttribute("onclick", `deleteTodo(${element.id})`);

        // Append to output card
        newOutput.appendChild(titleParagraph);
        newOutput.appendChild(descParagraph);
        newOutput.appendChild(doneBtn);
        newOutput.appendChild(deleteBtn);

        outputContainer.appendChild(newOutput);
      });
    }

    fetch("http://localhost:3000/todos", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then(parsedData);
  });
}

function addToDo() {
  $(document).ready(function () {
    var title = document.getElementById("title-field").value;
    var desc = document.getElementById("desc-field").value;
    var titleInput = document.getElementById("title-field");
    var descInput = document.getElementById("desc-field");

    if (title === "" || desc === "") {
      window.alert("Record can't be empty");
    } else {
      function parsedData(data) {
        window.alert("Record Inserted Successfully....");
        titleInput.value = "";
        descInput.value = "";
        location.reload(true);
      }

      fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          completed: false,
          description: desc,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then(parsedData);
    }
  });
}

function deleteTodo(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  }).then(() => {
    alert("Record Deleted Successfully....");
    location.reload(true);
  });
}

function markAsDone(id) {
  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  })
    .then((resp) => {
      if (!resp.ok) throw new Error("Failed to mark as done");
      return resp.json();
    })
    .then((updatedItem) => {
      const card = document.querySelector(`[data-id='${id}']`);
      if (card) {
        card.classList.add("completed");
        const doneBtn = card.querySelector(".doneBtn");
        doneBtn.textContent = "✔ Done";
        doneBtn.style.backgroundColor = "#90EE90";
        doneBtn.disabled = true;
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Something went wrong while marking done.");
    });
}

