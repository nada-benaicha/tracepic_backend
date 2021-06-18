const db = require('../config/db.config.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = db.user;
const Profil = db.profil
const Personnel = db.personnel
const Machine = db.machine
const Project = db.project
const Experience = db.experience


exports.searchPersonnels = async function (req, res) {
	const page = req.body.page
	const pageSize = req.body.pageSize
	const {nomPrenomPersonel , adresseEmail , poste, profilId } = req.body
	var where = {}
    if (nomPrenomPersonel && nomPrenomPersonel != '') {
        where.nomPrenomPersonel = { [Op.like]: '%' + nomPrenomPersonel + '%'} 
    }
	if (adresseEmail && adresseEmail != '') {
        where.adresseEmail = { [Op.like]: '%' + adresseEmail + '%'} 
    }
	if (poste && poste != '') {
        where.poste = { [Op.like]: '%' + poste + '%'} 
    }
    where.profilId = profilId 

	try { 
	await Personnel.findAll({
		where
	}).then(async personnel => {
		if (personnel.length > 0) {
			res.status(200).send({ count: personnel.length, result: personnel.slice(pageSize * (page - 1), pageSize * page) });
		}
		else {
			res.status(200).send({ count: personnel.length, result:[]})
		}
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}}


exports.searchMachines = async function (req, res) {
	const page = req.body.page
	const pageSize = req.body.pageSize
	const {marque , numeroSerie , profilId } = req.body
	var where = {}
    if (marque && marque != '') {
        where.marque = { [Op.like]: '%' + marque + '%'} 
    }
	if (numeroSerie && numeroSerie != '') {
        where.numeroSerie = numeroSerie 
    }
    where.profilId = profilId 
	try { 
	await Machine.findAll({
		where
	}).then(async machine => {
	if (machine.length > 0){
	    res.status(200).send({ count: machine.length, result: machine.slice(pageSize * (page - 1), pageSize * page) });
    }
    else {
        res.status(200).send({ count: machine.length, result:[]});
    }
})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}	
}

function sortAndReturnLastExperience (newarray) {
	var experience = newarray.sort((a, b) => b.dateInsertion - a.dateInsertion);
		var first = experience[0];
return first

}


// exports.searchProject = async function (req, res) {
// 	const page = req.body.page
// 	const pageSize = req.body.pageSize
// 	const {dateDeb , dateFin , titreProjet , nomResponsable,statut , profilId } = req.body
// 	var where = {}
// 	var whereClause;
// var lastExperience;
// 	if (nomResponsable && nomResponsable != '') {
//         whereClause = {nomResponsable: {[Op.like]: '%' + nomResponsable + '%'}};
//     }  

//     if (titreProjet && titreProjet != '') {
//         where.titreProjet = { [Op.like]: '%' + titreProjet + '%'} 
//     }

// 	if (dateDeb && dateDeb != '') {
//         where.dateDeb = new Date(dateDeb)
// 	}
// 	if (dateFin && dateFin != '') {
//         where.dateFin = new Date(dateFin)
//     }
// 	if (statut && statut != '') {
//         where.statut =   statut 
//     }

// 	try { 
// 	await User.findAll({
// 		where: whereClause,
// 		include: {
// 			model: Profil,
// 			as :"Profils" ,
// 			where:{ id : profilId },
// 		include: {
// 			model: Project,
// 			as : 'Projects',
// 			where,
// 			include: {
// 				model: Experience,
// 				as : 'Experiences'
// 			}
// 		}
// 	}
// 	}).then(async users => {
// 		users.map(async (user , j) => {
// 			user.Profils.map(async(profil , i) => {
// 					const result = await profil.Projects.map(async (project) => (
// 						lastExperience = await sortAndReturnLastExperience(project.Experiences)
// 						,{
// 						id: project.id,
// 						titreProjet: project.titreProjet,
// 						description: project.description,
// 						objectif: project.objectif,
// 						dateDeb: project.dateDeb,
// 						dateFin: project.dateFin,
// 						statut: project.statut,
// 						profilLaboId: project.profilLaboId,
// 						nameOfLastExperience : lastExperience.nomExperience,
// 						nomResponsable: user.nomResponsable
// 					 }));

// 					 Promise.all(result).then(values => {
// 						res.status(200).send({ count: values.length, result: values.slice(pageSize * (page - 1), pageSize * page) });
// 					  }).catch(reason => {
// 						console.log(reason)
// 					  });
// 			})
// 		})

// })
// } catch (err) {
// 	return res.status(402).send({ message: "Error -> " + err });;
// }	
// }