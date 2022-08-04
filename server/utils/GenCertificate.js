
const fs = require("fs");
const PDFDocument = require("pdfkit");

function genCertificate(name,filename) {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });
  doc.pipe(fs.createWriteStream(`./public/pdf/${filename}.pdf`));
  doc.image("./public/participation.png", 0, 0, { width: 842 });
  doc.font("./public/Autography.otf");
  doc.fontSize(36).text(name, 82, 230, {
    align: "left",
  });
  doc.end();

}
module.exports = genCertificate;
