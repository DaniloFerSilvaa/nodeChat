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
               ul.innerHTML += '<li><span>'+user+'</span>'+msg+'</li>'
               break
     }

}

//APARTIR DO LOGIN
loginInput.addEventListener('keyup', (e) => {
     if (e.keyCode === 13) {
           let name = loginInput.value.trim();
           if (name != "") {
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


