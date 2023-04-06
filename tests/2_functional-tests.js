const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
let toDelete;
chai.use(chaiHttp);

suite('Functional Tests', function() {
    //Create an issue with every field: POST request to /api/issues/{project}
    test('Create an issue with every field', function(done){
        chai
            .request(server)
            .post('/api/issues/tests')
            .set('content-type', 'application/json')
            .send({
                issue_title: "Testing",
                issue_text: "Test2",
                created_by: "Dan",
                assigned_to: "Daniel",
                status_text: "Test3"
            })
            .end(function (err,res){
                assert.equal(res.status, 200);
                toDelete=res.body._id
                assert.equal(res.body.issue_title, "Testing");
                assert.equal(res.body.issue_text, "Test2");
                assert.equal(res.body.created_by, "Dan");
                assert.equal(res.body.assigned_to, "Daniel");
                assert.equal(res.body.status_text, "Test3");
                done();
            })
        })
    //Create an issue with only required fields: POST request to /api/issues/{project}
    test('Create an issue with only required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/tests')
            .set('content-type', 'application/json')
            .send({
                issue_title: "Testing",
                issue_text: "Test2",
                created_by: "Dan"
            })
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, "Testing");
                assert.equal(res.body.issue_text, "Test2");
                assert.equal(res.body.created_by, "Dan");
                done();
            })
        })
    //Create an issue with missing required fields: POST request to /api/issues/{project}
    test('Create an issue with missing required fields', function(done){
        chai
            .request(server)
            .post('/api/issues/tests')
            .set('content-type', 'application/json')
            .send({
                issue_title: "Testing",
                issue_text: "Test2",
            })
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "required field(s) missing");
                done();
            })
        })
    //View issues on a project: GET request to /api/issues/{project}
    test('View issues on a project', function(done){
        chai
            .request(server)
            .get('/api/issues/tests')
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.isAbove(res.body.length, 2);
                done();
            })
        })
    //View issues on a project with one filter: GET request to /api/issues/{project}
    test('View issues on a project with one filter', function(done){
        chai
            .request(server)
            .get('/api/issues/tests')
            .query({
                issue_title: "Testing"
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.isAbove(res.body.length, 1);
                done();
            })
        })
    //View issues on a project with multiple filters: GET request to /api/issues/{project}
    test('View issues on a project with multiple filters', function(done){
        chai
            .request(server)
            .get('/api/issues/tests')
            .query({
                issue_title: "Testing",
                created_by: "Dan"
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.isAbove(res.body.length, 1);
                done();
            })
        })
    //Update one field on an issue: PUT request to /api/issues/{project}
    test('Update one field on an issue', function(done){
        chai
            .request(server)
            .put('/api/issues/tests')
            .send({
                _id: "642ee15b3dd1a1cf1d952dac",
                created_by: "Dave"
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, "642ee15b3dd1a1cf1d952dac");
                assert.equal(res.body.result, "successfully updated");
                done();
            })
        })
    //Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('Update multiple fields on an issue', function(done){
        chai
            .request(server)
            .put('/api/issues/tests')
            .send({
                _id: "642ee15b3dd1a1cf1d952dac",
                issue_title: "Testing changed",
                created_by: "Dave",

            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, "642ee15b3dd1a1cf1d952dac");
                assert.equal(res.body.result, "successfully updated");
                done();
            })
        })
    //Update an issue with missing _id: PUT request to /api/issues/{project}
    test('Update an issue with missing _id', function(done){
        chai
            .request(server)
            .put('/api/issues/tests')
            .send({
                issue_title: "Testing changed",
                created_by: "Dave",

            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");
                done();
            })
        })
    //Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('Update an issue with no fields to update', function(done){
        chai
            .request(server)
            .put('/api/issues/tests')
            .send({
                _id: "642ee15b3dd1a1cf1d952dac"

            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, "642ee15b3dd1a1cf1d952dac");
                assert.equal(res.body.error, "no update field(s) sent");
                done();
            })
        })
    //Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('Update an issue with an invalid _id', function(done){
        chai
            .request(server)
            .put('/api/issues/tests')
            .send({
                _id: "1",
                issue_title: "Testing changed",
                created_by: "Dave",
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, "1");
                assert.equal(res.body.error, "could not update");
                done();
            })
        })
    //Delete an issue: DELETE request to /api/issues/{project}
    test('Delete an issue', function(done){
        chai
            .request(server)
            .delete('/api/issues/tests')
            .send({
                _id: toDelete
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, toDelete);
                assert.equal(res.body.result, "successfully deleted");
                done();
            })
        })
    //Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('Delete an issue with an invalid _id', function(done){
        chai
            .request(server)
            .delete('/api/issues/tests')
            .send({
                _id: "1"
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body._id, "1");
                assert.equal(res.body.error, "could not delete");
                done();
            })
        })
    //Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('Delete an issue with missing _id', function(done){
        chai
            .request(server)
            .delete('/api/issues/tests')
            .send({
                _id: ""
            })
            .set('content-type', 'application/json')
            .end(function (err,res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");
                done();
            })
        })
});
