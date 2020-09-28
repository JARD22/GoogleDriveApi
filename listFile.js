
const {google}=require('googleapis')
const key = require('./private_key.json')
  // importamos dirve en su version 3
const drive = google.drive("v3");

const listfiles = (folder)=>{


return new Promise((resolve,reject)=>{
  //Pasamos por la autenticacion
  let jwToken = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key, 
    ["https://www.googleapis.com/auth/drive.readonly"],
    null
  );
  jwToken.authorize((authErr,credentials) => {
    if (authErr) {
      console.log("error : " + authErr);
      return;
    } else {}
  });  


  //Listamos los archivos de un folder
drive.files.list({

  //asignamos la cantidad de archivos que queremos recibir con pageSize
  auth: jwToken,
  pageSize: 20,
   q: "'" + folder + "' in parents and trashed=false",
  pageSize: 20,
  fields: 'nextPageToken, files(id, name)',
}, (err, res) => {
  if (err){
    //Manejamos el error
    reject(err);
    return console.log('La API ha retornado un error: ' + err);
  } 

 let files = res.data.files;
 //Si viene un array de archivos entonces devolvemos todo ese array
  if (files.length) {  
    resolve(files)
  } else {
    //de lo contrario no hay archivos en carpeta
    resolve('No hay archivos en esta carpeta')
  }
});
})

}

module.exports={listfiles}
