 const { Sequelize, Model, DataTypes } = require('sequelize');
  const path = require('path');
    
        const sequelize = new Sequelize("Company", "root", "P@ssw0rd_", {
            host: 'localhost',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            define: {
                timestamps: false // supressing the TimeStamp generated by ORM
            }
        });
  
        // @ts-ignore
        const user = require(path.join(__dirname, './../models/Users'))( sequelize, Sequelize.DataTypes);
    
 class UserDal {    
    async createUser(req,resp){
        let newuser = {
            Id: req.body.Id,
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email
        };
        console.log(JSON.stringify(newuser));

     
        await sequelize.sync({
                force: false  
            });
         
        const find  = await user.findOne({where:{UserName:newuser.UserName}});    
        if(find!==null) // conflict
            return resp.status(409).send({response:`Sorry!! the ${newuser.UserName} is already available`});

        const created = await  user.create(newuser);
        
        return resp.status(200).send({response:created});
    }

    async authUser(req,resp){
        let userInfo =  {
            UserName: req.body.UserName,
            Password: req.body.Password
        };
        await sequelize.sync({
            force: false  
        });
        const find  = await user.findOne({where:{UserName:userInfo.UserName}});
        console.log(JSON.stringify(find));

        if(find === null) // not found
           return resp.status(404).send({response:`Sorry!! the ${userInfo.UserName} is not found`});
        if(find.Password.trim() !==userInfo.Password.trim())  // unauthorized
            return resp.status(401).send({response:`Sorry!! the password is incorrect`});
        return resp.status(200).send({response:find});
    }
}

module.exports = UserDal;
