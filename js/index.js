//IMPORTANT: use WebSocketProvider instead of HTTPProvider to be able to manage smart contract events
//const web3socket = new Web3('ws://localhost:8546');
//web3socket.setProvider(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));


var NUM;
var waste;
var STATE;
//web3socket = new Web3(new Web3.providers.WebsocketProvider("wss://127.0.0.1:7545"));
web3socket = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/b43b854774aa450e8214906196e0efc6"));
const privateKey = "884733f6e66544117f0af62c709d3c574013d734a0c78a1cd24ebe83f5c02a9d";
/*
web3socket.eth.getAccounts(function(err, accounts) {
   if (err != null) {
     alert("Error retrieving accounts.");
     return;}

   if(accounts.length == 0) {
      alert("No account found! Make sure the Ethereum client is configured properly.");
     return;}

    account = accounts[0];
    console.log('Deafult Account: ' + account);
    web3socket.eth.defaultAccount = account;
   });

  web3socket.eth.getAccounts()
  .then(console.log); */

  web3socket.eth.accounts.wallet.add(privateKey);
  var ABI = JSON.parse('[	{		"constant":false,		"inputs":[			{				"name":"_number",				"type":"uint256"			},			{				"name":"_sensorId",				"type":"string"			},			{				"name":"_sensorRadioactiveWasteType",				"type":"string"			}		],		"name":"registerSensor",		"outputs":[],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"constant":true,		"inputs":[			{				"name":"_number",				"type":"uint256"			}		],		"name":"statusChecker",		"outputs":[			{				"name":"",				"type":"string"			}		],		"payable":false,		"stateMutability":"view",		"type":"function"	},	{		"constant":false,		"inputs":[],		"name":"kill",		"outputs":[],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"constant":true,		"inputs":[			{				"name":"_number",				"type":"uint256"			}		],		"name":"getIdToDrum",		"outputs":[			{				"name":"",				"type":"string"			},			{				"name":"",				"type":"string"			},			{				"name":"",				"type":"string"			},			{				"name":"",				"type":"string"			},			{				"name":"",				"type":"uint256"			},			{				"name":"",				"type":"uint256[]"			},			{				"name":"",				"type":"uint256"			}		],		"payable":false,		"stateMutability":"view",		"type":"function"	},	{		"constant":false,		"inputs":[			{				"name":"_number",				"type":"uint256"			},			{				"name":"_temperature",				"type":"uint256"			}		],		"name":"storageDrum",		"outputs":[			{				"name":"",				"type":"uint256"			}		],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"constant":false,		"inputs":[			{				"name":"_number",				"type":"uint256"			},			{				"name":"_drumId",				"type":"string"			},			{				"name":"_drumRadioactiveWasteType",				"type":"string"			},			{				"name":"_temperatureLimit",				"type":"uint256"			}		],		"name":"registerDrum",		"outputs":[],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"inputs":[],		"payable":false,		"stateMutability":"nonpayable",		"type":"constructor"	},	{		"anonymous":false,		"inputs":[			{				"indexed":false,				"name":"",				"type":"uint256"			}		],		"name":"EverythingOk",		"type":"event"	},	{		"anonymous":false,		"inputs":[			{				"indexed":false,				"name":"",				"type":"uint256"			}		],		"name":"Suspicious",		"type":"event"	},	{		"anonymous":false,		"inputs":[			{				"indexed":false,				"name":"",				"type":"uint256"			}		],		"name":"Emergency",		"type":"event"	}]');
  var contractAddress = '0x81b7E08F65Bdf5648606c89998A9CC8164397647'; 

  Contract =new web3socket.eth.Contract(ABI,contractAddress);

  //????????? ???????????? ??????
  //emit catch ?????? PrintAlarm ????????? ???????????? ?????? ??? ????????? ??????
  Contract.events.EverythingOk((err, events)=>{ 
    document.getElementById('sto_event').innerHTML = "?????? ??????";
    PrintnAlarm(events,"EverythingOk");
      
  });

  Contract.events.Suspicious((err, events)=>{
    PrintnAlarm(events,"Suspicious");
  });
     
  Contract.events.Emergency((err, events)=>{
    document.getElementById('sto_event').innerHTML = "?????? ??????";
    PrintnAlarm(events,"Emergency");
  });

function PrintnAlarm(events, theevent){
  console.log("???????????? : " + events.returnValues[0]);

  Contract.methods.getIdToDrum(NUM).call().then(function(drum_info){

    if (STATE ==  "storage" & theevent != "EverythingOk"){
      console.log("???????????? : " + events.returnValues[0]);
      console.log("?????? - ???????????? : " + drum_info[4])
      alert("*??????* ?????? ??????????????? ?????????????????????.");
      document.getElementById('Which_Process').innerHTML = "**??????** ?????? ??????????????? ?????????????????????. ";  
      document.getElementById('getdrum_info').innerHTML = 
        "?????? ID : " + drum_info[0] +
        "/     ???????????? : " + drum_info[4];
        document.getElementById('detail').innerHTML = '?????? ??????????????? : '+drum_info[5][0]+'???, '+drum_info[5][1]+', '+drum_info[5][2]+'???, '+drum_info[5][3]+'???, '+drum_info[5][4]+'???, '+drum_info[5][5]+'???, '+drum_info[5][6]+'???, '+drum_info[5][7]+'???, '+drum_info[5][8]+'???, '+drum_info[5][9]+'??? ';
  }

  });
};


  $("#button_drum").click(function() {
    NUM = $("#drumNum").val();
    waste = $("#drumType option:selected").val();
    Contract.methods.registerDrum(NUM,$("#drumId").val(),waste, $("#temp").val()).send({from: web3socket.eth.accounts.wallet[0].address, gas:3000000}).on('transactionHash', function(hash){
      document.getElementById('Transaction_Drum').innerHTML = "?????? ??? : " + hash;
});
    pressBtn_drum() 
      });

    $("#button_sen").click(function() {
        NUM = $("#drumNumsen").val();

        if(waste ==$("#sensorType option:selected").val() ){
          Contract.methods.registerSensor($("#drumNumsen").val(),$("#sensorId").val(),$("#sensorType option:selected").val()).send({from: web3socket.eth.accounts.wallet[0].address, gas:3000000})
          .on('transactionHash', function(hash1){
            document.getElementById('Transaction_sen').innerHTML = "?????? ??? : " + hash1; });
          pressBtn_sen();
      }
        else{
          alert("????????? ???????????? ????????? ?????? ?????? ????????? ???????????????. ?????? ??????????????????"); 
        }
});

    $("#button_check").click(function(){
      NUM = $("#getnum_SC").val();
      Contract.methods.statusChecker(NUM).call().then(function(Status) {
        document.getElementById('Status_check').innerHTML = Status;});

      Contract.methods.getIdToDrum($("#getnum_SC").val()).call().then(function(drum_info){
        document.getElementById('Status_detail').innerHTML = "?????? ?????? ?????? : "  + $("#getnum_SC").val();
        document.getElementById('Status_Process').innerHTML = "?????? ID : " + drum_info[0] + 
        "/    ????????? ????????? ?????? : " + drum_info[1] ;
        document.getElementById('Status_condition').innerHTML = "?????? ID : " + drum_info[2] + 
        "/    ????????? ????????? ?????? : " + drum_info[3];
        document.getElementById('Status_info').innerHTML = "????????? ?????? ??????: " + drum_info[4];   
      });
    });
    
      $("#button_sto").click(function() {
        STATE = "storage";
        NUM = $("#getst").val();
        Contract.methods.storageDrum(NUM,$("#temp_sto").val()).send({from: web3socket.eth.accounts.wallet[0].address, gas:300000});
  });

  function agree(){ 
    var chkbox = document.getElementsByName('????????????'); 
    var chk = false; 
    for(var i=0 ; i<chkbox.length ; i++) { 
      if(chkbox[i].checked) { chk = true; } 
      else { chk = false; } 
    } 
    
    if(!chk) { 
      alert("?????? ????????? ????????? ???????????? ?????? ????????? ???????????????. ?????? ??????????????????.");
    } 
}

  //getdata????????? ???????????? csv?????? ????????? ??????????????? ???????????????
  //just ?????? ????????? ?????? ?????? - ???????????? ???????????? ????????????
  $("#get_data").click(async function() {
    let promise = d3.csv("./data/data.csv");
    const routes = await promise;
    var i=0;
    if(routes[0].num1){
      while(i!=routes.length){
        STATE = "storage";
        blindclick(NUM, routes[i].num1);
        i++;
      }
}
});

  function blindclick(num, temp){
    Contract.methods.storageDrum(num,temp).send({from: web3socket.eth.accounts.wallet[0].address, gas:3000000});//????????? ?????? ?????? ??????  
 }


function pressBtn_drum(){
  const drumNum = document.querySelector("#drumNum");
  const drumID = document.querySelector("#drumId");
  const drumType = document.querySelector("#drumType");
  const drumTemp = document.querySelector("#temp");

  const currentVal_drum = '\n???????????? : ' +  drumNum.value + '\t / ID :  ' + drumID.value + '\t / ?????? :  '  + drumType.value + ' \t / ???????????? : ' +drumTemp.value + '???'; 
  
  showComment(currentVal_drum,0); 
  drumNum.value = ''; 
  drumID.value = ''; 
  drumType.value = '' ;
  drumTemp.value = '' ; 
}

function pressBtn_sen(){
  const drumNumsen = document.querySelector("#drumNumsen");
  const sensorID = document.querySelector("#sensorId");
  const sensorType = document.querySelector("#sensorType");
  const currentVal_sen = '\n???????????? : ' +  drumNumsen.value + '\t / ID : ' + sensorID.value + '\t  / ?????? : '  + sensorType.value; 

  showComment(currentVal_sen,1); 
  drumNumsen.value = ''; 
  sensorID.value = ''; 
  sensorType.value = '' ; 
} 

    //?????????????????? 
    function showComment(comment, flag){ 
        const inputValue = document.createElement('span'); 
        const countSpan = document.createElement('span') 
        const commentList = document.createElement('div'); 
         
        commentList.className = "eachComment"; 
        inputValue.className="inputValue"; 
        
        countSpan.innerHTML=0;

        //????????? ????????? 
        inputValue.innerText = comment; 
        commentList.appendChild(inputValue);

      if (flag==0){
        const rootDiv = document.querySelector("#comments");
        rootDiv.prepend(commentList);}

      else{
        const rootDiv1 = document.querySelector("#comments1");
        rootDiv1.prepend(commentList); }
         
    } 

    
    
      

    
    
    