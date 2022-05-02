import 'regenerator-runtime/runtime';
import { uploadHomework } from './file';
import { acceptUsers, createGroup,requestAccessF,shareGroup } from './group';
import { createHomework } from './homework';
import { login, logout } from './login';
import { signup } from './signup';
import { updateUser } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.signup');
const logoutButton = document.querySelector('.nav__el--logout');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const homeworkForm = document.querySelector('.form--homework');
const groupForm = document.querySelector('.form--group');
const shareButtons = document.querySelectorAll('.share-button');
const acceptButtons = document.querySelectorAll('.request-button');
const uploadFileForm = document.querySelector('.form--file');
const requestAccess = document.querySelector('.request-access');



if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault(); 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(name, email, password, passwordConfirm);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

if (updateUserForm) {
    updateUserForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateUser(form,'data');
    });
}
if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateUser({ currentPassword, password, passwordConfirm }, 'password');
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}
if (homeworkForm) {
    homeworkForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const timeLimit = document.getElementById('timeLimit').value;
        const group = document.getElementById('group').value;
        createHomework(name, description, timeLimit,group);
    });
}
if (groupForm) {
    groupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const school = document.getElementById('school').value;
        const sequence = document.getElementById('sequence').value;
        const description = document.getElementById('description').value;
        createGroup(name, school, sequence, description);
    });
}
if (shareButtons) {
    shareButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const tooltip = document.getElementById('myTooltip');
            shareGroup(btn, tooltip);
        });
    });
}
if (acceptButtons) {
    acceptButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const data = document.getElementById('requestButton').value;
            const student = data.split(' ')[0];
            const slug = data.split(' ')[1];

            acceptUsers(student,slug)
        })
    })
}
if (uploadFileForm) {
    uploadFileForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('summary', document.getElementById('summary').value);
        form.append('homework', document.getElementById('homework').value);
        form.append('doc', document.getElementById('doc').files[0]);
        uploadHomework(form);
    });
}
if (requestAccess) {
    requestAccess.addEventListener('click', () => {
        const slug = document.getElementById('request').value;
        requestAccessF(slug);
    })
}



