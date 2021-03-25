const deleteComment = () => {
    document.getElementById("form-comment-update-delete").action = "/osr/deleteComment";
}
function comment(res_id) {
    if (document.getElementById("comment-section" + res_id).style.display == "block") {
        document.getElementById("comment-section" + res_id).style.display = "none";
    }
    else {
        document.getElementById("comment-section" + res_id).style.display = "block";
        fetch('/osr/comment', {
            method: "POST",
            body: JSON.stringify({
                res_id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res1 => {
                const data = res1.data;
                
                const commentDiv = document.getElementById('comment-section' + res_id);
                const user_id = document.getElementById('current_user_id').value;
                commentDiv.removeChild(commentDiv.firstChild);
                let tbl = document.createElement('table');
                tbl.setAttribute('id', 'hello');
                for (let i = 0; i < data.length; i++) {
                    let row = tbl.insertRow(i);
                    row.id = "tableRow" + i;

                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    let cell4 = row.insertCell(3);

                    cell1.innerHTML = '@' + data[i].username;
                    cell1.style.fontWeight = 'bold';
                    cell2.innerHTML = data[i].comment;
                    let a = document.createElement('a');
                    a.setAttribute('data-toggle', 'modal');
                    a.setAttribute('data-target', '#exampleModal2');
                    let link = document.createTextNode("View Replies");
                    a.appendChild(link);
                    a.style.paddingLeft = "65px";
                    a.href = "#";
                    a.id = data[i].comment_id;
                    cell3.appendChild(a);
                    if (data[i].user_id == user_id) {
                        let b = document.createElement('a');
                        b.setAttribute('data-toggle', 'modal');
                        b.setAttribute('data-target', '#exampleModal3');
                        let link = document.createTextNode("Edit");
                        b.appendChild(link);
                        b.href = "#";
                        b.style.paddingLeft = "25px";
                        b.id = data[i].comment_id;
                        cell4.appendChild(b);
                        b.addEventListener('click', editComment);
                    }
                    else {
                        cell4.innerHTML = "";
                    }
                    a.addEventListener('click', commentReply);
                }
                commentDiv.append(tbl);
            })
            .catch(err => console.log('Fetching failed'))
    }
}

function editComment() {
    const comment_id = this.id;
    fetch('/osr/getComment', {
        method: "POST",
        body: JSON.stringify({
            comment_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            const data = res1.data;
            console.log(data[0].comment);
            document.getElementById('edit_comment_id').value = data[0].comment_id;
            document.getElementById('comment_edit').value = data[0].comment;
        })
        .catch(err => console.log(err));
}

function commentReply() {
    const comment_id = this.id;
    console.log(comment_id);    
    fetch('/osr/commentReply', {
        method: "POST", 
        body: JSON.stringify({
            comment_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            const data = res1.data;
            const commentReplyDiv = document.getElementById('comment-reply');
            document.getElementById('comment_id').value = comment_id;
            commentReplyDiv.removeChild(commentReplyDiv.firstChild);
            let tbl = document.createElement('table');
            for (let i = 0; i < data.length; i++) {
                let row = tbl.insertRow(i);
                row.id = "tableRepliesRow" + i;

                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);

                cell1.innerHTML = '@' + data[i].username;
                cell1.style.fontWeight = 'bold';
                cell2.innerHTML = data[i].comment;
            }
            commentReplyDiv.append(tbl);
        })
        .catch(err => console.log('fetching failed'))
}

const addComment = (res_id) => {
    console.log(res_id);
    fetch('/osr/fetchdetails', {
        method: "POST",
        body: JSON.stringify({
            res_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res => {
            const result = res.data[0];
            console.log(result);
            document.getElementById('commentTitle').value = result.title;
            document.getElementById('CommentRes_id').value = result.res_id;
            console.log(result.description);
        })
        .catch(err => console.log('fetching failed'))
}