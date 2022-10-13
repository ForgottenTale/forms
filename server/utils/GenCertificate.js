const fs = require("fs");
const PDFDocument = require("pdfkit");

function genCertificate(name, filename, certificate) {
  console.log(name);

  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });
  doc.pipe(fs.createWriteStream(`./certificates/${filename}.pdf`));
  doc.image(`./public/${certificate.link}`, 0, 0, { width: certificate.width });
  doc.font(`./public/${certificate.font}`);
  doc
    .fontSize(certificate.fontSize).fillColor('#ff1259')
    .text(name,certificate.w1,certificate.w2, {
      align: "right",
      width: certificate.width ,
    });
  doc.end();
}
module.exports = genCertificate;
