const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

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
    apikey: 'lJnj89_rTFjGVW3Oa9HhjdhDIJC0OWij7usZ-FWylRX3',
  }),
  serviceUrl: 'https://api.au-syd.natural-language-understanding.watson.cloud.ibm.com/instances/02d0791c-3f24-4379-93d3-908908570bc3',
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
    // console.log(text);

    
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
      // console.log(JSON.stringify(analysisResults, null, 2));


       score= analysisResults.result.keywords[0].sentiment.score;
       label =analysisResults.result.keywords[0].sentiment.label;

       sadness =analysisResults.result.keywords[0].emotion.sadness;
       joy =analysisResults.result.keywords[0].emotion.joy;
       fear = analysisResults.result.keywords[0].emotion.fear;
       disgust =analysisResults.result.keywords[0].emotion.disgust;
       anger = analysisResults.result.keywords[0].emotion.anger;


      // console.log('Score :'+ score);
      // console.log('Label :'+ label);
      // // console.log(analysisResults.result.keywords[0].emotion);
      // console.log('Sadness :'+ sadness);
      // console.log('Joy :'+joy);
      // console.log('Fear :' +fear);
      // console.log('Disgust: '+ disgust);
      // console.log('Anger: '+ anger);


      res.redirect('/');

    })
    .catch(err => {
      console.log('error:', err);
    });

  

});






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});