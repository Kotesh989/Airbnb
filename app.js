const express=require("express");
const app=express();
const methodOverride=require("method-override");
const mongoose=require("mongoose");
let Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended:true}))

main().then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err);
})

// app.get("/listing",async (req,res)=>{
//     const list1=new Listing({
//         title:"New villa",
//         description:"By beach",
//         price:100,
//         location:"goa",
//         country:"India",
//     });

//     await list1.save();
//     console.log("data saved");
//     res.send("Saved");
// })

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        return next(new ExpressError(404,errMsg));
    }
    else{
        next();
    }
}

//Index Route
app.get("/listings",
    // validateListing,
    wrapAsync(async(req,res,next)=>{     
 const allListings=await Listing.find({});
    console.log("All data");
    res.render("listings/index",{allListings});
})
);

app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

//Show Route

app.get("/listings/:id",
    // validateListing,
    wrapAsync(async(req,res)=>{
    
    let {id}=req.params;
    if(!id){
        throw new ExpressError(400,"Enter valid id");
    }
    let details=await Listing.findById(id);
    if (!details) {
        // if no listing found
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show",{details});
}));


//New Route

app.post("/listings",
    validateListing,
     wrapAsync(async (req, res) => {
        let result=listingSchema.validate(req.body);
        console.log(result);
        const data = req.body.Listing;
//   if(!data){
//     throw new ExpressError(404,"Send valid data for listing");
//   }
  // Cast price explicitly
  data.price = parseInt(data.price);
  const listing = new Listing(data);
  await listing.save();
  res.redirect("/listings");  // check what is stored
}));


//Edit /update route
app.get("/listings/:id/edit",
    wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let details=await Listing.findById(id);
    res.render("listings/edit",{details});
}));


app.put("/listings/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listings");
}));

app.all("*",async(req, res, next) => {
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let{status=500,message="Somethins went wrong!"}=err;
    res.status(status).render("error",{err});
});

app.listen(8080,(req,res)=>{
    console.log("Server started on 8080");
})

app.get("/",(req,res)=>{
    res.send("Hi i'am kotesh");
})