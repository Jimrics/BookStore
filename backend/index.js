import express, { request, response } from "express";
import {mongoDBURL, PORT} from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';
import { BrowserRouter } from 'react-router-dom';
import { Book } from "./models/bookModels.js";
import booksRoute from './routes/booksRoute.js';
const app = express();

//Midlerware for parsing request body
app.use(express.json());
app.use(cors());

/*app.use(
    cors({
origin: "http://localhost:3000",
methods: ['GET', 'POST', 'PUT','DELETE'],
allowedHeaders: ['Content-Type'],
    })
);*/


app.get("/",(request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome");
});

app.use('/books', booksRoute);
//Route to save a new Book in mogo using models
app.post("/books", async(request, response)=>{
try{
    if(
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
    ){
        return response.status(400).send({
            message: "send all required fields: title, author, publishyear",
        });
    }

    const newBook={
        title: request.body.title,
        author: request.body.author,
        publishYear:request.body.publishYear,
    }

const book = await Book.create(newBook);
}
catch(error){
    console.log(error.message);
    response.status(500).send({message: error.message});
}
})

//Route for Get all boooks from database
app.get('/books', async(request, response)=>{
    try{
const books = await Book.find({});
return response.status(200).json({
    count: books.length,
    data: books
});
    }catch(error){
        console.log(error.message);
    }
});

//Route for Get one boook from database by Id
app.get('/books/:id', async(request, response)=>{
    try{
        const {id} = request.params;
        const books = await Book.findById(id);
return response.status(200).json(book);
    }catch(error){
        console.log(error.message);
    }
});

//Route to update a book
app.put('/books/:id', async(resuest, response)=>{
try{
    if(
        !request.body.title ||
        !request.body.author ||
        !request.body.publishYear
    ){
        return response.status(400).send({
            message: "send all required fiels: title, author, publishYear",
        });
    }
const {id}= request.params;
const result = await Book.findByIdAndUpdate(id, request.body);

if(!result){
    return response.status(404).json({message: 'Book not found'});
    }
    return response.status(200).send({message: "Book updated successfully"});
}
catch(error){
    console.log(error.message);
    response.status(500).send({message: error.message});
}
});

//Route for deleting a book
app.delete('/books/:id', async(request, response)=>{
    try{
     const{id}=request.params;
     const result = await Book.findByIdAndDelete(id);

     if(!result){
        return response.status(404).json({message:'Book not found'});
     }
     return response.status(404).json({message: 'Book not found'});
    } catch(error){
     console.log(error.message);
     response.status(500).send({message: error.message});
    }
});
mongoose.connect(mongoDBURL).then(()=>{
console.log("App connected to database");
app.listen(PORT, ()=>{
    console.log(`App is listening to port: ${PORT}`);
});
}).catch((error)=>{
    console.log(error);
});
