const mongoCollections = require("./mongoCollections");
const redisHW = mongoCollections.redisHW;


 getById=(id)=>{
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const redisHWCollection = await redisHW();
        const person = await redisHWCollection.findOne({ id: id });
        if (person) {
            resolve(person);
        } else {
            reject(new Error("something went wrong"));
        }}, 5000);
      });
}
module.exports={
    getById:getById
}
