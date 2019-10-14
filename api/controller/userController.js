const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.user_signup = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1 ){
            return res.status(409).json({
                message:'Mail exists'
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        email:req.body.email,
                        password:hash
                    });
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'User Created'
                        });
                    })
                    .catch(err =>{
                        console.log(err)
                        return res.status(401).json({
                            message:'Auth failed'
                        })
                    })
                }
            })
        }
    });
}

exports.user_signin = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(err){
                return res.status(404).json({
                    message:'Auth failed'
                });
            }
            if(result){
              const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                },
               'secret',
                {
                    expiresIn:"1hr"
                }
                );
                return res.status(200).json({
                    message:'User login successfully',
                    token:token
                })
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.user_delete = (req,res,next)=>{
    User.delete({_id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'User delete'
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}