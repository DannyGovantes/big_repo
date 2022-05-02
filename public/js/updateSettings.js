import axios from "axios";
import { showAlert } from "./alerts";

export const updateUser = async (data, type) => {
    try {
        const url = type === 'password' ?
                'http://localhost:4000/api/v1/users/updatePassword' :
                'http://localhost:4000/api/v1/users/updateMe'
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', '¡Enhorabuena! tus datos se actualizaron correctamente');
        }
    } catch (error) {
        showAlert('error', err.response.data.message);   
    }
}