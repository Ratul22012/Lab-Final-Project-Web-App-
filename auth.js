const API_URL = "http://localhost:8080/api/auth";

async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(!name || !email || !password) return alert("All fields required!");

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.text();
        if(res.ok){
            alert(data);
            window.location.href = "login.html";
        } else {
            alert(data);
        }
    } catch(err){
        alert("Server error: " + err);
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        if(res.ok){
            const data = await res.json();
            localStorage.setItem("username", data.user.name);
            localStorage.setItem("userId", data.user.id);
            alert(data.message);
            window.location.href = "dashboard.html";
        } else {
            const err = await res.text();
            alert(err);
        }
    } catch(err){
        alert("Server error: " + err);
    }
}
