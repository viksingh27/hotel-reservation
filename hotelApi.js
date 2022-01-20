const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
dotEnv.config();
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoUrl = 'mongodb+srv://hotel:hotel@cluster1.cehbi.mongodb.net/hotel?retryWrites=true&w=majority'
var port = process.env.PORT || 8125;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())
var db;
const moment = require('moment');
const { query } = require('express');
console.log(moment().format('MM/DD/YYYY'));


app.get('/', (req,res)=>{
    res.send("Hello.....")
})

//get all rooms 

app.get('/api/rooms', (req,res)=>{
    db.collection('rooms').find().toArray((err,result) =>{
        if(err) throw err
        res.send(result);
    })
})

// get all rooms with caegory -1 

app.get('/api/rooms:id' , (req, res) =>{
    var id = parseInt(req.params.id);
    db.collection('rooms').find({"category_id" : id}).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//get room with particular id


app.get('/api/rooms/:id' , (req, res) =>{
    var id = parseInt(req.params.id);
    db.collection('rooms').find({"id" : id}).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get all multipurpose halls on the basis of name

app.get ('/api/halls/:name', (req,res)=>{
    const name = req.params.name;
    db.collection('halls').find({"room_name" : name}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get all services 

app.get('/api/services',(req,res)=>{
    db.collection('services').find().toArray((err,result)=>{
        if(err) throw err
        res.send(result);
    })
})

// get with particular amenities ac

app.get('/api/amenities/ac', (req, res)=>{
    var query = {};
    console.log(req.query);
    if(req.query.ac === "yes")
    {
        query = {"amenities.air_condition":(req.query.ac)}
    }
    else if(req.query.ac === "no"){
        query = {"amenities.air_condition":(req.query.ac)}
    }
   db.collection('rooms').find(query).toArray((err,result)=>{
       if(err) throw err
       res.send(result);
   })
})

// get rooms with particular amenities wifi

app.get('/api/amenities/wifi' , (req,res)=>{
    var query = {}
    console.log(req.query);
    if(req.query.wifi === "yes")
    {
        query = {"amenities.wifi":(req.query.wifi)}
    }
    else if(req.query.wifi === "no")
    {
        query = {"amenities.wifi":(req.query.wifi)}
    }
    db.collection('rooms').find(query).toArray((err,result)=>{
        if(err) throw err
        res.send(result);
    })
})

//get rooms with particular amenities bar

app.get('/api/amenities/bar' , (req,res)=>{
    var query = {};
    console.log(req.query);
    if(req.query.bar === "yes")
    {
        query = {"amenities.mini_bar":(req.query.bar)}
    }
    else if(req.query.bar === "no")
    {
        query = {"amenities.mini_bar": (req.query.bar)}
    }
    db.collection('rooms').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get rooms with particular amenities pickup

app.get('/api/amenities/pickup' , (req,res)=>{
    var query = {};
    console.log(req.query);
    if(req.query.pickup === "yes")
    {
        query = {"amenities.complementry_pickup":(req.query.pickup)}
    }
    else if(req.query.pickup === "no")
    {
        query = {"amenities.complementry_pickup": (req.query.pickup)}
    }
    db.collection('rooms').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get all multipurpose hall

app.get('/api/halls' , (req,res)=>{

    db.collection('halls').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get multipurpose hall on the basis of capacity requirements

app.get('/api/halls/capacity' , (req,res)=>{
    var query = {}
    console.log(req.query)
    if(req.query.cap < "50" || req.query.cap === "50")
    {
        query = {"capacity":Number(req.query.cap)}
    }
    else if(req.query.cap > "50" || req.query.cap <= "100")
    {
        query = {"capacity":Number(req.query.cap)}
    }
    else if(req.query.cap > "100")
    {
        query = {"capacity":Number(req.query.cap)}
    }
    db.collection('halls').find(query).toArray((err,result)=>{
        if(err)throw err;
        res.send(result);
    })
})


// filters for rooms selections 

app.get('/api/filter/:category_id', (req,res)=>{
    var param = Number(req.params.category_id)
    var query = {"category_id":param}
    var cap = Number(req.query.capacity)
    if(req.query.name)
    {
        query = {"category_id":param , "room_name":(req.query.name)}
    }
    if(req.query.wifi === "yes")
    {
        query = {"category_id":param , "amenities.wifi":(req.query.wifi)}
    }
    else if(req.query.wifi === "no")
    {
        query = {"category_id":param , "amenities.wifi":(req.query.wifi)}
    }
    else if(req.query.ac === "yes")
    {
        query = {"category_id":param , "amenities.air_condition":(req.query.ac)}
    }
    else if(req.query.ac === "no"){
    
        query = {"category_id":param , "amenities.air_condition":(req.query.ac)}
    }
    else if(req.query.bed)
    {
        query = {"category_id":param , "bed": (req.query.bed)}
    }
//     else if(req.query.kingBed === "king")
//     {
//         query = {"category_id":param ,"bed":"King size bed"}
//     }
//     else if((req.query.queenBed === "queen"))
//     {
//         query = {"category_id":param ,"bed":"Queen size bed"}
//     }
    else if((req.query.lcost) && (req.query.hcost))
    {
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query = {"category_id":param , $and:[{price:{$gt:lcost,$lt:hcost}}]}
    }
    else if((req.query.capacity <="1" )|| (req.query.capacity >="2") || (req.query.capacity >"3") || (req.query.capacity > "5")) 
    {
        
        query = {"category_id":param , "capacity":cap}
        console.log(query);
    }
    // else if(req.query.capacity === "2")
    // {
    //     query = {"category_id":param ,"bed":"King size bed"}
    // }
    // else if((req.query.queenBed === "queen"))
    // {
    //     query = {"category_id":param ,"bed":"Queen size bed"}
    // }
    db.collection('rooms').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get method for booking


app.get('/api/booked-rooms', (req,res)=>{
    db.collection('booked_room').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// post mehtod for booking room

app.post('/api/bookedRooms' , (req,res)=>{
        console.log(req.body);
        db.collection('booked_room').insertMany(req.body,(err,result)=>{
            if(err) throw err;
            res.send("Congratulations Rooms Booked !!");
        })
})


mongoClient.connect(mongoUrl , (err, client) =>{
    if(err){
        console.error("Error While Connecting");
    }
        db = client.db('hotel');
        app.listen(port ,()=>{
            console.log(`Listening on ${port}`)
        });
})





