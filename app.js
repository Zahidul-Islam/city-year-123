const express = require('express');
const docusign = require('docusign-esign');
const apiClient = new docusign.ApiClient();
const fs = require("fs");
const xmlParser = require('xml2js');
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const bodyParser = require('body-parser');

const integratorKey = process.env.SALES_FORCE_INTEGRATION_KEY;
const clientSecret = process.env.SALES_FORCE_CUSTOMER_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const basePath = process.env.DOCUSIGN_BASE_URL;

const responseType = apiClient.OAuth.ResponseType.CODE; 
const scopes = [apiClient.OAuth.Scope.EXTENDED];
const randomState = "*^.$DGj*)+}Jk"; 

apiClient.setBasePath(basePath);

app.post("/webhook",bodyParser.text({ limit: '50mb', type: '*/xml' }), (req, res) => {
    xmlParser.parseString(req.body, function(err, xml) {
		if (err || !xml) {
			throw new Error("Cannot parse Connect XML results: " + err);
        }
        const envelopeStatus = xml.DocuSignEnvelopeInformation.EnvelopeStatus[0].Status;
        const documentPDFs = xml.DocuSignEnvelopeInformation.DocumentPDFs[0].DocumentPDF[0].PDFBytes[0];
        fs.writeFile('docusign.pdf', documentPDFs, {encoding: 'base64'}, function(err) {
            console.log('File created');
        });
        console.log("envelopeStatus", envelopeStatus);
        
    });
	res.send("Received!");

});

app.listen(port, host, function (err) {
  if (err)
    throw err;

  console.log('Your server is running on http://' + host + ':' + port + '.');
});