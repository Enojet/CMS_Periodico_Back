const multer=require("multer");//procesa archivos cuando el formualrio tiene la propiedad multy parge form data
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');//intermediario, coge y lo sube al cloudinary

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"imgNoticias",
        allowedFormats:["jpg","png","jpeg","svg","gif"]
    }
});
const upload=multer({storage:storage});
module.exports=upload;