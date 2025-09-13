const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {s
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.use(methodOverride("_method"));
app.set("view engine" ,"ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

app.get("/",function(req,res){
    console.log("hwlo ")
    res.send("helo")
})

//  index route 
app.get("/listings", async (req, res) => {
const alllisting  = await Listing.find({})
res.render("listings/index.ejs",{alllisting})   
});

// new route
app.get("/listings/new",(req, res)=>{
    res.render("listings/new.ejs")
})

// show route
app.get("/listings/:id",async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs",{listing}
    )
})

// create route 
app.post("/listings",async(req , res)=>{
const newlisting = new Listing(req.body.listing)
 await  newlisting.save()
  res.redirect("/listings")
}) 

// edit rout  
app.get("/listings/:id/edit",async(req,res)=>{
   let {id}= req.params;
  const listing = await Listing.findById(id)
  res.render("listings/edit.ejs",{listing})
})

// update route
app.put("/listings/:id",async(req,res)=>{
  let {id}= req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`)
})

// delete route
app.delete(  "/listings/:id",async(req,res)=>{
  let {id}= req.params
let deletelisting  = await Listing.findByIdAndDelete(id)
console.log(deletelisting)
  res.redirect("/listings")
})

app.listen(8080)