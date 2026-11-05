
const http = require("http");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function startServer() {
    await client.connect();

    const db = client.db("registrationDB");
    const users = db.collection("users");

    const server = http.createServer((req, res) => {

        if (req.url === "/" && req.method === "GET") {
            res.writeHead(200, { "Content-Type": "text/html" });
            fs.createReadStream("home.html").pipe(res);
        }

        else if (req.url === "/style.css") {
            res.writeHead(200, { "Content-Type": "text/css" });
            fs.createReadStream("style.css").pipe(res);
        }

        else if (req.url === "/server" && req.method === "POST") {
            let data = "";

            req.on("data", chunk => {
                data += chunk;
            });

            req.on("end", async () => {
                try {
                    const form = new URLSearchParams(data);

                    const user = {
                        name: form.get("name")?.trim(),
                        password: form.get("password"),
                        age: Number(form.get("age")),
                        mobile: form.get("mobile"),
                        email: form.get("email")?.trim(),
                        gender: form.get("gender"),
                        state: form.get("state"),
                        skills: form.getAll("skills")
                    };

                    if (
                        !user.name ||
                        !user.password ||
                        user.password.length < 6 ||
                        !Number.isInteger(user.age) ||
                        user.age < 1 || user.age > 120 ||
                        !/^[0-9]{10}$/.test(user.mobile || "") ||
                        !user.email ||
                        !["Male", "Female"].includes(user.gender) ||
                        !user.state ||
                        user.skills.length === 0
                    ) {
                        res.writeHead(400, {
                            "Content-Type": "text/plain"
                        });
                        return res.end("Invalid details. Please go back and try again.");
                    }

                    // Save details in MongoDB
                    const result = await users.insertOne(user);

                    // Retrieve the exact inserted document
                    const savedUser = await users.findOne({
                        _id: result.insertedId
                    });

                    function escapeHTML(value) {
                        return String(value).replace(/[&<>"']/g, ch => ({
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        })[ch]);
                    }

                    const details = [
                        ["Name", savedUser.name],
                        ["Password", savedUser.password],
                        ["Age", savedUser.age],
                        ["Mobile Number", savedUser.mobile],
                        ["Email", savedUser.email],
                        ["Gender", savedUser.gender],
                        ["State", savedUser.state],
                        ["Skills", savedUser.skills.join(", ")]
                    ];

                    let rows = "";

                    details.forEach(item => {
                        rows += `
                            <tr>
                                <td>${escapeHTML(item[0])}</td>
                                <td>${escapeHTML(item[1])}</td>
                            </tr>`;
                    });

                    res.writeHead(200, {
                        "Content-Type": "text/html; charset=utf-8"
                    });

                    res.end(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport"
                                  content="width=device-width, initial-scale=1.0">
                            <title>Registration Successful</title>
                            <link rel="stylesheet" href="/style.css">
                        </head>
                        <body>
                            <div class="container">
                                <h1>Registration Successful!</h1>
                                <p class="subtitle">
                                    Your details have been saved successfully.
                                </p>

                                <table>
                                    ${rows}
                                </table>

                                <p style="text-align:center">
                                    <a href="/">Register Another User</a>
                                </p>
                            </div>
                        </body>
                        </html>
                    `);

                } catch (error) {
                    console.error(error);
                    if (!res.headersSent) {
                        res.writeHead(500, {
                            "Content-Type": "text/plain"
                        });
                    }
                    res.end("Unable to save registration details.");
                }
            });
        }

        else {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end("Page not found");
        }
    });

    server.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}

startServer().catch(console.error);
