
/**
 * notifications Resource
 * @author Jonnie Spratley, AppMatrix
 * @created 10/23/12
 * 
 * Resource - This is the resource object that contains all of the REST api methods for a full CRUD on a mongo notification document.
 * 
 * REST METHODS:
 * 
 * HTTP     METHOD          URL    
 * ======|==============|==============================================                         
 * GET      findAll         http://localhost:3000/notifications 
 * GET      findById        http://localhost:3000/notifications/:id 
 * POST     add             http://localhost:3000/notifications 
 * PUT      update          http://localhost:3000/notifications/:id 
 * DELETE   destroy         http://localhost:3000/notifications/:id 
 * 
 * //Resource usage
 * var notifications = require('./routes/notifications');
 * app.get('/notifications', notifications.Resource.findAll);
 * app.post('/notifications', notifications.Resource.add);
 * app.put('/notifications/:id', notifications.Resource.update);
 * app.get('/notifications/:id', notifications.Resource.findById);
 * app.post('/notifications/:id', notifications.Resource.destroy);
 */
var Resource = {
host: 'localhost',
port: 27017,
    /**
     * I enable logging or not.
     */
    debug : true, 
    /**
     * I am the interal logger.
     */
    log : function(obj) {
        if(Resource.debug) {
            console.log(obj);
        }
    },
    /**
     * I am the name of the database.
     */
    databaseName : 'notifications_db',
    /**
     * I am the name of this collection.
     */
    name : 'notifications',
    /**
     * I am the example schema for this resources.
     */
    schema : [
        {
                        id : '', 
                        title : '', 
                        body : '', 
                        uuid : '', 
                        alias : '', 
                        alert : '', 
                        badge : '0', 
                        created : '', 
                        modified : '', 
                        schedule : '', 
                        application_id : '', 
                        user_id : '', 
                        account_id : '', 
                        sent : '0', 
                        opened : '0', 
                        radius : '10', 
                        device_guids : '', 
                        type : 'push', 
                        html : '', 
                        tokens : '', 
                        appid : '', 
                        pem : '', 
                    }
    ],
    /**
     * I populate the document db with the schema.
     */
    populateDb : function() {
        db.collection(Resource.name, function(err, collection) {
            collection.insert(Resource.schema, {
                safe : true
            }, function(err, result) {
                Resource.log(result);
            });
        });
    },
    /**
     * I find all of the records
     * @param {Object} req
     * @param {Object} res
     */
    findAll : function(req, res) {
        db.collection(Resource.name, function(err, collection) {
            collection.find().toArray(function(err, items) {
                Resource.log(Resource.name + ':findAll - ' + JSON.stringify(items));
                res.send(items);
            });
        });
    },
    /**
     * I find one of the records by id.
     * @param {Object} req
     * @param {Object} res
     */
    findById : function(req, res) {
        
        var id = req.params.id;
        
        Resource.log(Resource.name + ':findById - ' + id);
        
        db.collection(Resource.name, function(err, collection) {
            collection.findOne({
                '_id' : new BSON.ObjectID(id)
            }, function(err, item) {
                res.send(item);
            });
        });
    },
    /**
     * I add a record to the collection
     * @param {Object} req
     * @param {Object} res
     */
    add : function(req, res) {
        var data = req.body;
         
        Resource.log(Resource.name + ':add - ' + JSON.stringify(data));
         
        db.collection(Resource.name, function(err, collection) {
            collection.insert(data, {
                safe : true
            }, function(err, result) {
                if(err) {
                    res.send({
                        'error' : 'An error has occurred'
                    });
                } else {
                    Resource.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        });
    },
    /**
     * I update a record in the collection
     * @param {Object} req
     * @param {Object} res
     */
    update : function(req, res) {
        var id = req.params.id;
        var data = req.body;
        Resource.log(Resource.name + ':destroy -' + id + ' - ' + JSON.stringify(data));
        db.collection(Resource.name, function(err, collection) {
            collection.update({
                '_id' : new BSON.ObjectID(id)
            }, data, {
                safe : true
            }, function(err, result) {
                if(err) {
                    res.send({
                        'error' : 'An error has occurred'
                    });
                    console.log('Error updating ' + Resource.name + ': ' + err);
                } else {
                    console.log('' + result + 'document(s) updated');
                     
                    res.send(data);
                }
            });
        });
    },
    /**
     * I delete a record in the collection.
     * @param {Object} req
     * @param {Object} res
     */
    destroy : function(req, res) {
        var id = req.params.id;
        Resource.log(Resource.name + ':destroy -' + id);
        db.collection(Resource.name, function(err, collection) {
            collection.remove({
                '_id' : new BSON.ObjectID(id)
            }, {
                safe : true
            }, function(err, result) {
                if(err) {
                    res.send({
                        'error' : 'An error has occurred'
                    });
                    Resource.log('Error updating ' + Resource.name + ': ' + err);
                } else {
                    res.send(req.body);
                }
            });
        });
    }
};


var mongo = require('mongodb'), Server = mongo.Server, Db = mongo.Db, BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {
    auto_reconnect : true
});


 
var server = new Server(Resource.host, Resource.port, {auto_reconnect : true,safe: false});
var db = new Db(Resource.databaseName, server);
/**
 * Open the database and check for collection, if none
 * then create it with the schema.
 */
db.open(function(err, db) {
    if(!err) {
        Resource.log('Connected to ' + Resource.databaseName);
        db.collection(Resource.name, {
            safe : true
        }, function(err, collection) {
            if(err) {
                Resource.log('The collection doesnt exist. creating it with sample data...');
                Resource.populateDb();
            }
        });
    }
});

//Export to public api
exports.Resource = Resource;
   
      
