const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

var score, label,sadness,joy,fear,disgust,anger,text;

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.key,
  }),
  serviceUrl: process.env.URL,
});

app.get('/',function(req,res){
    res.render('home',{
      score:score,
      label:label,
      sadness:sadness,
      joy:joy,
      fear:fear,
      disgust:disgust,
      anger:anger,
      text:text
    });

    text='';
    score='';
    sadness='';
    label ='';
    joy='';
    fear='';
    anger='';
    disgust='';
});

app.post('/',function(req,res){
     text=req.body.text;

  if (text.length===0) {
   console.log('Bro are you fucking stupid?'); 
   res.redirect('/')
  }
  else{
 
const analyzeParams = {
    'text': text,
    'features': {
      'entities': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
      },
      'keywords': {
        'emotion': true,
        'sentiment': true,
        'limit': 2,
      },
    },
  };
  
  naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {

       score= analysisResults.result.keywords[0].sentiment.score;
       label =analysisResults.result.keywords[0].sentiment.label;

       sadness =analysisResults.result.keywords[0].emotion.sadness;
       joy =analysisResults.result.keywords[0].emotion.joy;
       fear = analysisResults.result.keywords[0].emotion.fear;
       disgust =analysisResults.result.keywords[0].emotion.disgust;
       anger = analysisResults.result.keywords[0].emotion.anger;

      res.redirect('/');

    })
    .catch(err => {
      console.log('error:', err);
    });
  }
  

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});