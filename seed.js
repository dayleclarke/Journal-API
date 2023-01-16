import { CategoryModel, dbClose, EntryModel } from './db.js'

// Delete the exsisting entries in our database. 
await EntryModel.deleteMany() 
console.log('Deleted all entries in the Journal database')
await CategoryModel.deleteMany()
console.log('Deleted all categories in the Journal database')

const categories = [
    { name: 'Food' },
    { name: 'Coding' },
    { name: 'Work' },
    { name: 'Other' },
    { name: 'Climbing' }
] 
// Once the categories are created we need to provide the ID of the category instead of a hard-coded string when listing an entry. 
const cats = await CategoryModel.insertMany(categories)
console.log('Inserted Categories')

const entries = [
    { category: cats[0], content: 'Pizza is delicious'}, // This is used to select a category from the categories list. Cats is short for category. 
    { category: cats[1], content: 'Express is agnostic.'},
    { category: cats[2], content: 'Another day, another dollar.'},
]

await EntryModel.insertMany(entries)
console.log('Inserted Entries')

dbClose() // This is used to close the open MongoDB connection. 
