const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const { table } = require('console');


const CLIENT_ID = '22323826731-lb3p2vr84lultphirv72iplbc36oe18o.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04W3NhYAT8W_kCgYIARAAGAQSNwF-L9Irc1RbdN658LlS8_eWPKSpC9-GjgXdw4_QkliOX9o_DdeNULXGahOq2S_O8v3GQNKnCLY';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

var toJsonFile = {
    table: []
 };

 var holdDataFor_toJsonFile_ = {
    table: []
};

 var json = JSON.stringify(toJsonFile);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth: oauth2Client

});

const filePath = path.join(__dirname, 'DR.jpg');

//! first time only!! vv

// toJsonFile.table.push({name: 'test', id: 'testing-also', link : 'Tesing.tesing'});


// var json = JSON.stringify(toJsonFile);




// fs.writeFile('myJsonFile.json', json,
//   {
//     encoding: "utf8",
//     flag: "w",
//     mode: 0o666
//   },
//   (err) => {
//     if (err)
//       console.log(err);
//     else {
//       console.log("File written successfully\n");
//       console.log("The written has the following contents:");
//       console.log(fs.readFileSync("movies.txt", "utf8"));
//     }
// });

//! first time only!! ^^

uploadFile();

async function uploadFile(){
    try{
        const response = await drive.files.create({
            requestBody: {
                name: 'DR_of_hearts.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath),
            }
        });        
        
        // toJsonFile.table[1::]['id']
        holdDataFor_toJsonFile_.table.push({index: 0,name: 'DR_of_hearts.jpg', id: response.data.id, link : 'https://drive.google.com/uc?export=view&id='+response.data.id}); // store data to send it later to toJsonFile var
        // console.log(holdDataFor_toJsonFile_.table[0]['id']);
        generatePublicUrl();
        // MAKE pubic url 
    }
    catch(error){
        console.log(error.message);
    }
}


// delete file
async function deleteFile(){
    try{
        toJsonFile.table.push({id:'1-ydgC4cGM7BZluWVHPjNAPKpTiH3b1Z2'})
        const response = await drive.files.delete({
            fileId: toJsonFile.table[0]['id'],
        });
        console.log(response.data, response.status);
    }
    catch(error){
        console.log(error.message);
    }
}

// deleteFile();

// download file
async function downloadFile(){
    try{
        const response = await drive.files.get({
            fileId: '1Z4Q9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
            alt: 'media'
        }, {responseType: 'stream'});
        response.data
            .on('end', () => {
                console.log('Done');
            })
            .on('error', err => {
                console.log('Error', err);
            })
            .pipe(fs.createWriteStream(path.join(__dirname, 'DR.jpg')));
    }
    catch(error){
        console.log(error.message);
    }
}

// update file
async function updateFile(){
    try{
        const response = await drive.files.update({
            fileId: '1Z4Q9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(filePath)
            }
        });
        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}


// generate public url
async function generatePublicUrl(){
    fs.readFile('myJsonFile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        
            toJsonFile = JSON.parse(data); // now it an object
            toJsonFile.table.push(holdDataFor_toJsonFile_.table[0]); // add some data
            console.log(Object.keys(toJsonFile.table).length-1);
            toJsonFile.table[Object.keys(toJsonFile.table).length-1]['index'] = Object.keys(toJsonFile.table).length-1;
            toJsonFile.table[Object.keys(toJsonFile.table).length-1]['name'] = holdDataFor_toJsonFile_.table[0]['name']; // add name to object from object in uploadFile()
            toJsonFile.table[Object.keys(toJsonFile.table).length-1]['id'] = holdDataFor_toJsonFile_.table[0]['id']; // add id to object from object in uploadFile()
            toJsonFile.table[Object.keys(toJsonFile.table).length-1]['link'] = holdDataFor_toJsonFile_.table[0]['link']; // add link to object from object in uploadFile()
            console.table(toJsonFile.table);
            json = JSON.stringify(toJsonFile); // convert it back to json
        }
    });
    
    try{

        await drive.permissions.create({
            fileId: holdDataFor_toJsonFile_.table[0]['id'],
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        console.log('Public link generated');
        const result = await drive.files.get({
            fileId: holdDataFor_toJsonFile_.table[0]['id'],
            fields: 'webViewLink, webContentLink',
        });
                
        toJsonFile.table[Object.keys(toJsonFile.table).length-1]['id'],
            fs.writeFile('myJsonFile.json', json, 'utf8',
                  (err) => {
                    if (err)
                    console.log(err);
                    else {
                    console.log("File written successfully\n");
                    }
                 } ); // write it back 
        
        console.log(result.data);


        // https://drive.google.com/uc?export=view&id=
        console.log("https://drive.google.com/uc?export=view&id=" + holdDataFor_toJsonFile_.table[0]['link']);
    }
    catch(error){
        console.log(error.message);
    }
}
 
// generatePublicUrl();
