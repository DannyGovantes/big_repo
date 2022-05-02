import axios from "axios";
import { async } from "regenerator-runtime";
import { showAlert } from './alerts';

export const createGroup = async (name, school, sequence, description) => {
    try {    
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/groups/newGroup',
            data: {
                name,
                school,
                sequence,
                description
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Grupo creado');
            window.setTimeout(() => {
                location.assign('/myGroups')
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const shareGroup = (shareLink,tooltip) => {
    navigator.clipboard.writeText(shareLink.value);
    tooltip.innerHTML = "¡Copiado al portapapeles!";
}
export const acceptUsers = async (student, slug) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/groups/acceptUser',
            data: {
                student,
                slug
            }
        });
        if (res.data.status === 'succcess') {
            showAlert('success', 'Alumno aceptado');
            window.setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}
export const requestAccessF = async (slug) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4000/api/v1/groups/requestAccess',
            data: {
                slug
            }
        });
        if (res.data.status === 'succcess') {
            showAlert('success', 'Solicitud Enviada');
            window.setTimeout(() => {
                location.assign('/');
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}
