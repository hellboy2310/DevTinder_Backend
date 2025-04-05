const adminAuth = (req,res,next) => {
    const token = 'xyz';
    if(token !== 'xyz'){
        res.send({
            message: "Unauthorized user"
        })
    }
    else{
        next();
    }
}

const userAuth = (req,res,next) => {
    const token = 'abc';
    if(token != 'abc') {
        res.send({
            message:'Unauthorized user'
        })
    }
    else{
        next();
    }
}
module.exports = {
    adminAuth,
    userAuth
}

