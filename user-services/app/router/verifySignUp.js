const db = require('../config/db.config.js');
const config = require('../config/config.js');
const ROLEs = config.ROLEs; 
const User = db.user;
const Role = db.role;

checkDuplicateUserNameOrEmail = (req, res, next) => {

		// -> Check Email is already in use
		User.findOne({ 
			where: {
				email: req.body.email
			} 
		}).then(user => {
			if(user){
				return res.status(201).json({message:' Email is already in use!'});
				
			}
				
			next();
		});

}

/*  checkRolesExisted = (req, res, next) => {	
	for(let i=0; i<req.body.roles.length; i++){
		if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
			res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
			return;
		}
	}
	next();
}  */

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
//signUpVerify.checkRolesExisted = checkRolesExisted; 

module.exports = signUpVerify;