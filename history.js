window.onload = async function () {
    const tbody = document.getElementById("history-body");
    const userId = localStorage.getItem("userId");

    try {
        const res = await fetch(`http://localhost:8080/api/score/history/${userId}`);
        if (res.ok) {
            const scores = await res.json();
            scores.forEach(s => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${new Date(s.date).toLocaleString()}</td>
                                 <td>${s.wpm}</td>
                                 <td>${s.cpm || 0}</td>
                                 <td>${s.accuracy}</td>
                                 <td>${s.errors}</td>
                                 <td>${s.verdict || "N/A"}</td>`;
                tbody.appendChild(row);
            });
        } else {
            const err = await res.text();
            console.log("Error fetching scores:", err);
        }
    } catch (err) {
        console.log("Server error:", err);
    }
};
