import mongoose from 'mongoose'
import dotenv from 'dotenv' 

dotenv.config()
mongoose.set('strictQuery', true)

async function dbClose() {
    await mongoose.connection.close()
    console.log('Database disconnected')
}
//Connect to a MongoDB via Mongoose
try {
    const m = await mongoose.connect(process.env.ATLAS_DB_URL)
    console.log(m.connection.readyState === 1 ? 'Mongose connected': 'Mongose failed to connect') 
} 
catch (err) {
    console.log(err)  
}

// Create a Mongoose schema to define the strcuture of a model. 
// A schema is an object which consists of one of more fields that we want to put in that schema. For each field we can specify a data type and in this case that they are required. There are various other options we could add here such as data validation and setting min and max values.     Schema first then model. Moongoose 
const entrySchema = new mongoose.Schema({
    category:{ type: mongoose.ObjectId, ref: 'Category'}, // The ID itself is an ObjectId. The required in implicit when we are using an ObjectId. Instead we add a property called ref. In here we put the name of the model that this is a refrence to. This is like a foriegn key. Which model are we referncing? I want it to be the objectId of an instance of the category model. 
    content: { type: String, required: true}// // this itself is an object. We provide the data type capitalised because it is an instance of a class. required: true means we can't create an instance without a category.
})

// create a mongoose model based on a schema. We now create a model using that schema. The advantage of having this split up is that I can have multiple different models using the same schema. Also I can refer to the schema itself. 
const EntryModel = mongoose.model('Entry', entrySchema) // This calles mongoose.model with two parameters. Firstly a string which names the model. It needs to be unique and in PascalCase.Secondaly The schema we previously created. In this case I am using the entry schema to define the structure.  This will return a Mongoose model object which is stored in a constant variable called EntryModel (again using PascalCase).  This will then allow me to utilise methods on the model e.g. I can use it to create instances of the model. 

// Categories
const categorySchema = new mongoose.Schema({  // The naming convention for models and schemas is always singular. We are defining a model or schema for a single instance. 
    name: { type: String, required: true}
})

const CategoryModel = mongoose.model('Category', categorySchema)

export { EntryModel, CategoryModel, dbClose } // At this point this is the minmum required. Don't expose anything you don't need to. 