import fs from "fs";

const data = JSON.parse(fs.readFileSync("./events-test.json", "utf8"));
const token = "";

for (const event of data) {
    await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event)
    })
        .then((res) => res.json())
        .then((r) => console.log(r.message || r))
        .catch(console.error);
}