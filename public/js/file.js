import axios from 'axios';
import { showAlert } from './alerts';

export const uploadHomework = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/files/uploadFile' ,
            data
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Se entregó tu tarea');
            window.setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}