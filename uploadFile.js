// importaciones
const {google}=require('googleapis')
const drive = google.drive("v3");
const key = require('./private_key.json')
const fs= require('fs');
const path= require('path')



// SUBIR UN ARCHIVO A UN FOLDER
const uploadFile=(folder, file,ruta)=>{

  return new Promise((resolve,reject)=>{
  //Pasamos por la autenticacion
  let jwToken = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key, 
    ["https://www.googleapis.com/auth/drive"],
    null
  );
  jwToken.authorize((authErr,credentials) => {
    if (authErr) {
     
      console.log("error : " + authErr);
      return;
    } else { 
    }
  });  


//Asignamos el nombre del archivo y el folder donde vamos a guardar
  let fileMetadata = {
    name: file.name,
    parents: [folder]
  };
  
  //Asignamos el tipo de archivo y el cuerpo del mismo, 
  let media = {
    mimeType: file.mimeType,
    body: fs.createReadStream(path.join(__dirname,ruta))
  };
  
  //Hacemos la peticion a la API 
  drive.files.create({
    auth: jwToken,
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file)=> {
    if (err) {
      // Manejamos el error
      reject('Error al subir el archivo: '+ err)
      console.error(err);
    } else {
      //Resolvemos la promesa con el id del archivo que subimos
      resolve(file.data.id)
    }
  });

  })
}

module.exports={uploadFile}
