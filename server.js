//const base64url = require("base64url");
//var cors = require('cors')
import cors from "cors"
//const express = require("express");
import express from "express"
import axios from "axios";
//const expressSession = require("express-session");
//var bodyParser = require('body-parser')
import bodyParser from "body-parser"
//const path = require("path");
//const indexController = require("./index");
//const userController = require("./user");
let formData = new FormData(); 

//const { getConfiguredPassport, passportController } = require("./passport");
var token=token?token:[]
const app = express();

// const session = {
//   secret: "someSecret",
//   cookie: {},
//   resave: false,
//   saveUninitialized: false,
// };
// app.use("/",(req,res)=>{
//     req.header('Access-Control-Allow-Headers',"*");
// })
app.use(cors())
app.use(bodyParser.json())


app.get("/check",  async (req, res) => {
  try{  
      const clientId = "fsams.ro";

      const clientSecret = "secret";

      const username = "FSTNRTESTUSER";

      const password = "P@ssw0rd!@#";

      const data = new URLSearchParams();

      data.append("grant_type", "password");

      data.append("client_id", clientId);

      data.append("client_secret", clientSecret);

      data.append("username", username);

      data.append("password", password);

      const response = await fetch("https://sts-lle.atsol.com/connect/token", {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: data.toString(),
      });

      const tokenData = await response.json();

    
      token.push(tokenData.access_token)

      res.json({toaken:tokenData.access_token})
  }
  catch(error){
    res.send("error")
  }
   
  });

  app.get("/session",async(req,res)=>{
      try{
        const apiUrl = 'https://fs-tnr-tps-dev-api.azurewebsites.net/api/DocumentManagement/GetLast30DaysDocumentRequests';
        const bearerToken = token[token.length-1];
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json'
            }
          });
        
          const responseData = await response.json();
          res.json({responseData:responseData})
         //res.send("verified")
      }catch(err){
        res.send("error")
      }

 
})




app.get("/get",async(req,res)=>{
    try{
   const apiUrl = 'https://fs-tnr-tps-dev-api.azurewebsites.net/api/DocumentManagement/GetWorkOrders';
   const bearerToken = token[token.length-1];
   let formData = new FormData(); 

   formData.append("sort", "");  
   formData.append('page', 1);
   formData.append('pageSize',25);
   formData.append('group',"");
   formData.append('filter',"");
   formData.append('SearchColumn', "VIN");
   formData.append('SearchTextField',"");
   formData.append('SelectedWorkOrderStatus', '1%2C2%2C3%2C4');
   formData.append('StartFromDate', "11/30/2022");
   formData.append('StartToDate', "02/23/2023");
   formData.append('Search',true);
   formData.append('DMVState', "",);
   formData.append('Customer', "");
   formData.append("TrackingNumber","");
   formData.append('CreatedUser', "");
   formData.append('DocumentTypeCode',"");
   formData.append('SentToSVRS', 2);
   formData.append('SentToWIP', 2);





        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${bearerToken}`,
                'content-type': 'multipart/form-data',
            },
            body:formData
          });
        
          const responseData = await response.json();
          res.json({responseData:responseData})
         //res.send(response)
      }catch(err){
        res.send("error")
      }
   
  
   
})

app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
  });
