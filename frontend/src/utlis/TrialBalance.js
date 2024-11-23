
import logo from "../images/InventoryLogoBlack.png";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { calculateBalance, calculateFinalBalance } from "./functions";
import { getTrialBalance } from "../api/trialBalanceApi";

let totalReceipt = 0, totalPayment = 0;


const generatePdf = (trialBalanceDetails, trialBalanceName, downloadDate, settings) => {

   

    const doc = new jsPDF();
    let width = doc.internal.pageSize.width - 10;
    let height = 15;
    const logoWidth = 50;
    const logoHeight = 20;
    const paymentDetailsWithBalance = calculateBalance(trialBalanceDetails);
    const finalBalance = calculateFinalBalance(paymentDetailsWithBalance);

    doc.setFontSize(20);
    doc.setFont("halvetica", "bold");
    doc.text(`${trialBalanceName} Trial Balance`, 10, height);
    doc.addImage(logo, "JPEG", width - logoWidth, 5, logoWidth, logoHeight);
    doc.setFont("times", "bold");
    height += 17;


    doc.setFontSize(10);
    doc.setFont("halvetica", "bold");
    doc.text(`As on Date: ${downloadDate}`, 10, height);
    height += 5;



    doc.setFontSize(8);

    const tableOptions = {
        startY: height,
        margin: { left: 5, right: 5, bottom: 25 },
        theme: "grid",
        headerStyles: { fillColor: [35, 210, 253] },
        // bodyStyles: { lineColor: [0, 0, 0] },
        styles: {
            fontSize: 8,
            valign: "middle",
        },
        columnStyles: {
            // Define the custom style for the "Description" column
            1: { cellWidth: 70 }, // Assuming "Description" is the third column (index 2)
        },
        head: [
            [
                { content: "Name", styles: { fillColor: [35, 210, 253] } },
                { content: "Balance", styles: { fillColor: [35, 210, 253] } },
                { content: "DR/CR", styles: { fillColor: [35, 210, 253] } },
            ]
        ],
        body: trialBalanceDetails.map((product, index) => [
            product.firstName,
            Math.abs(product.balance),
            product.balance > 0 ? "DR" : "CR",
        ]),


    }
    doc.autoTable(tableOptions);
    height = doc.autoTable.previous.finalY + 10;
    // doc.text(`Total Receipt: ${totalReceipt}`, width - doc.getTextWidth(`Total Receipt: ${totalReceipt}`), height);
    // doc.text(`Total Payment: ${totalPayment}`, width - doc.getTextWidth(`Total Payment: ${totalPayment}`), height + 5);


    addFooter(doc, settings); // Add the footer

    return doc;
}
const addFooter = (doc, settings) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const footerY = pageHeight - 20; // Adjust the Y position as needed

    // Add the final text above the footer line
    const finalText =
        "This document is computer generated, does not need any signature.";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const finalTextWidth = doc.getTextWidth(finalText);
    const finalTextX = (pageWidth - finalTextWidth) / 2;
    const finalTextY = footerY - 2; // Adjust the Y-coordinate as needed
    doc.text(finalText, finalTextX, finalTextY);

    // Styling
    doc.setLineWidth(0.5);
    doc.setDrawColor(34, 209, 252); // Use your brand color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    // Draw a line at the bottom of the page
    doc.line(15, footerY, pageWidth - 15, footerY);

    // doc.text(`Branch Address: ${"branch address line 1"}`, 15, footerY + 5);
    // doc.text(`Branch Address: ${"branch address line 2"}`, 15, footerY + 10);
    // doc.text(`Branch Address: ${"branch address line 3"}`, 15, footerY + 15);
    doc.text(`Branch Location: ${settings?.branchLocation}`, 15, footerY + 5);
    doc.text(
        `Branch Contact: ${settings?.branchPhoneNumber}`,
        pageWidth -
        doc.getTextWidth(`Branch Contact: ${settings?.branchPhoneNumber}`) -
        15,
        footerY + 10
    );
};






export const trialBalancePdf = (trialBalanceDetails, trialBalanceName, downloadDate, settings) => {


    const fetchTrialBalance = async () => {
        try {
           
            const trialBalanceDetails = await getTrialBalance(trialBalanceName);
          
            if (trialBalanceDetails) {
                const doc = generatePdf(trialBalanceDetails, trialBalanceName, downloadDate, settings);
                const ledgerName = `${trialBalanceName} Trial Balance ${downloadDate}`;
                doc.save(`${ledgerName}`);
            }
            // Check if categoriesResponse is not null or undefined and categories array is not null or undefined

        } catch (error) {
            console.error("Error fetching categories data:", error);
        }
    };

    fetchTrialBalance();


}