const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const request=require("request");
const { subscribe } = require("diagnostics_channel");

const app=express();

// API Key For MailChimp : 9c79b64353abb24ead4166789de686e5-us12
// audience id:  0ac28c36d4
//server Prefix : us12

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/app.html");

})

app.post("/",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    // MailChimp method for data entries
var data={
    members : [
        {
            email_address:email,
            status: "subscribed",

           merge_fields : {
            FNAME:fname,
            LNAME:lname
           }
         }
    ]
 
 };
 
 const jsonDATA=JSON.stringify(data);
 
 const url="https://us12.api.mailchimp.com/3.0/lists/0ac28c36d4";

 const options ={
     method:"post",
     auth:"uzair:9c79b64353abb24ead4166789de686e5-us12"
 }
 
 const request=https.request(url,options,function(response){
     response.on("data",function(data){
         console.log(JSON.parse(data));
     })

     if(response.statusCode==200){
        res.sendFile(__dirname + "/success.html");
     }
     else{
        res.sendFile(__dirname + "/failure.html");
     }
 
 })

 console.log(request); 
 
 // Send data to mailchimp
 request.write(jsonDATA);
 request.end();

})



app.listen(process.env.PORT || 3000,function(req,res){
    console.log("Server Started");
})