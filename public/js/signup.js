function isValid(str) {
  var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
  return regex.test(str);
}
function checkPassword(e) {
  var keynum;
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }
  let ch = String.fromCharCode(keynum);
  const val = document.getElementById('password').value;
  if (val.length >= 8 && val.length <= 16) {
    document.getElementById('charactersLong').style.color = 'green';
  }
  else {
    document.getElementById('charactersLong').style.color = 'red';
  }
  if (isValid(ch)) {
    document.getElementById('special').style.color = 'green';
  }
  if (!(ch >= '0' && ch <= '9') && ch == ch.toUpperCase()) {
    document.getElementById('uppercase').style.color = 'green';
  }
  if (!(ch >= '0' && ch <= '9') && ch == ch.toLowerCase()) {
    document.getElementById('lowercase').style.color = 'green';
  }
}
const keyDown = document.getElementById('password');
keyDown.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'Backspace' || key === 'Delete') {
    let str = document.getElementById('password').value;
    str = str.substring(0, str.length - 2);
    let uppercase = 0;
    let lowercase = 0;
    let special = 0;

    if (str.length >= 8 && str.length <= 16) document.getElementById('charactersLong').style.color = 'green';
    else document.getElementById('charactersLong').style.color = 'red';

    for (let i = 0; i < str.length; i++) {
      if (!(str[i] >= '0' && str[i] <= '9') && str[i] == str[i].toUpperCase()) uppercase = 1;
      if (!(str[i] >= '0' && str[i] <= '9') && str[i] == str[i].toLowerCase()) lowercase = 1;
      if (isValid(str[i])) special = 1;
    }

    if (uppercase === 1) document.getElementById('uppercase').style.color = 'green';
    else document.getElementById('uppercase').style.color = 'red';

    if (lowercase === 1) document.getElementById('lowercase').style.color = 'green';
    else document.getElementById('lowercase').style.color = 'red';

    if (special === 1) document.getElementById('special').style.color = 'green';
    else document.getElementById('special').style.color = 'red';
  }
})

function setColor() {
  document.getElementById('charactersLong').style.color = 'red';
  document.getElementById('uppercase').style.color = 'red';
  document.getElementById('lowercase').style.color = 'red';
  document.getElementById('special').style.color = 'red';
}

function checkValidation() {
  const characters = document.getElementById('charactersLong').style.getPropertyValue("color");
  const uppercase = document.getElementById('uppercase').style.color;
  const lowercase = document.getElementById('lowercase').style.color;
  const special = document.getElementById('special').style.color;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('passwordConfirm').value;
  if (uppercase === 'green' && characters === 'green' && lowercase === 'green' && special === 'green' && password === confirmPassword) {
    return true;
  }
  if (uppercase === 'red') alert('Password must contain atleast one Upper case Character.');
  else if (lowercase === 'red') alert('Password must contain atleast one Lower case Character.');
  else if (special === 'red') alert('Password must contain atleast one Special Character.');
  else if (characters === 'red') alert('Password must be atleast 8-16 characters long.');
  else alert("Password doesn't matched");
  return false;
}