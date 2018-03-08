Switch to current project directory

Input Code below in terminal:

mongoimport --db redisHW --collection redisHW --drop --file lab5.json --jsonArray

**/api/people/history**
return last 20 users in the cache from the recently viewed list

**/api/people/:id**
1) Check if the user has a cache entry in redis. If so, render the result from that cache entry

2) If not, query the data module for the person and fail the request if they are not found, or send JSON and cache the result if they are found.