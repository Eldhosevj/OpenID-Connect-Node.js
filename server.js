const base64url = require("base64url");
var cors = require('cors')
const express = require("express");
const expressSession = require("express-session");
var bodyParser = require('body-parser')
const path = require("path");
const indexController = require("./index");
const userController = require("./user");

const { getConfiguredPassport, passportController } = require("./passport");

const app = express();

const session = {
  secret: "someSecret",
  cookie: {},
  resave: false,
  saveUninitialized: false,
};
app.use(cors())
app.use(bodyParser.json())
app.use(expressSession(session));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/", indexController);
var token=""

app.get("/check", (req, res) => {
    const getToken = async () => {
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

    
      token=tokenData.access_token
      res.json({toaken:tokenData.access_token})
    };
    getToken()
  });

  app.get("/session",(req,res)=>{
    console.log(token,"session")
    const getApiData = async () => {
        const apiUrl = 'https://your-api.com/data';
        const bearerToken = token;
      try{
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json'
            }
          });
        
         
        
          const responseData = await response.json();
         // res.json({responseData:JSON.stringify(responseData)})
         res.send("verified")
      }catch(err){
        res.send("error")
      }
       
      
      }
      getApiData()
  })

// (async () => {
//   const passport = await getConfiguredPassport();
//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use("/", passportController);
  

//   app.use("/user", userController);
 
// })();
app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
  });
