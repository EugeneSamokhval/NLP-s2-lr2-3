// Wait for the DOM to fully load
const lr2PdfReport = document.getElementById("lr2-pdf");
const lr3PdfReport = document.getElementById("lr3-pdf");
console.log(lr2PdfReport);

lr2PdfReport.addEventListener("click", () => {
  printToPDFLr2("lr2-result-list");
});

lr3PdfReport.addEventListener("click", () => {
  printToPDFLr3("lr3-result-list");
});

async function printToPDFLr3(elementId) {
  console.log("Started for " + elementId);
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance with Unicode support
  const doc = new jsPDF();

  // Load a font that supports Unicode characters
  doc.addFont("static/static/DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.setFont("DejaVuSans");

  // Get the content of the <ul> element
  const list = document.getElementById(elementId);
  const items = list.getElementsByTagName("li");

  // Convert the <ul> content to a string
  let content = "Laboratory work 3\n Input file processing report:\n";
  for (let i = 0; i < items.length; i++) {
    const links = items[i].getElementsByTagName("a");
    content += links[0].textContent + ": ";
    const response = await fetch(links[0].href);
    const data = await response.json();
    console.log(data.reference);
    data.reference = data.reference.replaceAll(".", ".\n");
    content += data.reference + "\n";
  }
  // Add the content to the PDF
  doc.text(content, 10, 10, { maxWidth: 190 });

  // Save the PDF
  doc.save(elementId + ".pdf");
  console.log("Ended for " + elementId);
}

async function printToPDFLr2(elementId) {
  console.log("Started for " + elementId);
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance with Unicode support
  const doc = new jsPDF();

  // Load a font that supports Unicode characters
  doc.addFont("static/static/DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.setFont("DejaVuSans");

  // Get the content of the <ul> element
  const list = document.getElementById(elementId);
  const items = list.getElementsByTagName("li");

  // Convert the <ul> content to a string
  let content = "Laboratory work 2\n Input file processing report:\n";
  for (let i = 0; i < items.length; i++) {
    content += `${i + 1}. ${items[i].textContent}\n`;
  }
  content = content.replaceAll(";", "\n");
  content = content.replaceAll("  ", "\n");

  // Add the content to the PDF
  doc.text(content, 10, 10, { maxWidth: 190 });

  // Save the PDF
  doc.save(elementId + ".pdf");
  console.log("Ended for " + elementId);
}
