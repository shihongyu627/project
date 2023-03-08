import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// const canvas2PDF = (canvas: any) => {
//   const contentWidth = canvas.width;
//   const contentHeight = canvas.height;
//   const imgHeight = contentHeight;
//   const imgWidth = contentWidth;
//   const pdf = new jsPDF('l', 'pt');
//   pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
//   pdf.save('导出.pdf');
// };

export const downloadPDF = (page: any) => {
  html2canvas(page).then(function (canvas) {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const imgHeight = contentHeight;
    const imgWidth = contentWidth;
    const pdf = new jsPDF('l', 'pt');
    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save('导出.pdf');
  });
};
