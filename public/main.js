const socket = io();
let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#input-nick');
let chatInput = document.querySelector('#input-chat');


loginPage.style.display = 'flex';

//FUNÇÕES
function renderUserList() {
     let ul = document.querySelector('.area-users ul');
     ul.innerHTML = ''

     userList.forEach(i => {
          ul.innerHTML += '<li>'+i+'</li>'
     });
}

function addMessage(type, user, msg) {
     let ul = document.querySelector('.area-chat ul');

     switch(type) {
          case 'status':
               ul.innerHTML += '<li class="msg-auto">'+msg+'</li>'
               break
          case 'msg':
               if(username == user) {
                    ul.innerHTML += '<li><span class="nick-user me">'+user+'</span> '+msg+'</li>'
               } else {
               ul.innerHTML += '<li><span class="nick-user">'+user+'</span> '+msg+'</li>'
               }
               break
     }
     ul.scrollTop = ul.scrollHeight;
}



//APARTIR DO LOGIN
loginInput.addEventListener('keyup', (e) => {
     if (e.keyCode === 13) {
          let name = loginInput.value.trim();
          
          socket.on('emit-list', (list)=>{
               userList = list;
               console.log('USERLIST: ', userList)
          });
          let lowerCaseList = userList.map((e) => { return e.toLowerCase() });
          let TrueOrFalse = lowerCaseList.includes(name.toLowerCase())
          if (name != "" && TrueOrFalse === false) {
          username = name;
          document.title = `Chat (${username})`;
          socket.emit('join-request', username);
          }
     }
});

socket.on('user-ok', (list) => {
     loginPage.style.display = 'none'
     chatInput.focus();

     addMessage('status', null, 'Conectato!')

     userList = list;
     renderUserList()

});

socket.on('list-update', (data) => {

     if (data.joined) {
          addMessage('status', null, data.joined+' entrou no chat!')
     }

     if (data.left) {
          addMessage('status', null, data.left+' saiu no chat!')
     }
     userList = data.list;
     renderUserList();
});

chatInput.addEventListener('keyup', (e) => {
     if (e.keyCode === 13) {
           let txt = chatInput.value.trim();
           chatInput.value = '';

           if (txt != "") {
               addMessage('msg', username, txt);
               socket.emit('msg-request', txt)
           }
     }
});

socket.on('show-msg', (data) => {
     addMessage('msg', data.username, data.message);
});

socket.on('disconnect', () => {
     addMessage('status', null, 'Você foi desconectado');
     userList = [];
     renderUserList();
});

socket.io.on('reconnect_error', () => {
     addMessage('status', null, 'Tentando reconnectar');
});

socket.io.on('reconnect', () => {
     addMessage('status', null, 'Reconectado!');
     if (username != '') {
          socket.emit('join-request', username);
     }
});