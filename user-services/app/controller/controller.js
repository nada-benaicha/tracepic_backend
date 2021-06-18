const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Profil = db.profil
const Personnel = db.personnel
const Machine = db.machine

var sequelize = require('sequelize');
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const moment = require('moment');
const { ethers } = require("ethers");
const provider = new ethers.getDefaultProvider('rinkeby');
var AWS = require('aws-sdk');
const fs = require('fs');
var request = require('request');
AWS.config.update({
	accessKeyId: "AKIA53PPVTHR766DPLM6",
	secretAccessKey: "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",
	region: "eu-west-3"
});
var s3 = new AWS.S3({ params: { Bucket: 'goopark', Prefix: "imageFileTracepic" } });



function sendEmailInscription (  email , password , fullName) {
	let transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
			port: 2525,
			ssl: false,
			tls: true,
			auth: {
				user: '4a9304c9150546',
				pass: 'f87977ff84d98d'
			}
	});
	CodeEmailVerification = crypto.randomBytes(6).toString('hex');
	User.update({
		CodeEmailVerification
	},
		{
			where: {
				email: email
			}
		})																																																															
	link = `http://127.0.0.1:3000/confirm/` + CodeEmailVerification;
	var mailOptions = {
		from: "<Tracepic@trimakus.com>",
		to: email,
		subject: "Tracepic : confirmation inscription",																	
		html: `
		<html style="margin: 0; padding: 0;">
			<head>
				<title>Tracepic</title>
			</head>
			<body style="margin: 0; padding: 0;">
				<table class="table" cellpadding="0" cellspacing="0" style="background-color: #eee; empty-cells: hide; margin: 0 auto; padding: 0; width: 800px;">
					<tr>
						<td class="red" style="background-color: #424a68; margin: 0 auto;">
							<h3 style="box-sizing: border-box; color: white; font-family: Helvetica, Arial, sans-serif; letter-spacing: 0.5px; line-height: 1.4; margin: 0; padding: 15px 25px;">Bienvenue sur Trace Pic  </h3></td>
							<td class="red" style="background-color: blue ; margin: 0 auto;">
						</td>
					</tr>
				</table>
			</body>
			<div style="margin: 10px auto; padding-left: 32px;">
				<p style="color: black;">Bonjour ${fullName},</p>
				<p style="color: black;"> Merci d'avoir choisi tracepic. Nous sommes très heureux de vous compter parmi nous !</p>	
				<p style="color: black;">Pour finalisez votre inscription, cliquez sur le lien ci-dessous.</p>
				<a href="${link}">Cliquez ici pour vérifier </a>
				<p style="color: black;"><b>Votre identifiant : </b>  "${email}"</p>
				<p style="color: black;"><b>Votre mot de passe : </b>  "${password}"</p>

			</div>
			<div style="margin: 10px auto; padding-left: 32px;"> 
				<p style="margin :0px">&nbsp;</p>
				<p ><b>Une question? Besoin d'aide?</b></p>
				<p style="color: black;">Veuillez écrire à notre équipe support : contact@tracepic.com</p>
				<p style="color: black;">Merci et bonne journée !	</p>
				<p style="color: black;">www.tracepic.com</p>
			</div>
		</html>
		`,
	}
	transport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			//res.end("error");
		} else {
			console.log("Message sent: Success");
			//res.end("sent");
		}
	});

}



exports.signup = async function (req, res) {
	const { nomResponsable, nomLaboratoire, email, pays  , role ,mobile, password, fullName} = req.body;
	const dateInscription = moment().format('YYYY-MM-DD')
	if ( !email  || !pays  || !role || !password || !mobile) {
		return res.status(400).json({ message: 'Data misssing,Provide email and password!' });
	}
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (user) {
			return res.status(211).send({ message: ' Email is already in use!' });
		}
	 	else { 
		try {
			if ( role == "labo") {
				const hash = bcrypt.hashSync(req.body.password, 10);
				let user = User.create(
					Object.assign(req.body, {nomResponsable ,mobile ,nomLaboratoire, email, pays,role , dateInscription , password :hash })
				).then(userCreate => {
						Profil.create({
							rcs : null,
							presentation : null,
							siteWeb : null,
							mailContact : null,
							adresseLabo : null,
							codePostale : null
						}).then(profil => {
							userCreate.addProfils(profil).then((prof) => {
						
					User.findOne({
						where: {
							email: req.body.email
						}
					}).then(async user => {
						await sendEmailInscription(email , password , nomLaboratoire)
						res.status(200).send({  profilId : profil.id});
					})
				});
			})
		})
			}
			else if (role == "client") {
				const hash = bcrypt.hashSync(req.body.password, 10);
				let user = User.create(
					Object.assign(req.body, {mobile ,fullName, email, pays,role , dateInscription , password :hash })
				).then(async userCreate => {
					await sendEmailInscription(email , password , fullName)

					User.findOne({
						where: {
							email: req.body.email
						}
					}).then(async user => {

						let RandomWallet = new ethers.Wallet.createRandom(provider);
						console.log(user.CodeEmailVerification)
						var walletCrypted =  RandomWallet.encrypt(user.CodeEmailVerification );
						walletCrypted.then(function(result){
						wallet = result; // Now you can use res everywhere
						uploadJsonFile(wallet , user.id)
						res.status(200).send({ message: 'Successfully update' });

					});
					})
				});
			}
		} catch (err) {
			return res.status(400).send({ message: "Error -> " + err });;
		}
	}
});
}






exports.verify = function (req, res, next) {
	try {
		const CodeEmailVerification = req.body.CodeEmailVerification;

		User.findOne({
			where: {
				CodeEmailVerification: CodeEmailVerification
			}
		}).then(user => {
			
				if (!user) {
					return res.status(208).send({ message: 'User Not Found.' });
					// res.redirect('/users/verify');
				}
				if (user.role == "labo"){
				user.isVerified = "1";
				user.save();
				res.status(200).send({message : "Email is been Successfully verified"});
				//res.redirect("/signin")
			}
			else {
				user.isVerified = "2";
				user.save();
				res.status(200).send({message : "Email is been Successfully verified"});
			}
		})
	}
	catch (error) {
		next(error);
	}
}

function uploadJsonFile(wallet , userId) {
	var name = 'wallet-' + Math.floor(10000000000 + Math.random() * 90000000000) + ".json";
		s3.putObject({
			Bucket: 'goopark',
			ACL: 'public-read',
			Key: `imageFileTracepic/${name}`,
			Body: wallet,
			ContentType: "application/json"},
			function (err,data) {
				if (err) {
					console.log(err);
					console.log('Error uploading data: ', data);
				} else {
					User.update({
						walletUri: `${name}`
					}, {
					where: {
						id: userId
					}
					}).then(() => {
						console.log("updateee")
					})
				}
			}
		  );
		  
}


function sendEmailValidation (  email  , fullName) {
	let transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
			port: 2525,
			ssl: false,
			tls: true,
			auth: {
				user: '4a9304c9150546',
				pass: 'f87977ff84d98d'
			}
	});
																																																													
	var mailOptions = {
		from: "<Tracepic@trimakus.com>",
		to: email,
		subject: "Tracepic : Validation admin",																	
		html: `
		<html style="margin: 0; padding: 0;">
			<head>
				<title>Tracepic</title>
			</head>
			<body style="margin: 0; padding: 0;">
				<table class="table" cellpadding="0" cellspacing="0" style="background-color: #eee; empty-cells: hide; margin: 0 auto; padding: 0; width: 800px;">
					<tr>
						<td class="red" style="background-color: #424a68; margin: 0 auto;">
							<h3 style="box-sizing: border-box; color: white; font-family: Helvetica, Arial, sans-serif; letter-spacing: 0.5px; line-height: 1.4; margin: 0; padding: 15px 25px;">Bienvenue sur Trace Pic  </h3></td>
							<td class="red" style="background-color: blue ; margin: 0 auto;">
						</td>
					</tr>
				</table>
			</body>
			<div style="margin: 10px auto; padding-left: 32px;">
				<p style="color: black;">Bonjour ${fullName},</p>
				<p style="color: black;"> Merci d'avoir choisi tracepic. Nous sommes très heureux de vous compter parmi nous !</p>	
				<p style="color: black;">votre compte à été validé avec succès .</p>
			</div>
			<div style="margin: 10px auto; padding-left: 32px;"> 
				<p style="margin :0px">&nbsp;</p>
				<p ><b>Une question? Besoin d'aide?</b></p>
				<p style="color: black;">Veuillez écrire à notre équipe support : contact@tracepic.com</p>
				<p style="color: black;">Merci et bonne journée !	</p>
				<p style="color: black;">www.tracepic.com</p>
				
			</div>
		</html>
		`,
	}
	transport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			//res.end("error");
		} else {
			console.log("Message sent: Success");
			//res.end("sent");
		}
	});

}


exports.ValidationAdmin = (req, res) => {
	const userId = req.body.userId
try { 
	User.findOne({
		where: {
			id: userId
		}
	}).then(user => {
		if (user.isVerified == "1" ){
			
				let RandomWallet = new ethers.Wallet.createRandom(provider);
				var walletCrypted =  RandomWallet.encrypt(user.CodeEmailVerification );
				walletCrypted.then(function(result , err){
					if (result){
						User.update({
							isVerified: '2'
						}, {
							where: {
								id: userId
							}
						}).then( response => {
						wallet = result; // Now you can use res everywhere
						uploadJsonFile(wallet , userId)
						console.log(user.nomLaboratoire)
						sendEmailValidation (user.email  , user.nomLaboratoire) 
						res.status(200).send({ message: 'Successfully update' });
						})
					}
					else if (err)  {
						User.update({
							isVerified: '5' // problem lors de la creation du wallet
						}, {
							where: {
								id: userId
							}
						}).then( response => {
							res.status(411).send({ message: 'error lors la creation du wallet' });

						})
					}
				});
		}
		else if (user.isVerified== "2"){
			res.status(401).send({message : "user valide"})
		}
		else {
			res.status(401).send({message : "user not valide"})
		}
})
}
catch (error) {
	next(error);
}
}
exports.getwalletFileAndDecrypt = (req,res) => {
	const userId = req.body.userId
	User.findOne({
		where: {
			id: userId
		}
	}).then(user => {

		request('https://goopark.s3.eu-west-3.amazonaws.com/imageFileTracepic/wallet-27050573944.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
	  console.log(body)

	 var waletDecrypt = ethers.Wallet.fromEncryptedJson( body , user.CodeEmailVerification )
	 waletDecrypt.then(function(result){
		 resDec = result; // Now you can use res everywhere
		 console.log(resDec)
	});         // successful response
  }
})
	})
	  
}

exports.getAccount = (req,res) => {
	try { 
const privateKey = req.body.privateKey
var wallet = new ethers.Wallet(privateKey, provider);
res.status(200).send({address : wallet.address})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}

}

exports.signin = async (req, res) => {

	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (!user) {
			return res.status(209).send({ message: 'User Not Found.' });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(210).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		// Make sure the user has been verified
		if (user.isVerified == "0") return res.status(211).send({ type: 'not-verified', msg: 'Your account has not been verified.' });
		else if (user.isVerified == "1") return res.status(212).send({ type: 'not-verified', msg: 'Your account has  been verified and not valide by admin.' });
		var date = new Date();
		var token = jwt.sign({ id: user.id }, config.secret, {
		});
		var expire = moment().valueOf() + 5184000

		User.update({
			token: token,
			ExpiredIn: expire, 
		}, {
			where: {
				email: req.body.email
			}
		}).then(response => {
			//res.send({ message: 'Successfully update' });

			if (moment().valueOf > expire) {
				User.update({
					token: "",
				}, {
					where: {
						email: req.body.email
					}
				}).then(response => {
					res.status(213).json({ message: "the token has expired" })
				})
			} else {
	 			if (user.role == "client" ) {
					res.status(200).json({
						id: user.id,
						pays : user.pays,
						expiredIn: user.ExpiredIn,
						email: user.email,
						token: token,
						role: user.role,
						mobile : user.mobile ,fullName : user.fullName
					});
				 }
				 else if (user.role == "personnel") {
					res.status(200).json({
						id: user.id,
						expiredIn: user.ExpiredIn,
						email: user.email,
						token: token,
						role: user.role,
					});
				 }
				 else { 
				Profil.findOne({
					where: {userId : user.id}}).then(profil => {
				res.status(200).json({
					id: user.id,
					profilId : profil.id,
					nomResponsable: user.nomResponsable,
					nomLaboratoire: user.nomLaboratoire,
					pays : user.pays,
					expiredIn: user.ExpiredIn,
					email: user.email,
					logo : profil.logo,
					token: token,
					role: user.role
				});
			})}
				console.log('The token is still valid');
			}
		}).catch(err => {
			res.status(215).send({ message: "Error -> " + err });
		});
	})
}


function base64MimeType(encoded) {
	var result = null;

	if (typeof encoded !== 'string') {
		return result;
	}

	var mime = encoded.match(/data:image+\/([a-zA-Z0-9-.+]+).*,.*/);
	if (mime && mime.length) {
		result = mime[1];
	}

	return result;
}





exports.addUpdateProfil = function (req, res) {
	const rcs = req.body.rcs
	const presentation = req.body.presentation
	const siteWeb = req.body.siteWeb
	const mailContact = req.body.mailContact
	const adresseLabo = req.body.adresseLabo
	const codePostale = req.body.codePostale
	const userId = req.body.userId
	const profilId = req.body.profilId
	

	User.findOne({
		where: { id: userId },
	}).then(user => {
	Profil.findOne({
		where: {
			userId: userId
		}
	}).then(profil => {
		if (profil) {
			Profil.update({
				rcs,
				presentation,
				siteWeb,
				mailContact,
				adresseLabo,
				codePostale
			}, {
			where: {
				id: profilId
			}
			}).then(profil => {
				if (req.body.base64ImageData) {
					var extention = base64MimeType(req.body.base64ImageData)
					var name = 'user-' + Math.floor(10000000000 + Math.random() * 90000000000) + "." + extention;
					buf = new Buffer(req.body.base64ImageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
					var data = {
						ACL: 'public-read',
						Key: `imageFileTracepic/${name}`,
						Body: buf,
						ContentEncoding: 'base64',
						ContentType: 'image/jpeg'
					};
					s3.putObject(data, function (err, data) {
						if (err) {
							console.log(err);
							res.status(405).send({ message: "Error uploading data"})
						} else {
							Profil.update({
								logo: `${name}`
							}, {
								where: {
									id: profilId
								}
							}).then((proil) => {
								if (req.body.ancienPhoto) {
									let ancien = req.body.ancienPhoto.slice(56)
									s3.deleteObject({
										Key: `imageFileTracepic/${ancien}`
									}, function (err, data) {
										if (data) {
											Profil.findOne({ 
											where: {id : profilId}}).then(profil => {
												res.status(200).send({
													id :  profil.id,
													presentation :  profil.presentation,
													siteWeb :  profil.siteWeb,
													mailContact :  profil.mailContact,
													adresseLabo :  profil.adresseLabo,
													logo :  profil.logo,
													codePostale :  profil.codePostale,
													rcs : profil.rcs
												})
											})										}
										else {
											console.log('nooo', err)
											res.status(201).send({ message: "error"})
										}
									})
								}
								else { 
								Profil.findOne({
								where: {id : profilId}}).then(profil => {
									res.status(200).send({id :  profil.id,
										presentation :  profil.presentation,
										siteWeb :  profil.siteWeb,
										mailContact :  profil.mailContact,
										adresseLabo :  profil.adresseLabo,
										logo :  profil.logo,
										codePostale :  profil.codePostale,
										rcs : profil.rcs
									})
								})
							}
							})
						}
					});
				}
				else {
					Profil.findOne({
						where: {id : profilId}}).then(profil => {
							res.status(200).send({ id :  profil.id,
								presentation :  profil.presentation,
								siteWeb :  profil.siteWeb,
								mailContact :  profil.mailContact,
								adresseLabo :  profil.adresseLabo,
								logo :  profil.logo,
								codePostale :  profil.codePostale,
								rcs : profil.rcs
						})
					})
				}
			})
		} else {
			Profil.create({
				rcs,
				presentation,
				siteWeb,
				mailContact,
				adresseLabo,
				codePostale
			}).then(profil => {
				user.addProfils(profil).then((prof) => {
				if (req.body.base64ImageData) {
					var extention = base64MimeType(req.body.base64ImageData)
		
					var name = 'user-' + Math.floor(10000000000 + Math.random() * 90000000000) + "." + extention;
					buf = new Buffer(req.body.base64ImageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
					var data = {
						ACL: 'public-read',
						Key: `imagePerdrix/${name}`,
						Body: buf,
						ContentEncoding: 'base64',
						ContentType: 'image/jpeg'
					};
					s3.putObject(data, function (err, data) {
						if (err) {
							console.log(err);
							res.status(405).send({ message: "Error uploading data"})
						} else {
							Profil.update({
								logo: `${name}`
							}, {
								where: {
									userId: userId
								}
							}).then((proil) => {
								Profil.findOne({
									where: {userId : userId}}).then(profil => {
									res.status(200).send({ id :  profil.id,
										presentation :  profil.presentation,
										siteWeb :  profil.siteWeb,
										mailContact :  profil.mailContact,
										adresseLabo :  profil.adresseLabo,
										logo :  profil.logo,
										codePostale :  profil.codePostale,
										rcs : profil.rcs
									})
								})
							})
						}
					});
				}
				else {
					Profil.findOne({
					where: {userId : userId}}).then(profil => {
						res.status(200).send({ id :  profil.id,
							presentation :  profil.presentation,
							siteWeb :  profil.siteWeb,
							mailContact :  profil.mailContact,
							adresseLabo :  profil.adresseLabo,
							logo :  profil.logo,
							codePostale :  profil.codePostale,
							rcs : profil.rcs
						})
					})
				}
			})
			})
		}
	})
})
}







exports.addPersonnel = function (req, res) {
	try { 
	const {nomPrenomPersonel , adresseEmail , poste , userId } = req.body 
	const dateInscription = moment().format('YYYY-MM-DD')
	const role = "personnel"
	const password = crypto.randomBytes(6).toString('hex');
	const hash = bcrypt.hashSync(password, 10);

	Profil.findOne({
		where: {userId : userId}}).then(profil => {
	Personnel.create({
		nomPrenomPersonel,
		adresseEmail,
		poste
	}).then(response => {
		profil.addPersonnels(response).then((result) => {
			 User.create({
				email : adresseEmail,
				detailRole : poste,
				role : role ,
				dateInscription : dateInscription ,
				password : hash }
			).then( userCreate => {
				sendEmailInscription(adresseEmail , password)
				res.status(200).send({personnelId : response.id})
			})
		})
	})
	})
	} catch (err) {
		return res.status(402).send({ message: "Error -> " + err });;
	}
}


exports.updatePersonnel = function (req, res) {
	const {nomPrenomPersonel , adresseEmail , poste , personnelId } = req.body 

	try { 
			Personnel.update({
				nomPrenomPersonel,
				adresseEmail,
				poste
			
			},{
			where: {
				id: personnelId
			}
		}).then(response => {
			Personnel.findOne({
				where: {
					id: personnelId
				}
			}).then(personnel => {
				res.status(200).send(personnel)
			})
		})		
	} catch (err) {
		return res.status(402).send({ message: "Error -> " + err });;
	}
}

exports.getPersonnelLabo = function (req, res) {
	try { 
	Personnel.findAll({
			where : {
				profilId : req.params.profilId
			}
	}).then(personnel => {
		Profil.findOne({
			where: {
				id: req.params.profilId
			}
		}).then(profil => {
			res.status(200).send({profil , personnel})
		})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}
}

exports.deletePersonnel= function (req, res) {
	try { 
	Personnel.destroy({
		where: {
			id : req.body.personnelId
		}
	}).then(response => {
		res.status(200).send({message : "success"})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}
}

exports.getProfil = function (req, res) {
const	userId = req.params.userId
try { 
Profil.findOne({ 
	where: {userId : userId}}).then(profil => {
		res.status(200).send({
			id :  profil.id,
			presentation :  profil.presentation,
			siteWeb :  profil.siteWeb,
			mailContact :  profil.mailContact,
			adresseLabo :  profil.adresseLabo,
			logo :  profil.logo,
			codePostale :  profil.codePostale,
			rcs : profil.rcs
		})
	})		
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}	
}

exports.getListLabo = async function (req, res) {
	const page = req.body.page
	const pageSize = req.body.pageSize  
	const {nomLaboratoire , dateFin  , dateDeb, nomResponsable,email , pays , isVerified , mobile} = req.body
	var where = {}
    if (nomLaboratoire && nomLaboratoire != '') {
        where.nomLaboratoire = { [Op.like]: '%' + nomLaboratoire + '%'} 
    }
	if (nomResponsable && nomResponsable != '') {
        where.nomResponsable = { [Op.like]: '%' + nomResponsable + '%'} 
    }
	if (email && email != '') {
        where.email = { [Op.like]: '%' + email + '%'} 
    }
	if (pays && pays != '') {
        where.pays = { [Op.like]: '%' + pays + '%'} 
    }
	if (isVerified && isVerified != '') {
        where.isVerified =   isVerified 
    }
	if (mobile && mobile != '') {
		where.mobile = { [Op.like]: '%' + mobile + '%'} 

    }
	if (dateDeb && dateFin)  {
        where.dateInscription = {
            [Op.and]: [
                {[Op.gte] : dateDeb} ,
                {[Op.lte] : dateFin} ]
             
           
         };
   } 
   where.role = "labo"

	var result = []
	try { 
	await User.findAll({
		where,
		include: {
			model: Profil,
			as : 'Profils'
		}
}).then(async profil => {
	if (profil.length > 0){
	profil.map((user , j) => {
		user.Profils.map((prof , i) => {
			result.push({
				userId : user.id,
				nomResponsable : user.nomResponsable ,
				mobile : user.mobile ,
				nomLaboratoire : user.nomLaboratoire,
				email : user.email,
				pays  : user.pays,
				role : user.role,
				dateInscription : user.dateInscription,
				isVerified : user.isVerified,
				id :  prof.id,
				presentation :  prof.presentation,
				siteWeb :  prof.siteWeb,
				mailContact :  prof.mailContact,
				adresseLabo :  prof.adresseLabo,
				logo :  prof.logo,
				codePostale :  prof.codePostale,
				rcs : prof.rcs})
		})
	})
	result.sort(function(a,b){
		return new Date(b.dateInscription) - new Date(a.dateInscription);
	  });
	res.status(200).send({ count: result.length, result: result.slice(pageSize * (page - 1), pageSize * page) });
}
else {
	res.status(200).send({ count: result.length, result: [] });

}
	
})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}	
}

exports.refusByAdmin = async function (req, res) {
const userId = req.body.userId
User.update({
	isVerified: '3'
}, {
	where: {
		id: userId
	}
}).then( response => {
	res.status(200).send({message : "success"})
})
}



exports.getListClient = async function (req, res) {
	const page = req.body.page
	const pageSize = req.body.pageSize
	const {dateDeb , dateFin , fullName ,email , pays , isVerified , mobile} = req.body
	var where = {}
    if (fullName && fullName != '') {
        where.fullName = { [Op.like]: '%' + fullName + '%'} 
    }
	if (email && email != '') {
        where.email = { [Op.like]: '%' + email + '%'} 
    }
	if (pays && pays != '') {
        where.pays = { [Op.like]: '%' + pays + '%'} 
    }
	if (isVerified && isVerified != '') {
        where.isVerified =   isVerified 
    }
	if (mobile && mobile != '') {
        where.mobile =   mobile 
    }
	if (dateDeb && dateFin)  {
        where.dateInscription = {
            [Op.and]: [
                {[Op.gte] : dateDeb} ,
                {[Op.lte] : dateFin} ]
             
           
         };
   } 
   where.role = "client"
	try { 
	await User.findAll({
		attributes: ['id' ,  'fullName' ,'email' , 'pays' , 'isVerified' , 'mobile'],

		where
	
}).then(async user => {
	
	res.status(200).send({ count: user.length, result: user.slice(pageSize * (page - 1), pageSize * page) });

	
})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}	
}

exports.deleteClient = function (req, res) {
	try { 
	User.destroy({
		where: {
			id : req.body.clientId
		}
	}).then(response => {
		res.status(200).send({message : "success"})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}
}

exports.updateInfoClient = function (req, res) {
	const { fullName ,email , pays  , mobile , userId} = req.body
	try { 

	User.update({
		fullName,
		email,
		pays,
		mobile
	}, {
	where: {
		id: userId
	}
	}).then(() => {
		res.status(200).send({message : "success"})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}
}




exports.addMachine = function (req, res) {
	try { 
	const {marque , numeroSerie ,  userId } = req.body 

	Profil.findOne({
		where: {userId : userId}}).then(profil => {
			Machine.create({
				marque,
				numeroSerie
	}).then(response => {
		profil.addMachines(response).then((result) => {
			res.status(200).send({machineId : response.id})
		})
	})
	})
		} catch (err) {
		return res.status(402).send({ message: "Error -> " + err });;
	}
}


exports.updateMachine = function (req, res) {
	const {marque , numeroSerie  , machineId } = req.body 

	try { 
		Machine.update({
				marque,
				numeroSerie
			},{
			where: {
				id: machineId
			}
		}).then(response => {
			Machine.findOne({
				where: {
					id: machineId
				}
			}).then(machine => {
				res.status(200).send(machine)
			})
		})		
	} catch (err) {
		return res.status(402).send({ message: "Error -> " + err });;
	}
}

exports.getMachineLabo = function (req, res) {
	try { 
		Machine.findAll({
			where : {
				profilId : req.params.profilId
			}
	}).then(machine => {
		Profil.findOne({
			where: {
				id: req.params.profilId
			}
		}).then(profil => {
			res.status(200).send({profil , machine})
		})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}
}

exports.deleteMachine= function (req, res) {
	try { 
	Machine.destroy({
		where: {
			id : req.body.machineId
		}
	}).then(response => {
		res.status(200).send({message : "success"})
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}}
