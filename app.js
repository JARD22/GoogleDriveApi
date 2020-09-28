const express = require('express')
const app = express();
const fileUpload= require('express-fileupload');
const fs= require('fs');
const {listfiles}=require('./listFile');
const {uploadFile}=require('./uploadFile');


//Express file-upload es un middleware que nos permite subir archivos
app.use(fileUpload());

//obtenemos los archivos de un folder
app.get('/archivos/:folder',async(req,res)=>{
    //extraemos el folder de los parametros
let folder= req.params.folder
//lamamos a nuestra promesa listfiles que recibe un folder
let files= await listfiles(folder);

 res.status(200).json({
     ok:true,
     msg:files
 })


})

//Subimos un Archivo a un folder
app.post('/subirArchivo/:folder',async(req,res)=>{

    //Verificamos que haya un archivo para subir
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No hay archivos para subir');
      }


    //Obtenemos el archivo y el folder donde se quiere guardar
let archivo = req.files.archivo
let folder= req.params.folder

try {
    //Creamos un una ruta para guardar el archivo, de esta manera funciona la API de Google Drive
    const nombreArchivo= archivo.name
    const ruta = `./uploads/${nombreArchivo}`

    //movemos el archivo a una ruta para despues ser enviada.
 archivo.mv(ruta,(err)=>{
     if(err){
         
         return res.status(500).json({
             ok:false,
             msg:'error al mover el archivo'
         })
     }
 })

 //Llamamos a la funcion uploadFile que recibe un folder, archivo y ruta, esto nos devuelve una promesa
 //conveniente ya que necesitamos esperar a que el archivo se suba para poder eliminarlo
    let upload= await uploadFile(folder,archivo,ruta)
    //una vez se sube el archivo lo eliminamos del servidor
   fs.unlinkSync(ruta);
    
return res.status(200).json({
    ok:true,
    file: upload
})


} catch (error) {
console.log(error)
    return res.status(500).json({
        ok:false,
        msg:error
    })
}



})


app.listen(3000,()=>{
    console.log('Servidor en el puerto 3000')
})