export const inputTypes = {
    default: "text",
    password: "password",
    email: "email",
    dropDown: "dropDown"
}

export const messageTypes = {
    error: "error",
    warning: "warn",
    success: "success",
    info: "info"
}

export const logout = () => {
    localStorage.removeItem('bearer_token');
}

export const formatDate = (date) => {
    return date.split('T')[0];
}

export const formatTime = (time) => {
    return time.split('T')[1].split('.')[0];
}

export const getFormData = form => {
    const data = {};

    for (const element of form.elements) {
        if (element.tagName === "BUTTON" || element.name === "")
            continue;

        data[element.name] = element.value;
    }

    return data;
}