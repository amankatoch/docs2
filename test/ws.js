

var express = require('express');
var ws = express();
var logger = require('morgan');
var fs = require('fs');
var bodyParser = require("body-parser");
var Parser = require('parse5').Parser;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function callback () {
                 
 });


var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Web Server Settings
ws.set('port', process.env.PORT || 80);
ws.use(logger('dev'));

var FormMetaSchema = null;
var FormMetaModel = null;
var ResponseSchema = null;
var ResponseModel = null;



FormMetaSchema = require("./models/FormMeta.js")(mongoose);
FormMetaModel = mongoose.model('formmetas', FormMetaSchema);
//RespondentSchema = require("./models/Response.js")(mongoose);
//RespondentModel = mongoose.model('respondents', RespondentSchema);


ws.get('/', function (req, res, next) {
console.log('getting home');
   // var startPage = '../static/as.html';
   var startPage = '../static/index.html';
   //var startPage = '../static/os.html';
    fs.readFile(
        startPage,
       function (err, contents) {
            if (err) {
                send_failure(res, err);
                return;
            }
            contents = contents.toString('utf8');
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
}
);


ws.get('/activities', function(req, res) {
  var startPage = '../static/binddemo.html';
       fs.readFile(
        startPage,
       function (err, contents) {
        console.log(contents);
            if (err) {
                send_failure(res, err);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
})


ws.post('/formpost',  urlencodedParser, function(req, res) {
    var myobject = req.body;
    for(var attributename in myobject){
      console.log(attributename+": "+myobject[attributename]);
    }
    FormMetaModel.findOne({"uuid":"new.html"}, function (err, myDocument) {
    console.log(myDocument);
    });
})

/* receive image */

ws.post('/endpoint', urlencodedParser, function (request,response) {
  var query1=request.body.title;
  var query2=request.body.message;
  
  fs.writeFile("../static/actitivities/"+query1, query2, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
parsefile(query1,response);
});

ws.post('/endpointupdate', urlencodedParser, function (request,response) {
  var query1=request.body.title;
  var query2=request.body.message;
  var query3=request.body.frmid;
  var update=true;
  
  fs.writeFile("../static/actitivities/"+query1, query2, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

parsefile(query1,response,update,query3);



});

/* end of image receive */


/* parsing the html  */


function parsefile(filename,response,update,frmid)
{ 
  
 var pasfile =fs.readFile("../static/actitivities/"+filename, function(err,data) {
    // TODO: Store the received HTML on the correct web-server (same algorithm as the images)

    
    var parser = new Parser();
    var fragment = parser.parseFragment(data.toString());
    var parse5 = require('parse5');
    var elem = [];
    

    var parser = new parse5.SimpleApiParser({
    text: function(text) {
        
    },
    startTag: function(tagName, attrs, selfClosing) {
        //Handle start tags here
        //console.log(tagName);
        if(tagName)
        {
            //console.log(attrs);
            for (var i=0;i<attrs.length;i++)
            {
            
            if(attrs[i]['name']=='data-class')
            {
                if(attrs[i]['value']=='radio')
                {   var name;
                    var requried;
                    //console.log(attrs)
                    //console.log(attrs.length);
                  for (var i=0;i<attrs.length;i++)
                  {
                    if(attrs[i].name=='name')
                    {
                         name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                         requried=attrs[i].value;
                        
                    }
                }

                 var fd={"nm":name,"vl":null,"dvl":false,"nv":requried,"vr":null,"vd":null};
                
                 elem.push(fd);
                 
                                
                }
                else if (attrs[i]['value']=='checkbox')
                {
                    
                    //console.log(attrs)
                   for (var i=0;i<attrs.length;i++)
                  {
                    //console.log(attrs.length);
                    if(attrs[i].name=='name')
                    {
                        var name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                        var requried=attrs[i].value;
                        
                    }
                  }
                  var fd={"nm":name,"vl":null,"dvl":false,"nv":requried,"vr":null,"vd":null};
                  elem.push(fd);
                 
                }
                
                
                else if (attrs[i]['value']=='button')
                {
                    
                    //console.log(attrs)
                   for (var i=0;i<attrs.length;i++)
                  {
                    //console.log(attrs.length);
                    if(attrs[i].name=='name')
                    {
                        var name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                        var requried=attrs[i].value;
                        
                    }
                  }
                  var fd={"nm":name,"vl":null,vt:"date","dvl":false,"nv":requried,"vr":null,"vd":null};
                  elem.push(fd);


                }
                else if (attrs[i]['value']=='textarea')
                {
                    
                    //console.log(attrs)
                   for (var i=0;i<attrs.length;i++)
                  {
                    //console.log(attrs.length);
                    if(attrs[i].name=='name')
                    {
                        var name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                        var requried=attrs[i].value;
                        
                    }
                  }
                              var fd={"nm":name,"vl":null,"dvl":false,"nv":requried,"vr":null,"vd":null};
                  elem.push(fd);


                }
                else if (attrs[i]['value']=='dropdown')
                {
                    //console.log(attrs)
                   for (var i=0;i<attrs.length;i++)
                  {
                    //console.log(attrs.length);
                    if(attrs[i].name=='name')
                    {
                        var name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                        var requried=attrs[i].value;
                    
                    }
                  }
                   var fd={"nm":name,"vl":null,"dvl":false,"nv":requried,"vr":null,"vd":null};
                  elem.push(fd);


                }
                else if (attrs[i]['value']=='text')
                {
                    
                    //console.log(attrs)
                   for (var i=0;i<attrs.length;i++)
                  {
                    //console.log(attrs.length);
                    if(attrs[i].name=='name')
                    {
                        var name=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='requried')
                    {
                        var requried=attrs[i].value;
                        
                    }
                    if(attrs[i].name=='type')
                    {
                        var type=attrs[i].value;
                        
                    }

                    }
                      var fd={"nm":name,"vl":null,"vt":type,"dvl":false,"nv":requried,"vr":null,"vd":null};
                      elem.push(fd);

                }
                
            }

           }
        }


    }


});

parser.parse(data.toString());
console.log(elem);

if(update==true)
{
mongoupdate(elem,filename,response,frmid);
}
else
{
mongosave(elem,filename,response);
}

    // Iterate the html fragment DOM and populate name/data-component pairs
});


/* end of html parsing */
}

function mongoupdate(elem,filename,response,frmid)
{
    console.log(frmid);
    var dataval= new FormMetaModel({
            ct: { //creator
                    uID: null,//id of the user who created the service
                    oID:null,//organisation id
                    cd: null//creation date
                },
                md: {//modified
                    uID: null,//id of user who changed the service
                    oID: null,//organisation id
                    lu: null//last updated date
                },
                fd: { //form definition
                    fields: elem,
                    uri: null
                },
              ac:null, // activity
              fmn: null, //form name, default is business activity name
              uuid: filename // uuid of the html save to the storage bucket
        });
   var query = {"_id":frmid};




// Convert the Model instance to a simple object using Model's 'toObject' function
// to prevent weirdness like infinite looping...
var upsertData = dataval.toObject();
console.log(upsertData);
// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
delete upsertData._id;

// Do the upsert, which works like this: If no Contact document exists with 
// _id = contact.id, then create a new doc using upsertData.
// Otherwise, update the existing doc with upsertData
FormMetaModel.update({"_id": frmid}, upsertData, {upsert: true}, function(err){

});


// FormMetaModel.findOneAndUpdate(query, { $set: { ac: 'large' }}, {upsert:true}, function(err, doc){
//    console.log(doc);
// });
    //response.end(JSON.stringify({ formid: formid,value:"updated" }))

}

function mongosave(elem,filename,response)
{

        var dataval= new FormMetaModel({
            ct: { //creator
                    uID: null,//id of the user who created the service
                    oID:null,//organisation id
                    cd: null//creation date
                },
                md: {//modified
                    uID: null,//id of user who changed the service
                    oID: null,//organisation id
                    lu: null//last updated date
                },
                fd: { //form definition
                    fields: elem,
                    uri: null
                },
              ac:null, // activity
              fmn: null, //form name, default is business activity name
              uuid: filename // uuid of the html save to the storage bucket
        });
         console.log(dataval);
         dataval.save(function(err, thor) {
         if (err) return console.error(err);
         var formid=thor.id;
         response.end(JSON.stringify({ formid: formid }));
         })
     
}



ws.use(express.static('../static'));
ws.post('*.json',dummyData );
ws.get('*.json',dummyData );

ws.get('*', four_oh_four);

ws.listen(ws.get('port'), function(){
  console.log(" Web Server Simulator Using Node.js Running on Port "  + ws.get('port'));
});


//Helper functions
function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(invalid_resource()) + "\n");
}

function send_failure(res, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


function invalid_resource() {
    return make_error("invalid_resource",
                              "the requested resource does not exist.");
}

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

function dummyData(paramRequest, paramResponse)
{
    var startPage = './fakeEndpoints'+paramRequest.url;
    fs.readFile(
        startPage,
        function (err, contents) {
            if (err) {
                send_failure(res, err);
                return;
            }
       contents = contents.toString('utf8');
            paramResponse.writeHead(200, { "Content-Type": "application/json" });
            paramResponse.end(contents);
        }
    );
}
