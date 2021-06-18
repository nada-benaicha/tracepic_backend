const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Profil = db.profil
const Personnel = db.personnel
const Machine = db.machine
var sequelize = require('sequelize');
const Op = db.Sequelize.Op;
const moment = require('moment');
const Project = db.project
const Experience = db.experience
const Protocole = db.protocole
const ExprimentalGroup = db.exprimentalGroup
const Operation = db.operation
const TypeOperation = db.typeOperation
const Bloc = db.bloc
const TypeBloc = db.typeBloc

exports.addNewProject = function (req, res) {
	try { 
	const {titreProjet , description , objectif,dateDeb , dateFin,userId } = req.body 

	Profil.findOne({
		where: {userId : userId}}).then(profil => {
            Project.create({
                titreProjet,
                description,
                objectif,
                dateDeb,
                dateFin
            }).then(response => {
                profil.addProjects(response).then((result) => {
                    res.status(200).send({message : "success"})
                })
            })
    })
} catch (err) {
    return res.status(402).send({ message: "Error -> " + err });;
}
}




// exports.addNewExperience = function (req, res) {

// 	try { 
//         const today = moment();
//         const dateInsertion = today.format()
//         const {nomExperience , description , objectif,dateDeb , dateFin,projectId } = req.body 

// 	Project.findOne({
// 		where: {id : projectId}}).then(projet => {
//             Experience.create({
//                 nomExperience,
//                 description,
//                 objectif,
//                 dateDeb,
//                 dateFin,
//                 dateInsertion
//             }).then(response => {
//                 projet.addExperiences(response).then((result) => {
//                     res.status(200).send({message : "success"})
//                 })
//             })
//     })
// } catch (err) {
//     return res.status(402).send({ message: "Error -> " + err });;
// }
// }



// exports.getDetailsProject = async function (req, res) {
// 	const projectId = req.params.projectId
// 	try { 
//         await Project.findAll({
//             where : {
//                 id : projectId
//             },
//             include: {
//                 model: Experience,
//                 as : 'Experiences'
//             }
//         }).then(async project => {
//             res.status(200).send({ project});	 
//         })
//     } catch (err) {
//         return res.status(402).send({ message: "Error -> " + err });;
//     }	
// }



exports.addNewProtocole = function (req, res) {
	try { 
	    const {titreProtocole , description , objectif , projectId} = req.body 
        Project.findOne({
            where: {id : projectId}}).then(projet => {
        Protocole.create({
            titreProtocole,
            description,
            objectif
        }).then(response => {
            projet.addProtocoles(response).then((result) => {
                res.status(200).send({message : "success"})
            })
        })
    })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }
}


exports.addExprimentalGroup = function (req, res) {
	try { 
	    const {nomGroupe , nature , nbElement , description , protocolId , nomOperation,typeOperationId , nbJours , nbOperationParJour } = req.body 
        Protocole.findOne({
            where: {id : protocolId}}).then(protocol => {
        ExprimentalGroup.create({
            nomGroupe,
            nature,
            nbElement,
            description
        }).then(group => {
            protocol.addExprimentalGroups(group).then((result) => {
                Operation.create({
                    nomOperation,
                    nbJours,
                    nbOperationParJour
                }).then(operation => {
                    group.addOperations(operation).then((result) => {
                        TypeOperation.findOne({
                            where: {id : typeOperationId}}).then(type => {
                                type.addTypeOperations(operation).then((result) => {
                                res.status(200).send({message : "success"})
                            })
                        })
                    })
                })
            })
        })
    })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }
}


exports.getAllTypeOperation = async function (req, res) {
try { 
	await TypeOperation.findAll({
	}).then(async typeOperation => {
		res.status(200).send(typeOperation);
	})
} catch (err) {
	return res.status(402).send({ message: "Error -> " + err });;
}}

exports.getAllProjectForLabo = async function (req, res) {
    try { 
        await Project.findAll({
            attributes: ['id', 'titreProjet'],
            where : {
                profilLaboId : req.params.profilLaboId
            }
        }).then(async project => {
            res.status(200).send(project);
        })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }
}
    


exports.addBloc = function (req, res) {
	try { 
	    const {titreBloc , description , objectif , parametres , protocolId ,typeBlocId,machineId  } = req.body 
        Protocole.findOne({
            where: {id : protocolId}}).then(protocol => {
        Bloc.create({
            titreBloc,
            objectif,
            parametres,
            description
        }).then(bloc => {
            protocol.addBlocs(bloc).then((result) => {
                TypeBloc.findOne({
                    where: {id : typeBlocId}}).then(type => {
                        type.addTypeBlocs(bloc).then((result) => {
                             Machine.findOne({
                                where: {id : machineId}}).then(machine => {
                                    machine.addMachineBloc(bloc).then((result) => {
                                        res.status(200).send({message : "success"})
                                    })
                                })
                            })
                        })
                    })
                })
            })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }
}

exports.getAllTypeBloc = async function (req, res) {
    try { 
        await TypeBloc.findAll({
        }).then(async typeBloc => {
            res.status(200).send(typeBloc);
        })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }
}


exports.getAllBlocForSpecificProtocol = async function (req, res) {
    try { 
        await Bloc.findAll({
            where : {
                protocolId : req.params.protocolId
            }
          
        }).then(async bloc => {
            res.status(200).send(bloc);
        })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
}}
   


exports.getDetailsBloc = async function (req, res) {

	const {protocolId } = req.body
	try { 
        await Protocole.findOne({
            where: {
                id : protocolId
            },
            include: [
                {
                    model: Bloc,
                    as :"Blocs" ,
                    include: {
                    model: Machine
                }
                },{
                model: ExprimentalGroup,
                as :"ExprimentalGroups" ,
                include: {
                    model: Operation,
                    as : 'Operations'              
                }},
            ]
        }).then(async bloc => {
            res.status(200).send(bloc)
        })
    } catch (err) {
        return res.status(402).send({ message: "Error -> " + err });;
    }	
}