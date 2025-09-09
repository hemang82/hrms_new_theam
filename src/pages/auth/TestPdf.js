// import { useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// import * as XLSX from "xlsx";
// import FileSaver from "file-saver";
// // import "pdfjs-dist/build/pdf.worker.entry";

// export const TestPdf = () => {

//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const extractTextFromPdf = async (pdfData) => {
//         const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
//         let extractedText = "";

//         for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i);
//             const textContent = await page.getTextContent();
//             const pageText = textContent.items.map((item) => item.str).join(" ");
//             extractedText += pageText + "\n";
//         }
//         return extractedText;
//     };
//     const handleUpload = async () => {
//         if (!file) return alert("Please upload a PDF file!");

//         setLoading(true);
//         const reader = new FileReader();

//         reader.onload = async (event) => {
//             try {
//                 const pdfData = new Uint8Array(event.target.result);
//                 const extractedData = await extractTextFromPdf(pdfData);

//                 // Convert extracted text to an Excel file
//                 const worksheet = XLSX.utils.aoa_to_sheet(extractedData);
//                 const workbook = XLSX.utils.book_new();
//                 XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//                 // Create Excel file
//                 const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//                 const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

//                 FileSaver.saveAs(excelBlob, "converted.xlsx");
//             } catch (error) {
//                 console.error("Error converting PDF to Excel:", error);
//                 alert("Failed to convert PDF.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         reader.readAsArrayBuffer(file);
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-semibold text-gray-700 text-center">Convert PDF to Word</h2>

//                 <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-600">Upload PDF:</label>
//                     <div className="relative border-2 border-dashed border-gray-300 p-4 rounded-lg mt-2 cursor-pointer">
//                         <input
//                             type="file"
//                             accept="application/pdf"
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             onChange={(e) => setFile(e.target.files[0])}
//                         />
//                         <p className="text-gray-500 text-center">{file ? file.name : "Click to select a PDF file"}</p>
//                     </div>
//                 </div>

//                 <button
//                     onClick={handleUpload}
//                     className={`mt-4 w-full px-4 py-2 text-white rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//                         }`}
//                     disabled={loading}
//                 >
//                     {loading ? "Converting..." : "Convert"}
//                 </button>
//             </div>
//         </div>
//     );
// };
