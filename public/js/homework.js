import axios from "axios";
import { showAlert } from './alerts';

export const createHomework = async (name, description, timeLimit,group) => {
    try {    
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/homework',
            data: {
                name,
                description,
                timeLimit,
                group
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Tarea creada');
            window.setTimeout(() => {
                location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const updateHomework = async(description, timeLimit) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/homework',
            data: {
                description,
                timeLimit
            }
        });
    } catch (error) {
        
    }
}
