# Express-API
Practice to build REST APIs with Node.js Express

## The other version
As you can see, there are an older version providing the steps of how I learnt node.js. </br>
> *v1. just node.js </br>
> v2(master). change anonymous function to arrow function expression and promisify *pool.query* </br>*

### JSON FORMAT
Data is received and sent in json format.
```json
{ 
  "account": "aa",
  "phone": "22",
  "birthday": "1999-12-11 16:00:00 ",
  "address": "abc road",
  "data_added_time": "2019-08-29 06:51:00",
  "last_modified_time": "2019-08-29 06:51:00" 
}
```

### Database
#### MySQL is used. 

1. Account: key, required
2. Phone: not required
3. Birthday: required
4. Address: required
5. DataAdded: required
6. DataLastUpdated: required


### Reference
[How to build a project](https://dotblogs.com.tw/tingi/2018/11/04/152907) </br>
[Create a MySQL Database Middleware with Node.js and Async/Await](https://medium.com/@mhagemann/create-a-mysql-database-middleware-with-node-js-8-and-async-await-6984a09d49f4)
