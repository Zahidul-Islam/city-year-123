const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

export const getStudentId = async (imagePath) => {
  return new Promise((resolve, reject) => {

    client.textDetection("./afterschool_participation_form_ST348_244.png")
      .then(results => {
        const pages = results[0].fullTextAnnotation.pages;
        pages.forEach(page => {
          page.blocks.forEach(block => {
            const blockWords = [];
            block.paragraphs.forEach(paragraph => {
              paragraph.words.forEach(word => blockWords.push(word));
            });

            let blockText = '';
            blockWords.forEach(word => {
              let studentId = '';
              word.symbols.forEach(symbol => {
                studentId = studentId + symbol.text;
              });
              if (studentId.startsWith("ST")) {
                resolve(studentId);
              }
            });
          });
        });
      })
      .catch(err => {
        reject(err);
        console.error('ERROR:', err);
      });
  });
};

(async () => {
  const filePath = "./afterschool_participation_form_ST348_244.png";
  const studentId = await getStudentId(filePath);
  console.log(studentId);
})();