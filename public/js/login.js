/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    console.log('login request sent');
    // console.log(res);
    console.log(res.data.status);

    if (res.data.status === 'success') {
      console.log('login request successful');
      console.log(res.data);

      showAlert('success', 'Logged in successfully!');
      //  console.log('received result from the backend',res.data)

      // window.setTimeout(() => {
      //   window.location.assign('./');
      // }, 1500);
    }
  } catch (err) {
    console.log(err);
    console.log('login error notification');
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
      withCredentials: true,
    });
    if ((res.data.status = 'success')) location.reload();
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
