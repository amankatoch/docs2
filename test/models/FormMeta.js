/**
 * Created by LBS006 on 12/19/14.
 */

module.exports = function (paramMongoose) {

    var FormMetaSchema = new paramMongoose.Schema({
        ct: { //creator
            uID: {type: paramMongoose.Schema.Types.ObjectId},//id of the user who created the service
            oID: {type: paramMongoose.Schema.Types.ObjectId},//organisation id
            cd: {type: Date, default: Date.now}//creation date
        },
        md: {//modified
            uID: {type: paramMongoose.Schema.Types.ObjectId},//id of user who changed the service
            oID: {type: paramMongoose.Schema.Types.ObjectId},//organisation id
            lu: {type: Date}//last updated date
        },
        fd: { //form definition
            fields: [{ //fields in the form
                nm: String, //field name example 'Country'
                vl: String, //field value  example 'Germany'
                vt:  {type: String, default: "String"},
                dvl: String, //field default value 'China'
                nv: {type: Boolean, default: false}, //need verified example false
                vr: Boolean, // verification result example true
                vd: Date //verified date example 2015/02/15
            }],
            uri: String
        },
      ac:{type:paramMongoose.Schema.Types.ObjectId, ref: 'Activity'}, // activity
      fmn: String, //form name, default is business activity name
      uuid: String // uuid of the html save to the storage bucket

    });
    return FormMetaSchema;
}


//fd: { //form definition
//    fields: [
//        { //fields in the form
//            nm: 'lastname', //field name example 'Country'
//            vl: null, //field value  example 'Germany'
//            dvl: 'Adda', //field default value 'China'
//            nv: true, //need verified example false
//            vr: null, // verification result example true
//            vd: null//verified date example 2015/02/15
//        },
//        { //fields in the form
//            nm: 'firstname', //field name example 'Country'
//            vl: null, //field value  example 'Germany'
//            dvl: 'John', //field default value 'China'
//            nv: true, //need verified example false
//            vr: null, // verification result example true
//            vd: null//verified date example 2015/02/15
//        },
//        { //fields in the form
//            nm: 'gender', //field name example 'Country'
//            op: ['Male','Female'],
//            vl: null, //field value  example 'Germany'
//            dvl: null, //field default value 'China'
//            nv: false, //need verified example false
//            vr: null, // verification result example true
//            vd: null//verified date example 2015/02/15
//        }
//    ]
//
//}
//

//var FormMeta = mongoose.model('FormMeta', formMetaSchema);
//
//// Each form submitted from the designer results in an instance of the FormMeta model:
//var form1meta = new FormMeta({
//    name:'form1',
//    uuid:'01234567-0123-0123-0123-0123456789AB',
//    author: loggedInUser._id
//});
//form1meta.save(function(err){
//    // TODO: handle errors/retry
//})
//
//// A new Mongoose schema corresponding to the data-component/name pairs in that form.
//
////For example, using local file:
////var fs = require("fs");
//fs.readFile("app.html", function(err,data) {
//    // TODO: Store the received HTML on the correct web-server (same algorithm as the images)
//
//    var Parser = require('parse5').Parser;
//    var parser = new Parser();
//    var fragment = parser.parseFragment(data.toString());
//    console.log(fragment);
//    // Iterate the html fragment DOM and populate name/data-component pairs
//});
//
//// In this case, the app.html would result in the following schema:
//var form1schema = mongoose.Schema({
//    "My checkbox": Boolean,
//    "My text": String,
//    "My textarea": String,
//    "My radio": String,
//    "My dropdown": String,
//    "My photo": {
//        data: Buffer
//        // Which of the parameters are actually part of a filled in form?
//    }
//});
//mongoose.model('Form1', form1schema);
//
//// When the user submits the filled form, create an instance of the form's model from the POST data
//var Form1 = mongoose.model('Form1');
//var form1_for_userX = new Form1({
//    "My checkbox": true,
//    "My text": "Text value",
//    "My textarea": "Textarea value",
//    "My radio": "Radio value2",
//    "My dropdown": "Dropdown value2",
//    "My photo": { data: new Buffer("from data-value", 'base64') }
//});
//
//// Save the form to MongoDB
//form1_for_userX.save(function(err){
//    // TODO: handle errors/retry
//});

