import axios from "axios";
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
    try {    
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Bienvenido');
            window.setTimeout(() => {
                location.assign('/')
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
