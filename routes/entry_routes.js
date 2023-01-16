import express from 'express'
import { EntryModel, CategoryModel } from '../db.js' // double dot as it is up one folder 

const router = express.Router() //creates a stand alone new instance of the router class app. So far we have been using one build into app. What this does internally is that it has an instance of a router class.  This encapsulates all the routing functionality. Then instead of calling the methods of app I call them on app. It's the same idea as a blueprint object in flask.  I can't just import the exsiting app creating in index because that would create a circular reference.  Router is capitaliried as it is a constructor function. 

// Here we have removed entries from each of the routes as it will be attached as a prefix. 
router.get('/', async (req, res) => res.send(await EntryModel.find().populate({ path: 'category', select: 'name'}))) 
//Here we are using a chain method called populate and we pass in the name of the field that we want to populate. Here we pass in category. Find and retrieve all of the entry model records and with each one populate the category field. Populate means use the id found and put the whole record there instead. Now it will add the entire category objected nested into the JSON.  


// All of our model methods in Mongoose are promose based. They are all asynchronous and return a promise.  Aysnc/ await provides a syntactic sugar which is a nicer way of working with promises.  Rather then having a ".then" I can just await the resolve of the promoise. In this case I am using the entry model (which we set up earlier) and executing a find. Find is used to retrieve documents from a collection. If nothing is provided () it will find all instances of EntryModel. It finds and retrieves all of the documents of the type EntryModel. 

// To get request to retrieve a single entry by its id.
router.get('/:id', async (req, res) => {// Here with the colon prefix we have declared a RESTful (URL) parameter. If they add a second segment after /entries then it interprets the second part as an ID number. It will then extract it and put it into a param called id. The param is a member of the params object which in turn is a member of the request object.  
    try {// Wrapping it in a try/catch allows us to do some error handling. 
    const entry = await EntryModel.findById(req.params.id).populate({ path: 'category', select: 'name'})//here we are using findById rather than just the generic find method. We access it from the request object (req)  and access the id using the dot notation req.parama.id.  This allows us to access the value of that second segment of the url.  
    if (entry) { // if the entry is truthy then send it as a response (a common reason it would be false is if there is no entry with that id)
       res.send(entry) // again it will automatically convert this into JSON. 
    } else { // If it is false that is is failed to retrieve a valid entry it will change the status code to 404 and send an oject with the key error and the value entry not found. 
        res.status(404).send({ error: 'Entry not found'})
    }
    }    
    catch (err) {
        res.status(500).send({ error: err.message }) // if something else goes wrong other than being unable to find the entry (such as if we lose a database connection or the database server goes down) it will through an exception which we are going to catch. Here we will pass in the error object. It will then change the status to 500 (which is used to indicate a server error) and the error message that's been gnerated as a result. Under normal conditions this error would not be thrown. 
} 
}) 

router.put('/:id', async (req, res) => {//I have copied this from the get request used to retrieve a single entry based on the id provided as a RESTful URI parameter. The process it the same but it does one extra thing (updates it). In alchamy and ruby on rails you have to find the entry and then update. Mongoose has an option which allows us to combine finding the entry with updating it.   
    const { category, content } = req.body // this will allow us to destrucute category and content from body. 
    const newEntry = { category, content}// This allows us to create a new entry out of those. 

    try {
    const entry = await EntryModel.findByIdAndUpdate(req.params.id, newEntry, { returnDocument:'after' })// This allows us to do everything in one step. The first parameter is the same as before and allows us to access the ID provided in the last segment for the url and the second paramerer is the new object that you want to update it to (in this case the value of newEntry).   
    if (entry) { 
       res.send(entry) 
    } else {  
        res.status(404).send({ error: 'Entry not found'})
    }
    }    
    catch (err) {
        res.status(500).send({ error: err.message }) // if something else goes wrong other than being unable to find the entry (such as if we lose a database connection or the database server goes down) it will through an exception which we are going to catch. Here we will pass in the error object. It will then change the status to 500 (which is used to indicate a server error) and the error message that's been gnerated as a result. Under normal conditions this error would not be thrown. 
} 
}) 


// A post request to add a new entry. 
// router.post('/', async (req, res) => { // Again it has two parameters the url and an async callback function which accepts two parameters the request and response object.  
//     try{ // Wrapping it in a try/catch allows us to do some error handling. 
//         // 1. Create a new entry object with values passed in from the request. I used those two values that come in with the request to construct a new entry object. 
//         const { category, content} = req.body  //here we extract from the req.body. Because the post request was a JSON body it will be parsed using the JSON middleware when we used "app.use(express.json())". This converted it into a Javascript object and put into req.body (this is where it stores that result.). We know req.body is an object so we can strcutre out the fields that are expected. In between this and the next line we could do validation and sanitisation.  
//         const categoryObject = await CategoryModel.findOne({ name: category })
//         const newEntry = { category: categoryObject, content} //don't just use the entire req.body as is open to SQL injections. It will only use the category and content anything else is discarded.  We need to validate and sanatise the content. We then create a new object consisting of category and content. This is the short hand of: const newEntry = { category: category, content: content}. If the key and the variable containing the value have the same name it can be abbreviated in this way. 
//         //2. Push the new entry to the entries array.
//         const insertedEntry = await EntryModel.create(newEntry) //creates a new document in the collection based on that model's schema. It's strucutre will be validated against the schema. This provides some validation. It will have an id and version added to it. 
//         //3. Send the new entry with 201 status (201 = succefully created an entry). This is a common pattern in API's. When you create a new entry once it has been created and the id's and versions have been added it is returned to the client. The client can then display that to the user.      
//         res.status(201).send(await insertedEntry.populate({ path: 'category', select: 'name'}))
//     }
//     catch (err) {
//         res.status(500).send({ error: err.message })
// } 
// })

router.post('/', async (req, res) => {
    try {
      // 1. Create a new entry object with values passed in from the request
      const { category, content } = req.body
      const categoryObject = await CategoryModel.findOne({ name: category })
      const newEntry = { category: categoryObject._id, content }
      // 2. Push the new entry to the entries array
      // entries.push(newEntry)
      const insertedEntry = await EntryModel.create(newEntry)
      // 3. Send the new entry with 201 status
      res.status(201).send(await insertedEntry.populate({ path: 'category', select: 'name' }))
    }
    catch (err) {
      res.status(500).send({ error: err.message })
    }
  })
  
// Once we have declared all of our routes and middleware what remains is to start up the server with listen to listed on the designated port. 
//app.get('/', (request,response) => console.log(request)) // It passes two parameters into the callback. WE can ignore these and it will still work. What get does it pass 2 parameters in request and response objects which encapsulate the request that's com. They contain data (the headers, body and url) but also methods. The default status code is 200

//It's rare for an API to support patch. It's more common for the front end to send in the entire object. If it is a very large object and you only need to update one field then a patch would be less network traffic.But the front end needs to know what do change. For example if fields are being updated in a form, you need to figure out which fields they have changed.   It can be more efficient to just send the entire object and be done. 

//Deleting an Entry based on the idea. 
router.delete('/:id', async (req, res) => { 
    try {
    const entry = await EntryModel.findByIdAndDelete(req.params.id) 
    if (entry) { 
       res.sendStatus(204) //Send a status back with no body. The status to use for a successful deletion is 204 (success but with no content. It was successful but I have nothign else to tell you.) 
    } else {  
        res.status(404).send({ error: 'Entry not found'})
    }
    }    
    catch (err) {
        res.status(500).send({ error: err.message }) // if something else goes wrong other than being unable to find the entry (such as if we lose a database connection or the database server goes down) it will through an exception which we are going to catch. Here we will pass in the error object. It will then change the status to 500 (which is used to indicate a server error) and the error message that's been gnerated as a result. Under normal conditions this error would not be thrown. 
} 
}) 

export default router // If you only have one thing to export make that the default export. Here wer are setting the default to router will include all of its attached routes.  