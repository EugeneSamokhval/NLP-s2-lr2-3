const fileList = document.querySelector(".file-list");
const fileBrowseButton = document.querySelector(".file-browse-button");
const fileBrowseInput = document.querySelector(".file-browse-input");
const fileUploadBox = document.querySelector(".file-upload-box");
const fileCompletedStatus = document.querySelector(".file-completed-status");
const lr2_results_list = document.getElementById("lr2-result-list");
const lr3_result_list = document.getElementById("lr3-result-list");

let totalFiles = 0;
let completedFiles = 0;

async function handleLr2Results(file) {
  console.log(file.name);
  try {
    const response = await fetch("/access_file_content?file_name=" + file.name);
    const data = await response.json();
    console.log(data);
    const fw_responce = await fetch("/fw_method?current_file=" + data.raw_text);
    const fw_data = await fw_responce.json();
    const abc_responce = await fetch(
      "/abc_method?current_file=" + data.raw_text
    );
    const abc_data = await abc_responce.json();
    const neural_responce = await fetch(
      "/neural_method?current_file=" + data.raw_text
    );
    const neural_data = await neural_responce.json();
    const newItem = document.createElement("li");
    newItem.textContent =
      "File name:" +
      file.name +
      "  Alphabet method: " +
      abc_data.language +
      ";Stop words methods: " +
      fw_data.language +
      ";Neural method: " +
      neural_data.language;
    const linkItem = document.createElement("a");
    linkItem.href =
      "http://" +
      window.location.host +
      "/access_file_content?file_name=" +
      file.name;
    linkItem.target = "_blank";
    linkItem.textContent = "  " + file.name;
    newItem.appendChild(linkItem);
    newItem.classList.add("lr2-result-list-items");
    lr2_results_list.appendChild(newItem);
  } catch (error) {
    console.error("Error fetching file content:", error);
    return null;
  }
}

function openTreeDiagram(data) {
  function buildTree(data) {
    const seenNames = new Set();

    // Recursive function to add nodes based on depth
    function addNode(parent, depth) {
      // Filter nodes at the current depth that are unique
      const nodesAtDepth = data.filter(
        ([name, d]) => d === depth && !seenNames.has(name)
      );
      const parentsNum = data.filter(
        ([name, d]) => d === depth - 1 && !seenNames.has(name)
      );
      let perParent = Math.ceil(nodesAtDepth.length / parentsNum.length);
      for (const [name, d] of nodesAtDepth) {
        if (!seenNames.has(name) && parent.children.length < perParent) {
          const node = { name, children: [] };
          parent.children.push(node);

          // Mark this name as added
          seenNames.add(name);

          // Recursively add children for the current node
          addNode(node, depth + 1);
        }
      }
    }

    const root = { name: "root", children: [] };

    // Start the recursive tree construction
    addNode(root, 1);

    return root;
  }

  // Create the HTML and JavaScript code as a string
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tree Diagram</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
      </head>
      <body>
        <script>
          const root = d3.hierarchy(${JSON.stringify(buildTree(data))});
  
          const width = 3000;
          const height = 900;
  
          const treeLayout = d3.tree().size([width, height - 100]);;
          treeLayout(root);
  
          const svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
  
          const g = svg.append("g")
            .attr("transform", "translate(50, 50)");
  
          // Links
          g.selectAll(".link")
            .data(root.links())
            .enter().append("line")
            .attr("class", "link")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", "#555");
  
          // Nodes
          g.selectAll(".node")
            .data(root.descendants())
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 5)
            .attr("fill", "#69b3a2");
  
          // Labels
          g.selectAll(".label")
            .data(root.descendants())
            .enter().append("text")
            .attr("class", "label")
            .attr("x", d => d.x)
            .attr("y", d => d.y - 10)
            .attr("text-anchor", "middle")
            .text(d => d.data.name);
        </script>
      </body>
      </html>
    `;

  // Open a new window
  const newWindow = window.open();

  // Write the HTML content into the new window
  newWindow.document.open();
  newWindow.document.write(htmlContent);
  newWindow.document.close();
}

async function handleLr3Results(file) {
  console.log(file.name);
  try {
    const response = await fetch("/access_file_content?file_name=" + file.name);
    const data = await response.json();
    const abc_responce = await fetch(
      "/abc_method?current_file=" + data.raw_text
    );
    const language = await abc_responce.json();

    const keyWordsResult = await fetch(
      "/keywords_ref?file_name=" +
        file.name +
        "&language=" +
        language.language.toLowerCase() +
        "&text=" +
        data.raw_text
    );
    const keyWordsData = await keyWordsResult.json();
    const keywordsLink = document.createElement("a");
    console.log(keyWordsData);
    keywordsLink.addEventListener("click", () => {
      openTreeDiagram(keyWordsData.keywords);
    });

    const simpleRefLink = document.createElement("a");
    simpleRefLink.textContent = "Classical summary ";
    keywordsLink.textContent = "Key word summary ";
    simpleRefLink.href =
      "http://" +
      window.location.host +
      "/simple_ref?file_name=" +
      file.name +
      "&language=" +
      language.language.toLowerCase() +
      "&text=" +
      data.raw_text;
    simpleRefLink.target = "_blank";
    const newItem = document.createElement("li");
    console.log(simpleRefLink);
    console.log(keywordsLink);
    newItem.textContent = "File name:" + file.name + " ";
    newItem.appendChild(simpleRefLink);
    newItem.appendChild(keywordsLink);
    newItem.classList.add("lr3-result-list-items");
    lr3_result_list.appendChild(newItem);
  } catch {
    console.error("Error fetching file content:", error);
    return null;
  }
}
// Function to create HTML for each file item
const createFileItemHTML = (file, uniqueIdentifier) => {
  // Extracting file name, size, and extension
  const { name, size } = file;
  const extension = name.split(".").pop();
  const formattedFileSize =
    size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;

  // Generating HTML for file item
  return `<li class="file-item" id="file-item-${uniqueIdentifier}">
                <div class="file-extension">${extension}</div>
                <div class="file-content-wrapper">
                <div class="file-content">
                    <div class="file-details">
                    <h5 class="file-name">${name}</h5>
                    <div class="file-info">
                        <small class="file-size">0 MB / ${formattedFileSize}</small>
                        <small class="file-divider">•</small>
                        <small class="file-status">Uploading...</small>
                    </div>
                    </div>
                    <button class="cancel-button">
                    <i class="bx bx-x"></i>
                    </button>
                </div>
                <div class="file-progress-bar">
                    <div class="file-progress"></div>
                </div>
                </div>
            </li>`;
};

// Function to handle file uploading
const handleFileUploading = (file, uniqueIdentifier) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append("file", file);

  // Adding progress event listener to the ajax request
  xhr.upload.addEventListener("progress", (e) => {
    // Updating progress bar and file size element
    const fileProgress = document.querySelector(
      `#file-item-${uniqueIdentifier} .file-progress`
    );
    const fileSize = document.querySelector(
      `#file-item-${uniqueIdentifier} .file-size`
    );

    // Formatting the uploading or total file size into KB or MB accordingly
    const formattedFileSize =
      file.size >= 1024 * 1024
        ? `${(e.loaded / (1024 * 1024)).toFixed(2)} MB / ${(
            e.total /
            (1024 * 1024)
          ).toFixed(2)} MB`
        : `${(e.loaded / 1024).toFixed(2)} KB / ${(e.total / 1024).toFixed(
            2
          )} KB`;

    const progress = Math.round((e.loaded / e.total) * 100);
    fileProgress.style.width = `${progress}%`;
    fileSize.innerText = formattedFileSize;
  });

  xhr.open("POST", "http://localhost:5500/upload_file", true);
  xhr.send(formData);

  return xhr;
};

// Function to handle selected files
const handleSelectedFiles = ([...files]) => {
  if (files.length === 0) return; // Check if no files are selected
  totalFiles += files.length;

  files.forEach((file, index) => {
    const uniqueIdentifier = index;
    const fileItemHTML = createFileItemHTML(file, uniqueIdentifier);
    // Inserting each file item into file list
    fileList.insertAdjacentHTML("afterbegin", fileItemHTML);
    const currentFileItem = document.querySelector(
      `#file-item-${uniqueIdentifier}`
    );
    const cancelFileUploadButton =
      currentFileItem.querySelector(".cancel-button");

    const xhr = handleFileUploading(file, uniqueIdentifier);
    handleLr2Results(file);
    handleLr3Results(file);
    // Update file status text and change color of it
    const updateFileStatus = (status, color) => {
      currentFileItem.querySelector(".file-status").innerText = status;
      currentFileItem.querySelector(".file-status").style.color = color;
    };

    xhr.addEventListener("readystatechange", () => {
      // Handling completion of file upload
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        completedFiles++;
        cancelFileUploadButton.remove();
        updateFileStatus("Completed", "#00B125");
        fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
      }
    });

    // Handling cancellation of file upload
    cancelFileUploadButton.addEventListener("click", () => {
      xhr.abort(); // Cancel file upload
      updateFileStatus("Cancelled", "#E3413F");
      cancelFileUploadButton.remove();
    });

    // Show Alert if there is any error occured during file uploading
    xhr.addEventListener("error", () => {
      updateFileStatus("Error", "#E3413F");
      alert("An error occurred during the file upload!");
    });
  });

  fileCompletedStatus.innerText = `${completedFiles} / ${totalFiles} files completed`;
};

// Function to handle file drop event
fileUploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  handleSelectedFiles(e.dataTransfer.files);
  fileUploadBox.classList.remove("active");
  fileUploadBox.querySelector(".file-instruction").innerText =
    "Drag files here or";
});

// Function to handle file dragover event
fileUploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileUploadBox.classList.add("active");
  fileUploadBox.querySelector(".file-instruction").innerText =
    "Release to upload or";
});

// Function to handle file dragleave event
fileUploadBox.addEventListener("dragleave", (e) => {
  e.preventDefault();
  fileUploadBox.classList.remove("active");
  fileUploadBox.querySelector(".file-instruction").innerText =
    "Drag files here or";
});

fileBrowseInput.addEventListener("change", (e) =>
  handleSelectedFiles(e.target.files)
);
fileBrowseButton.addEventListener("click", () => fileBrowseInput.click());
