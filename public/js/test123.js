/*eslint-disable*/
import axios from 'axios';
const loginForm = document.querySelector('.login-form');

const loginUser = async( email, password) =>  {
    try{
        console.log(email,password);
        await axios ({
       method: 'POST',
       url: 'http://127.0.0.1:3000/api/v1/users/login',
       data: {
         email,
         password
   }
   } 
   );
       if (res.data.status === 'success') {
           alert('succesfull')
       }
   } catch(err){
       alert('something went wrong')
   }
   };

loginForm.addEventListener('submit', e =>{
e.preventDefault();
const password = document.getElementById('password').value;
const email = document.getElementById('email').value;
loginUser(email,password)}

)

