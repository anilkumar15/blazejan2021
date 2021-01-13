// logic for Promise based External calls
// 1. load q
let q = require('q');
// 2. load http
let http = require('http');

// 3. create a module that will make an external calls

module.exports = {
    // this function will accept the serverOptions to
    // call the REST API and receive the data
    getData:function(options){
        // 3a. create an instance of the q deferrer
        // this will block the exeuction  when this method is 
        // accessed and return the Promise object
        let defer = q.defer();
        // 3b. a request object that will contain
        // the request information
        let request;
        // 3c. the responseObject, represents the the response
        // received
        let responseObject;
        if(!options){
            defer.reject('Server Information is not provided');
        } else {
            // 3d . initiate a http request to externally hosted application
            request = http.request(options,(response)=>{
                // 3e. start receiving the data as stream
                response.on('data', (data)=>{
                    responseObject+= data;
                  //  console.log(`data = ${JSON.stringify(responseObject)}`);
                });
                // 3f. one with the data receive and process it 
                // and end the call
                response.on('end',()=>{
                    // use exception handling to make sure
                    // that the data receiving is successful
                    try{
                        // read the data and resolve it
                        defer.resolve(responseObject);    
                    }catch(ex){
                        // if error occured the reject it
                        defer.reject(`Error Occured ${ex.message}`);
                    }
                });
            });
        }
        // end the request
        request.end();
        // return the promise   
        return defer.promise;
    }
};