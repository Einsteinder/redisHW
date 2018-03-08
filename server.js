const bluebird = require("bluebird");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const dataModule =require("./dataModule")
const flat = require("flat");
var userRouter = express.Router();




bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use('/api/people',userRouter)


userRouter.get("/:id", async (req, res, next) => {

    let cacheForPeopleExists = await client.hgetallAsync(req.params.id);
    if (cacheForPeopleExists) {
      res.send({id:Number(cacheForPeopleExists.id),
        firs_tname:cacheForPeopleExists.first_name,
        last_name:cacheForPeopleExists.last_name,
        email:cacheForPeopleExists.email,
        gender:cacheForPeopleExists.gender,
        ip_address:cacheForPeopleExists.ip_address
      });
      let cachedForPeopleVisit = await client.lpushAsync("peopleVisit",JSON.stringify(
        {id:Number(cacheForPeopleExists.id),
        firs_tname:cacheForPeopleExists.first_name,
        last_name:cacheForPeopleExists.last_name,
        email:cacheForPeopleExists.email,
        gender:cacheForPeopleExists.gender,
        ip_address:cacheForPeopleExists.ip_address
      }));

    } else {
      next();
    }
  });
  userRouter.get("/:id", async (req, res) => {
    if (req.params.id==="history") 
    {res.redirect("/api/people/")}
    else{
    let result = dataModule.getById(Number(req.params.id));
    result = await Promise.resolve(result)
    deletObjId = {id:Number(result.id),
      firs_tname:result.first_name,
      last_name:result.last_name,
      email:result.email,
      gender:result.gender,
      ip_address:result.ip_address
    }
    res.json(deletObjId)
    let flatBio = flat(result)
    let cachedForPeople = await client.hmsetAsync(Number(req.params.id),flatBio);
    let cachedForPeopleVisit = await client.lpushAsync("peopleVisit",JSON.stringify(deletObjId));
   } });
  userRouter.get("/", async(req,res)=>{
  let cacheForPeopleVisited = await client.lrangeAsync("peopleVisit",0,-1);
  var objs =[]
  for(let i =0;i<cacheForPeopleVisited.length;i++){
    if(i>19) break
    objs.push(JSON.parse(cacheForPeopleVisited[i]))
  }
  res.send(objs)
})
  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });