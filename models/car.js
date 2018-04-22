var mongoose = require("mongoose");
 
var carSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});
 
module.exports = mongoose.model("Car", carSchema);