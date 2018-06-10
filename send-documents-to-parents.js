const DocuSign = require('docusign-api');
require("dotenv").config();

const config = {
    email: process.env.DOCUSIGN_EMAIL,
    password: process.env.DOCUSIGN_PASSWORD,
    integratorKey: process.env.DOCUSIGN_INTEGRATION_KEY,
    accountId: process.env.DOCUSIGN_ACCOUNT_ID
};

const buildEnvelopRequest = (student) => {
    return {
        emailSubject: process.env.DOCUSIGN_EMAIL_SUBJECT,
        templateId: process.env.DOCUSIGN_TEMPLATE_ID,
        templateRoles: [
            {
                email: student.Email,
                name: student.ParentName,
                roleName: "Parent",
                tabs: {
                    textTabs: [
                        {
                            tabLabel: "StudentFullName",
                            value: `${student.FirstName} ${student.LastName}`
                        },
                        {
                            tabLabel: "FirstName",
                            value: student.FirstName
                        },
                        {
                            tabLabel: "LastName",
                            value: student.LastName
                        },
                        {
                            tabLabel: "ParentName",
                            value: student.ParentName
                        },
                        {
                            tabLabel: "Email",
                            value: student.Email
                        },
                        {
                            tabLabel: "Phone",
                            value: student.Phone
                        },
                        {
                            tabLabel: "EmPhone",
                            value: student.Phone
                        },
                        {
                            tabLabel: "EmParentName",
                            value: student.ParentName
                        },
                        {
                            tabLabel: "PPParentName",
                            value: student.ParentName
                        }
                    ],
                },
            }
        ],
        status: 'sent'
    };
};

var recipientRequest = {
    returnUrl: process.env.DOCUSIGN_REDIRECT_URL,
    authenticationMethod: 'email',
    email: process.env.DOCUSIGN_EMAIL,
    userName: process.env.USER_NAME,
};

const docuSign = new DocuSign(config);

export const sendDocumentsToParents = (student) => {
docuSign
    .requestSignature(buildEnvelopRequest(student))
    .then(function (envelopeId) {
        return docuSign.getRecipientView(envelopeId, recipientRequest);
    })
    .then(function (response) {
        console.log("==> url ", response.url);
    })
    .catch(err => console.error(err));
}