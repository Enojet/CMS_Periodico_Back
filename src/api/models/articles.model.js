const mongoose = require('mongoose');// PRUEBA
const Schema = mongoose.Schema;

const articlesSchema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        date: { type: Date, required: true },
        section: { type: String, required: true },
        image:{type: String},//mirar como es el tipo imagen
        body: { type: String, required: true },
        author: { type: String, required: true },
        status:{type: String, enum:['draft', 'revisable','publish'], default:'draft' },// aquí hay que poner draft, revisable, published
        editorId: [{ type: Schema.Types.ObjectId, ref: "users" }]
    },
    {
        collection: 'articles',
        timestamps: true, //createdAt, updatedAt
    });
const Articles = mongoose.model('articles', articlesSchema);
module.exports = Articles;
