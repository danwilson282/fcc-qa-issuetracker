'use strict';
let mongoose=require('mongoose');
const issueSchema = new mongoose.Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true },
  created_on: Date,
  updated_on: Date,
  created_by: {type: String, required: true},
  assigned_to: String,
  open: {type: Boolean, default: true},
  status_text: String
});

module.exports = function (app, ) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const issue = mongoose.model("Issue", issueSchema, project);
      const query = req.query
      issue.find(query).then(data =>{
        res.json(data)
      })
      
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const issue = mongoose.model("Issue", issueSchema, project);
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({error: 'required field(s) missing' })
      }
      else{
        var newIssue = new issue({
          issue_title: req.body.issue_title || "",
          issue_text: req.body.issue_text || "",
          created_on: Date.now(),
          updated_on: Date.now(),
          created_by: req.body.created_by || "",
          assigned_to: req.body.assigned_to || "",
          open: true,
          status_text: req.body.status_text || ""
        })
        newIssue.save().then(ret => {
          res.json(ret)
        })
      }
      
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const issue = mongoose.model("Issue", issueSchema, project);
      if (!req.body._id){
        res.json({ error: 'missing _id' })
      }
      else{
        let updateArray = {};
        if (req.body.issue_title){
          updateArray.issue_title=req.body.issue_title
        }
        if (req.body.issue_text){
          updateArray.issue_text=req.body.issue_text
        }
        if (req.body.created_by){
          updateArray.created_by=req.body.created_by
        }
        if (req.body.assigned_to){
          updateArray.assigned_to=req.body.assigned_to
        }
        if (req.body.status_text){
          updateArray.status_text=req.body.status_text
        }
        if (req.body.open){
          updateArray.open=req.body.open
        }
        if (Object.keys(updateArray).length === 0){
          res.json({ error: 'no update field(s) sent', '_id': req.body._id })
        }
        else{
          updateArray.updated_on=Date.now()
          
          issue.findByIdAndUpdate(req.body._id, updateArray)
        .then(data =>{
          res.send({
            result: 'successfully updated',
            _id: data._id
          })
          return;
        })
        .catch(err =>{
          res.send({
            error: 'could not update',
            _id: req.body._id
          })
        })
        
        }
        
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const issue = mongoose.model("Issue", issueSchema, project);
      if (!req.body._id){
        res.json({ error: 'missing _id' })
      }
      else{
        issue.findByIdAndDelete(req.body._id)
        .then(data =>{
          res.send({
            result: 'successfully deleted',
            _id: data._id
          })
          return;
        })
        .catch(err =>{
          res.send({
            error: 'could not delete',
            _id: req.body._id
          })
        })
      }
      
    
    });
    
};
