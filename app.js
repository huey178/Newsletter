//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.first;
  var lastName = req.body.last;
  var email = req.body.email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us3.api.mailchimp.com/3.0/lists/d78f39f55f",
    method: "POST",
    headers: {
      Authorization: process.env.AUTH,
    },
    body: jsonData,
  };

  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("You are now listening on port 3000");
});

//  api key      f7c813a45f2098ae6558b8aa69861c3c-us3
// list id    d78f39f55f
