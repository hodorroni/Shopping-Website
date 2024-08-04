import express from "express";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
import mongoose from "mongoose";
import User from "./userSchema.js";
import Items from "./itemsSchema.js";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
// Middleware to get the body
app.use(bodyParser.urlencoded({extended: true}));

// Middleware to parse JSON
app.use(express.json());
//connect to mongoDB
const dbURI = 'mongodb+srv://hodorroni-write:mwoamnkxm5x@react-hit.rckwssd.mongodb.net/?retryWrites=true&w=majority&appName=React-HIT';
mongoose.connect(dbURI)
.then((result)=>console.log("connected to db"))
.catch((error) => console.log(error));
const port = 5000;

//app.use(express.static(path.join(__dirname, 'src')));

app.use(cors());





// Catch-all route to serve the index.html file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

//adding items by Admin users to the database
app.post('/add-items', async (req,res) => {
    const {title,price,category,description,image,userCreated} = req.body;
    const item = new Items({
        userCreated:userCreated,
        title:title,
        price:price,
        category:category,
        description:description,
        image:image
    });
    await item.save()
    .then((result) => {
        return res.status(200).json(result)
    })
    .catch((err) =>{
        return res.status(400).json({message:"Error while adding the item"})
    })
});

//saving the user to the mongoDB
app.post('/add-user', async (req,res) => {
    const { username, password,firstname,lastname,isAdmin } = req.body;
    const user = new User({
        username:username,
        password:password,
        firstname:firstname,
        lastname:lastname,
        isAdmin:isAdmin
    });
;    const userFound = await User.findOne({username});
    if(userFound){
        return res.status(400).json({message: 'Username already exists!'});
    }
    else{
    await user.save()
    .then((result) => {
        res.json({userId: user._id});
    })
    .catch((err)=> {
        return res.status(500).json({message: 'Server Error'});
    })
    }
    
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username and password
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Respond with the user's ID
    res.json({ userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//fetching the items from the API
app.get("/fetchItems", async (req,res) => {
    try{
        const apiResponse = await fetch("https://fakestoreapi.com/products");
        if(!apiResponse.ok){
            throw new Error(`HTTP erro! Status ${apiResponse.status}`)
        }
        const data = await apiResponse.json();
        res.json(data);
    }
    catch(error){
        console.log('Fetch error: ', error);
    }
});


app.get("/db-items", async (req,res) => {
    Items.find()
    .then((result) => {
        return res.status(200).json(result);
        
    })
    .catch((err) => {
        return res.status(400).json({ message: 'Coudlnt get the items from the DB' });
    })
});

app.delete('/delete-item', async(req,res) => {
    const {item} = req.body;
    try {
        await Items.findByIdAndDelete(item._id);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/edit-item', async(req,res) => {
    const {item} = req.body;
    try {
        const itemToEdit = await Items.findByIdAndUpdate(item._id, item, { new: true });
        res.json(itemToEdit);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Server error' });
    }
})
//clicking on item from DB
app.get('/itemDB/:_id', async (req,res) => {
     try {
        const id = req.params._id; // IDs in MongoDB are typically strings
        const item = await Items.findById(id); // Await the asynchronous operation
        
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

//clicking on item from API
app.get('/item/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const apiResponse = await fetch("https://fakestoreapi.com/products");
        if(!apiResponse.ok){
            res.status(400).json({message:"Coldn't fetch"});
        }
        const data = await apiResponse.json();
        data.map(value => {
            if(id == value.id){
                res.json(value);
            }
        })
    }
    catch(error){
        res.status(500).json({message:'Server error'});
    }
})

app.post('/get-user-items', async(req,res) => {
    try{
       const userId = req.body.userId;
    const listOfItems = await Items.find({ userCreated: userId });
    res.status(200).json(listOfItems); 
    }
    catch{
        res.status(400).json({message:"Server Error"});
    }
})

app.post('/get-user-details', async(req,res) => {
    try{
        const userId = req.body.userId;
        const userDetails = await User.findById(userId);
        res.status(200).json(userDetails);
    }
    catch{
        res.status(400).json({message:"Server Error"});
    }
})

//update user details
app.patch("/updateUserDetails", async (req, res) => {
    try {
        const newUser = req.body.newObject;
        //const isStillAdmin = newUser.password === "1234"
        const hasUserChanged = req.body.hasUserNameChanged
        const userExists = await User.findOne({username: newUser.username});
        if(userExists && !hasUserChanged){
            return res.status(400).json({message: "Username already exists"});
        }
        // if(!isStillAdmin){
        //     newUser.isAdmin = true
        // }
        // else {
        //     newUser.isAdmin = false
        // }

        const result = await User.findOneAndUpdate({ _id: newUser._id }, newUser, { new: true, runValidators: true });
        // Check if result is falsy or if result.ok is not truthy
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // If update is successful, send updated user object
        return res.status(200).json(result);
    } catch (error) {
        // Handle server errors
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post("/getAllUsers", async(req,res) => {
    try{
        const currentId = req.body.currentId;
        const allUsers =await User.find({ _id: { $ne: currentId } });
        if(!allUsers){
            return res.status(400).json({message:"Error getting users"})
        }
        res.status(200).json(allUsers);
    }
    catch{
        res.status(500).json({message:"Server Error"})
    }
});

app.delete("/delete-user", async(req,res) => {
    const userIdDelete = req.body.id; 
    const currentId = req.body.currentId;
    const userDelete = await User.findByIdAndDelete(userIdDelete)
    try{
      if(!userDelete){
        res.status(400).json({message:"User not found!"})
    }
    else {
        const allUsers = await User.find({ _id: { $ne: currentId } });
        res.status(200).json(allUsers);
    }  
    }
    catch{
        res.status(500).json({message:"Server Error"});
    }
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});