const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');


const CLIENT_ID = '22323826731-lb3p2vr84lultphirv72iplbc36oe18o.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04W3NhYAT8W_kCgYIARAAGAQSNwF-L9Irc1RbdN658LlS8_eWPKSpC9-GjgXdw4_QkliOX9o_DdeNULXGahOq2S_O8v3GQNKnCLY';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});



const drive = google.drive({
    version: "v3",
    auth: oauth2Client

});

const filePath = path.join(__dirname, 'DR.jpg');


// uploadFile();

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

        console.log(response.data);
    }
    catch(error){
        console.log(error.message);
    }
}


// delete file
async function deleteFile(){
    try{
        const response = await drive.files.delete({
            fileId: '1rSmzR-MvwZ4jJtjfT5H8-MYa1JcjtzAQ'
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
    try{
        await drive.permissions.create({
            fileId: '17GlgEPaGXbljWA5XaB9xpTQkj1_f3-Th',
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        const result = await drive.files.get({
            fileId: '17GlgEPaGXbljWA5XaB9xpTQkj1_f3-Th',
            fields: 'webViewLink, webContentLink'
        });
        console.log(result.data);
    }
    catch(error){
        console.log(error.message);
    }
}
 
// generatePublicUrl();

//  