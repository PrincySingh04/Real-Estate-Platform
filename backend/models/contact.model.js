import mongoose from 'mongoose';
const contactSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
         type: String,
         required:true
    },
    phone:{
        type: String
    },
    role:{
        type: String,
        enum:['buyer', 'seller'],
        required:true
    },


},{timestamps: true});

export default mongoose.model("Contact", contactSchema);