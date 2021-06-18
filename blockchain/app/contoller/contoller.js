const ethers = require('ethers');
/**********************************************************************************/
const ipfsClient  = require('ipfs-http-client')

const ipfs = ipfsClient.create('http://localhost:5001')
/*********************************************************************************/
//aa
const ApiKeyEther ="AQZ9SP1WQK4PDG9K4QD2WR97QRXA37T3ND"
const CONTRACT_ADDRESS = "0x6c49256a421c70ff0D5B192E75b06833771d05fa";

const provider = new ethers.getDefaultProvider('rinkeby',ApiKeyEther);

const ABI = [
  "function addProjet (string _projetCID,string _lab,string[] memory _experienceCids)",
  "function addProtocole (string _protocoleCID,string _lab,string[] memory _blockCids,string[] memory _groupCids)",
  "function addGroup (string _groupCID,string[] memory _operationCids)",
  "function addProtocoleToProject (string _projetCID,string memory _protocoleCid)",
  "function addBlockToProtocole (string memory _protocoleCID,string memory _blockCid)",
  "function addGroupToProtocole (string _protocoleCID,string memory _groupCid)",
  "function addOperationToGroup(string _groupCID,string _operationCid)",
  "function getAllProjetForLab (string _lab) public view returns (string[] memory)",
  "function getAllProtocoleForLab (string _lab) public view returns (string[] memory)",
  "function getBlockOfProtocole (string _protocoleCid) public view returns (string[] memory)",
  "function getGroupOfProtocole (string _protocoleCid) public view returns (string[] memory)",
  "function getOperationOfGroup (string _groupCid) public view returns (string[] memory)",
]
/********************************************************************************/
exports.createProjet = async function (req,res) {
  const {projetName,startDate,endDate,mangerName,description,objectif,labName} = req.body;
  try {
    //add to ipfs
  const {cid} = await ipfs.add('{"projetName":"'+projetName+'",'+'"startDate":"'+startDate+'",'+'"endDate":"'+
  endDate+'",'+'"mangerName":"'+mangerName+'",'+'"description":"'+description+'",'+'"objectif":"'+objectif+
  '"}')
   //add to blockchain
 try {
    var privateKey = '2924ddf78982b1edd93ea77e4032ee509bf40e1d8cb0a108c0ff8095583b1382'

     var wallet = new ethers.Wallet(privateKey, provider)

     const setDataContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
     const value = await setDataContract.addProjet(cid.toString(),labName,[])
     res.status(200).send({ value ,projetCid :cid.toString()});
   } catch (error) {
    res.status(400).send(error)
   }

  } catch (error) {
    res.status(404).send(error)
  }
}

//create protocole and add it to project
exports.createProtocole = async function (req,res) {
  const{protocoleTitle,description,objectif,projetCid,labName} = req.body;
  try {
  const {cid} = await ipfs.add('{"protocoleTitle":"'+protocoleTitle+'",'+'"description":"'+description+'",'
  +'"objectif":"'+objectif+'"}')

    try {
      var privateKey = '2924ddf78982b1edd93ea77e4032ee509bf40e1d8cb0a108c0ff8095583b1382'
      var wallet = new ethers.Wallet(privateKey, provider)
      //create protocole to the blokchain
     const setDataContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
      const value = await setDataContract.addProtocole(cid.toString(),labName,[],[])
      //add protocole to projet
      const setDataContract2 = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
      const value2 = await setDataContract2.addProtocoleToProject(projetCid,cid.toString())
       res.status(200).send({value,value2,PorotocoleCid :cid.toString()});
     } catch (error) {
      res.status(400).send(error)
     }
  } catch (error) {
    res.status(404).send(error)
  }
}

//create the group and add it to protocole
exports.addGroupToProtocole = async function (req,res) {
  const{groupName,nature,elementNumber,description,protocoleCid} = req.body;

  try {
    const {cid} = await ipfs.add('{"groupName":"'+groupName+'",'+'"nature":"'+nature+'",'
    +'"elementNumber":"'+elementNumber+'",'+'"description":"'+description+'"}')

   try {
    var privateKey = '2924ddf78982b1edd93ea77e4032ee509bf40e1d8cb0a108c0ff8095583b1382'
     var wallet = new ethers.Wallet(privateKey, provider)
     //create group and add it to the blockchain
     const setDataContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
     const value = await setDataContract.addGroup(cid.toString(),[])
    //add group to the protocole
     const setDataContract2 = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
     const value2 = await setDataContract2.addGroupToProtocole(protocoleCid,cid.toString())

     res.status(200).send({ value,value2 ,groupCid :cid.toString()});
   } catch (error) {
    res.status(400).send(error)
   }
  } catch (error) {
    res.status(404).send(error)
  }

}


//create the block and add it to protocole
exports.addBlockToProtocole = async function (req,res) {
  const{blockTitle,description,objectif,parameters,type,machine,resources,protocoleCid} = req.body;

  try {
    const {cid} = await ipfs.add('{"blockTitle":"'+blockTitle+'",'+'"description":"'+description+'",'
    +'"objectif":"'+objectif+'",'+'"parameters":"'+parameters+'",'+'"type":"'+type+'",'
    +'"machine":"'+machine+'",'+'"resources":"'+resources+'"}')

    try {
     // var cid='QmccNke4Ja4xYCWJck7gJC5h7pZFeeamFjCvTMr64PJLpx'
      var privateKey = '2924ddf78982b1edd93ea77e4032ee509bf40e1d8cb0a108c0ff8095583b1382'
       var wallet = new ethers.Wallet(privateKey, provider)
       const setDataContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
       const value = await setDataContract.addBlockToProtocole(protocoleCid,cid.toString())
       res.status(200).send({value,block : cid.toString()})
     } catch (error) {
      res.status(400).send(error)
     }
    } catch (error) {
      res.status(404).send(error)
    }

}

exports.addOperationTogroup = async function (req,res) {
  const{operationTitle,operationType,daysNumbre,operationPerDay,groupCid} = req.body;

  try {
   const {cid} = await ipfs.add('{"operationTitle":"'+operationTitle+'",'+'"operationType":"'+operationType+'",'
  +'"operationFreq":"'+daysNumbre+'",'+'"operationPerDay":"'+operationPerDay+'"}')
    try {
      var privateKey = '2924ddf78982b1edd93ea77e4032ee509bf40e1d8cb0a108c0ff8095583b1382'
  
       var wallet = new ethers.Wallet(privateKey, provider)
  
       const setDataContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
       const value = await setDataContract.addOperationToGroup(groupCid,cid.toString())
       res.status(200).send({value,operationCid: cid.toString()})
     } catch (error) {
      res.status(400).send(error)
     }
  } catch (error) {
    res.status(404).send(error)
  }
}

exports.getAllProjetForLab = async function (req,res) {
  try {
   //read from blockchain
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS,ABI,provider)
    const value = await readOnlyContract.getAllProjetForLab(req.body.lab)

   //read from ipfs
   var tabProjet = [];
   for (let i = 0; i < value.length; i++) {
     const chunks = []
      for await (const chunk of ipfs.cat(value[i])) {
        chunks.push(chunk)
      }  
      var file =Buffer.concat(chunks).toString()
      var projet = JSON.parse(file);

        tabProjet.push({
          projetCID :value[i],
          projetName: projet.projetName,
          startDate: projet.startDate,
          endDate : projet.endDate,
          mangerName : projet.mangerName,
          description : projet.description,
          objectif : projet.objectif,
        });
    }
    res.status(200).send(tabProjet)
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.getAllProtocoleForLab = async function (req,res) {
  try {
   //read from blockchain
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS,ABI,provider)
    const value = await readOnlyContract.getAllProtocoleForLab(req.body.lab)

   //read from ipfs
   var tabProtocole = [];
   for (let i = 0; i < value.length; i++) {
     const chunks = []
      for await (const chunk of ipfs.cat(value[i])) {
        chunks.push(chunk)
      }  
      var file =Buffer.concat(chunks).toString()
      var protocole = JSON.parse(file);
        tabProtocole.push({
          protocoleCID :value[i],
          protocoleTitle: protocole.protocoleTitle,
          description: protocole.description,
          objectif : protocole.objectif,
        });
    }
    res.status(200).send(tabProtocole)
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.getBlockOfProtocole = async function (req,res) {
  try {
   //read from blockchain
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS,ABI,provider)
    const value = await readOnlyContract.getBlockOfProtocole(req.body.protocoleCid)

    const chunks1 = [];
    var tabBlock = [];
    for (let i = 0; i < value.length; i++) {
      for await (const chunk of ipfs.cat(value[i])) {
        chunks1.push(chunk)
      }
      var file =Buffer.concat(chunks1).toString()
      var block = JSON.parse(file);
      tabBlock.push({
        blockCid : value[i],
        blockTitle : block.blockTitle,
        description: block.description,
        objectif: block.objectif,
        parameters : block.parameters,
        type : block.type,
        machine : block.machine,
        resources : block.resources
      });
    }
    res.status(200).send(tabBlock)
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.getGroupOfProtocole = async function (req,res) {
  try {
   //read from blockchain
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS,ABI,provider)
    const value = await readOnlyContract.getGroupOfProtocole(req.body.protocoleCid)

    const chunks1 = [];
    var tabGroup = [];
    for (let i = 0; i < value.length; i++) {
      for await (const chunk of ipfs.cat(value[i])) {
        chunks1.push(chunk)
      }
      var file =Buffer.concat(chunks1).toString()
      var group = JSON.parse(file);
      tabGroup.push({
        groupCid : value[i],
        groupName : group.groupName,
        nature : group.nature,
        elementNumber : group.elementNumber,
        description : group.description
      });
    }
    res.status(200).send(tabGroup)
  } catch (error) {
    res.status(400).send(error)
  }
}

exports.getOperationOfGroup = async function (req,res) {
  try {
   //read from blockchain
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS,ABI,provider)
    const value = await readOnlyContract.getOperationOfGroup(req.body.groupCid)

    const chunks1 = [];
    const tabOperation = [];
    for (let i = 0; i < value.length; i++) {
      for await (const chunk of ipfs.cat(value[i])) {
        chunks1.push(chunk)
      }
      var file =Buffer.concat(chunks1).toString()
      var operation = JSON.parse(file);
      tabOperation.push({
        OperationCid : value[i],
        operationTitle : operation.operationTitle,
        operationType : operation.operationType,
        daysNumbre : operation.operationFreq,
        operationPerDay : operation.operationPerDay
      });
      
    }
    res.status(200).send(tabOperation)
  } catch (error) {
    res.status(400).send(error)
  }
}
