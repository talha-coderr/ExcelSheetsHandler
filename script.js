function uploadFile() {
    const fileInput = document.getElementById("excelFile").files[0];
    if (!fileInput) {
        alert("Please select an Excel file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        
        const sheetNamesList = document.getElementById("sheetNamesList");
        sheetNamesList.innerHTML = ""; // Clear previous sheet names

        workbook.SheetNames.forEach((sheetName) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            
            // Display sheet name
            const listItem = document.createElement("li");
            listItem.textContent = sheetName;
            sheetNamesList.appendChild(listItem);
            
            // Send each sheet as separate data
            sendDataToServer(sheetName, sheetData);
        });
    };
    reader.readAsArrayBuffer(fileInput);
}

function sendDataToServer(sheetName, sheetData) {
    fetch("http://localhost:5050/uploadSheet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sheetName, sheetData })
    })
    .then(response => response.json())
    .then(data => {
        console.log(`${sheetName} uploaded successfully:`, data);
    })
    .catch(error => {
        console.error(`Error uploading ${sheetName}:`, error);
    });
}
