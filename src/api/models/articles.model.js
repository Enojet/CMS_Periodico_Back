const mongoose = require('mongoose');// PRUEBA
const Schema = mongoose.Schema;

const articlesSchema = new Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        date: { type: Date },
        section: { type: String,enum:['economy', 'politics','science','sports'], required: true },
        image:{type: String, default:null},
        body: { type: String, required: true },
        author:{ type: Schema.Types.ObjectId, ref: "user"},//populate
        status:{type: String, enum:['draft', 'revisable','publish'], default:'draft', required: true },// aquí hay que poner draft, revisable, published
        editorId: { type: Schema.Types.ObjectId, ref: "user", default:null},
        highlight:{type:Boolean, required:true, default: false}
    },
    {
        collection: 'articles',
        timestamps: true, //createdAt, updatedAt
    });
const Articles = mongoose.model('articles', articlesSchema);
module.exports = Articles;
