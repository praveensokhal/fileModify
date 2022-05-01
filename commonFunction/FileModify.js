const fs = require('fs');
const http = require('http');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const download = require('download');
function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false
  }

  return pageData.getTextContent(render_options)
  .then(function(textContent) {
      let lastY, text = '';
      for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY){
              text += item.str;
          }  
          else{
              text += '\n' + item.str;
          }    
          lastY = item.transform[5];
      }
      return text;
  });
}

let options = {
  pagerender: render_page
}

module.exports =
{
  
    file:async(req,res)=>{
      const buffer = fs.readFileSync(req.body.file);
      try {
          const data = await pdfParse(buffer,options);
  
          // The content
          let text = "Date:  ddd";
          // console.log('Content: ', (data.text).toString());
          if(data.text.includes('Date:')){
            let result = data.text.indexOf("Whomsoever");
            data.text.substring(0, 26);
            let oldDate = data.text.substring(7, 26);
            let new_Date = data.text.replace(oldDate, `${req.body.date}\n\n`);
            const doc = new PDFDocument();
            const filename = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
            // Saving the pdf file in root directory.
            doc.pipe(fs.createWriteStream(`./uploads/${filename}.pdf`));
            doc
            .fontSize(15)
            .text(`${new_Date}`, 100, 100);
            doc.end();
           
            return res.send({res:`${process.cwd()}/uploads/${filename}.pdf`})
           }
      }catch(err){
          throw new Error(err);
      }
           
     
      },
}
          
        