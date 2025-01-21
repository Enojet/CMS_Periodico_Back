const mongoose = require('mongoose');// PRUEBA
const Schema = mongoose.Schema;

const articlesSchema = new Schema(
    {
        title: { type: String, require: true },
        subtitle: { type: String, require: true },
        date: { type: date, require: true },
        section: { type: String, require: true },
        image:{type: image},//mirar como es el tipo imagen
        body: { type: String, require: true },
        author: { type: String, require: true },
        status:{type:string},// aquí hay que poner draft, revisable, published
        
        
       
        users: [{ type: Schema.Types.ObjectId, ref: "users" }]
    },
    {
        collection: 'articles',
        timestamps: true, //createdAt, updatedAt
    }
);
const Articles = mongoose.model('articles', articlesSchema);
module.exports = Articles;
