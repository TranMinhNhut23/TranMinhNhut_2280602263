LoadData();

//GET: domain:port//posts
async function LoadData() {
    try {
        let data = await fetch('http://localhost:3000/posts');
        let posts = await data.json();

        let body = document.getElementById("body");
        body.innerHTML = "";

        for (const post of posts) {
            if (!post.isDelete) {
                body.innerHTML += convertDataToHTML(post);
            }
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
        let title = document.getElementById("title").value;
        let view = document.getElementById("view").value;

        let data = await fetch("http://localhost:3000/posts");
        let posts = await data.json();

        let newId = 1;
        if (posts.length > 0) {
            newId = Math.max(...posts.map(p => parseInt(p.id) || 0)) + 1;
        }

        let dataObj = {
            id: newId,
            title: title,
            views: view,
            isDelete: false
        };

        let result = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: JSON.stringify(dataObj),
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Thêm mới thành công:", await result.json());
        LoadData();
    } catch (error) {
        console.error("Lỗi SaveData:", error);
    }
}


// Soft Delete: update record thành isDelete = true
async function Delete(id) {
    try {
        let response = await fetch('http://localhost:3000/posts/' + id);
        if (response.ok) {
            let post = await response.json();
            post.isDelete = true;

            await fetch('http://localhost:3000/posts/' + id, {
                method: 'PUT',
                body: JSON.stringify(post),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Xóa mềm thành công");
            LoadData();
        }
    } catch (error) {
        console.error("Lỗi Delete:", error);
    }
}
