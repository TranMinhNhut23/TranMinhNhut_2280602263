LoadData();

//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
    try {
        let data = await fetch('http://localhost:3000/posts');
        let posts = await data.json();
        for (const post of posts) {
            let body = document.getElementById("body");
            body.innerHTML += convertDataToHTML(post);
        }
    } catch (error) {
        console.error("Lỗi LoadData:", error);
    }
}

function convertDataToHTML(post) {
    let result = "<tr>";
    result += "<td>" + post.id + "</td>";
    result += "<td>" + post.title + "</td>";
    result += "<td>" + post.views + "</td>";
    result += "<td><input type='submit' value='Delete' onclick='Delete(" + post.id + ")'></input></td>";
    result += "</tr>";
    return result;
}

//POST hoặc PUT: domain:port//posts + body
async function SaveData() {
    try {
        let id = document.getElementById("id").value;
        let title = document.getElementById("title").value;
        let view = document.getElementById("view").value;

        let response = await fetch("http://localhost:3000/posts/" + id);

        if (response.ok) {
            // PUT (update)
            let dataObj = {
                title: title,
                views: view
            };
            let result = await fetch('http://localhost:3000/posts/' + id, {
                method: 'PUT',
                body: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Update thành công:", await result.json());
        } else {
            // POST (create)
            let dataObj = {
                id: id,
                title: title,
                views: view
            };
            let result = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                body: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("Thêm mới thành công:", await result.json());
        }
    } catch (error) {
        console.error("Lỗi SaveData:", error);
    }
}

//DELETE: domain:port//posts/id
async function Delete(id) {
    try {
        await fetch('http://localhost:3000/posts/' + id, {
            method: 'DELETE'
        });
        console.log("Delete thành công");
    } catch (error) {
        console.error("Lỗi Delete:", error);
    }
}
