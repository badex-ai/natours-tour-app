/*eslint-disable*/

import '@babel/polyfill';
import {displayMap} from './mapBox';
import {login, logout } from './login';
//import {updateSettings} from './updateSettings ';


console.log('hello from the client side');
//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');




if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations)
};
;
//DELEGATION
if(loginForm)
loginForm.addEventListener('submit', e =>{
    e.preventDefault();
    const email= document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

if(logoutBtn) logoutBtn.addEventListener('click',logout );

if (userDataForm) 
    userDataForm.addEventListener('submit', e => { 
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({name, email},'data'); 

    });

if (userPasswordForm) 
userPasswordForm.addEventListener('submit', async  e => { 
    e.preventDefault();
    document.querySelector('btn--save-password').textContent='Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirmed = document.getElementById('password-confirmed').value
    await updateSettings({passwordCurrent,password,passwordConfirmed});

    document.querySelector('btn--save-password').textContent= 'Save_password';
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirmed').value='';

});