import ADMIN_EMAIL from "./AdminDetails";
import myContext from "../context/data/myContext";
import { useContext, useState } from 'react';

const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    // Check if the user is logged in and has an email
    if (user && user.user.email) {
        const email = user.user.email.toLowerCase();
        return user.user.isAdmin || ADMIN_EMAIL.includes(email);
    }
    return false;
}

const isDept = async () => {
    const context = useContext(myContext);
    const { getMyDept } = context;

    const user = JSON.parse(localStorage.getItem("user"));
    // Check if the user is logged in and has an email
    if (user && user.user.email) {
        const data = await getMyDept(user.user.email);
        console.log(data);
        return data !== false && data.department !== null;
    }
    return false;
}

export { isAdmin, isDept };