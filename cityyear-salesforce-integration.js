const jsforce = require("jsforce");
require("dotenv").config();
const username = process.env.USER_EMAIL;
const password = process.env.SALES_FORCE_PASSWORD;
const securityToken = process.env.SALES_FORCE_SECURITY_TOKEN;
const consumerKey = process.env.SALES_FORCE_CONSUMER_KEY;
const consumerSecret = process.env.SALES_FORCE_CONSUMER_SECRET;

const conn = new jsforce.Connection({
    loginUrl: process.env.SALES_FORCE_SANDBOX_URL,
    clientId: consumerKey,
    clientSecret: consumerSecret
});

const createStudent = (student) => {

};

const updateStatus = (accountId, status) => {
    conn.login(username, password + securityToken, (err, usreInfo) => {
        if (err) throw err;
        conn.sobject("Student__c").update({
            Id: accountId,
            Status__c: status
        }, (err, result) => {
            if (err) throw err;
            console.log("recordId: ", result.id);
        });

    });
}

const findAllStudents = () => {
    return new Promise((resolve, reject) => {
        conn.login(username, password + securityToken, (err, usreInfo) => {
            if (err) throw err;
            conn.sobject("Student__c")
                .find()
                .execute((err, result) => {
                    if (err) {
                        reject(err);
                    };
                    // console.log("records: ", result);
                    resolve(result);
                });
        });
    });
};


(async () => {
    const students = await findAllStudents();
    students.map(student => {
        console.log(student);
        return {
            Email: student.Email__c,
            ParentName: student.ParentName__c,
            Phone: student.Phone__c,
            FirstName: student.FirstName__c,
            LastName: student.LastName__c
        }
    })
    .map(x => console.log(x));
})();
// conn.login(username, password + securityToken, (err, usreInfo) => {
//     if (err) throw err;
//     // conn.sobject("Account").create({
//     //     Name: "My Account #1"
//     // }, (err, result) => {
//     //     console.log("recordId: ", result.id);
//     // });

//     // conn.sobject("Lead").create({
//     //     FirstName: "John",
//     //     LastName: "Doe",
//     //     Company: "Me, Inc",
//     //     Email: "john.doe@test.com",
//     //     Phone: "4513445987",
//     //     Description: "Insurance lead"
//     // }, (err, result) => {
//     //     if (err) throw err;
//     //     console.log("recordId: ", result);
//     // });

//     // conn.sobject("Account").update({
//     //     Id: "001f400000RfgJrAAJ",
//     //     Phone: "4514887567",
//     //     Website: "https://voicefirstdesign.com"
//     // }, (err, result) => {
//     //     console.log("recordId: ", result.id);
//     // });
//     conn.sobject("Student__c").update({
//         Id: "a0Cf4000002xeq0EAA",
//         Status__c: "Sent"
//     }, (err, result) => {
//         console.log("recordId: ", result.id);
//     });

//     // conn.sobject("Student__c")
//     //     .find()
//     //     .execute((err, result) => {
//     //         if (err) throw err;
//     //         console.log("records: ", result);
//     //     });

//     // let records = [];
//     // conn.query("SELECT Id, Name, FROM Account", (err, results) => {
//     //     if (err) throw err;
//     //     console.log("total : " + result.totalSize);
//     //     console.log("fetched : " + result.records.length);
//     //     console.log("done ? : " + result.done);
//     //     if (!result.done) {
//     //         // you can use the locator to fetch next records set.
//     //         // Connection#queryMore()
//     //         console.log("next records URL : " + result.nextRecordsUrl);
//     //     }
//     // });
// });

