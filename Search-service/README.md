URL : https://kelmission-backend.trimakus.com/api/Search/SearchMission
Méthode : POST
Input :
{
"pageSize" : 20,
"page" : 1,
"trie" : 3, // 1 : trie selon Tjm , 2 : selon nombre de etoile , 3 : selon date publication
"lieu" : "",
"tjm_code_recherche" :,
"duree_code_recherche" : ,
"lieu_code_recherche" : ,
"demarrage_code_recherche" : ,
"titre" : "
}

/**\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***/
URL : https://kelmission-backend.trimakus.com/api/Search/SearchMissionConsulte
Méthode : POST
Input :
{
"pageSize" : 20,
"page" : 1,
"trie" : 3, // 1 : trie selon Tjm , 2 : selon nombre de etoile , 3 : selon date publication
"lieu" : "",
"tjm_code_recherche" :,
"duree_code_recherche" : ,
"lieu_code_recherche" : ,
"demarrage_code_recherche" : ,
"titre" : ",
"UserId" : 391

}
Headers :
x-access-token : ""

/**\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***\*\***\*\*\*\***/
URL : https://kelmission-backend.trimakus.com/api/Search/searchMissionForAdmin
Méthode : POST
Input :
{
"pageSize" : 20,
"page" : 1,
"trie" : 3, // 1 : trie selon Tjm , 2 : selon nombre de etoile , 3 : selon date publication
"lieu" : "",
"tjm_code_recherche" :,
"societe" : ,
"lieu_code_recherche" : ,
"demarrage_code_recherche" : ,
"titre" : ",
"statut" : 1

}

/**\*\*\*\***\*\*\*\***\*\*\*\***\*\***\*\*\*\***\*\*\*\***\*\*\*\***\***\*\*\*\***\*\*\*\***\*\*\*\***\*\***\*\*\*\***\*\*\*\***\*\*\*\***/
URL : https://kelmission-backend.trimakus.com/api/Search/SearchMissionCompany
Méthode : POST
Input :
{
"pageSize" : 20,
"page" : 1,
"trie" : 3, // 1 : trie selon Tjm , 2 : selon nombre de etoile , 3 : selon date publication
"lieu" : "",
"tjm_code_recherche" :,
"duree_code_recherche" : ,
"lieu_code_recherche" : ,
"demarrage_code_recherche" : ,
"titre" : ",
"statut" : 1
"companyId" : 31

}

/**\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***/
URL : https://kelmission-backend.trimakus.com/api/Search/searchCompetence
Méthode : POST
Input :
{
"pageSize" :20,
"page" : 1,
"codeGroupeCompetence" : 4,
"codeCompetence" : ,
"libelleCompetence" :
}

/********\*\*\*\*********\*\*********\*\*\*\*********\*\*********\*\*\*\*********\*\*********\*\*\*\*********/
URL : https://kelmission-backend.trimakus.com/api/Search/searchCompany
Méthode : POST
Input :
{
"pageSize" : 5,
"page" : 1,
"raison_social" : "",
"formeJuridique" : "",
"pays" : "",
"statut" : ""
}

/********\*\*\*\*********\*\*********\*\*\*\*********\*\*\*********\*\*\*\*********\*\*********\*\*\*\*********/
URL : https://kelmission-backend.trimakus.com/api/Search/SearchFreelancer
Méthode : POST
Input :
{
"page" : 1,
"pageSize" : 30,
"trie" : 2,
"titreProfil" : "" ,
"GeographicPreference" : "" ,
"availabilityDate" : "" ,
"tjm" : ,

}
