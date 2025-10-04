const mongoose = require("mongoose");

// const Schema = new mongoose.Schema;

const listingschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1741557571786-e922da981949?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set: v => v === "" ? "https://images.unsplash.com/photo-1741557571786-e922da981949?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    }
  },
  price: {
    type: Number,
    required:true
  },
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingschema);

module.exports = Listing;