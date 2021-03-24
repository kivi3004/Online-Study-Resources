let flag = 0;
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
                commentDiv.removeChild(commentDiv.firstChild);
                let tbl = document.createElement('table');
                tbl.setAttribute('id', 'hello');
                for (let i = 0; i < data.length; i++) {
                    let row = tbl.insertRow(i);
                    row.id = "tableRow" + i;

                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);

                    cell1.innerHTML = '@' + data[i].username;
                    cell1.style.fontWeight = 'bold';
                    cell2.innerHTML = data[i].comment;
                    let a = document.createElement('a');
                    a.setAttribute('data-toggle', 'modal');
                    a.setAttribute('data-target', '#exampleModal2');
                    let link = document.createTextNode("View Replies");
                    a.appendChild(link);
                    a.href = "#";
                    a.id = data[i].comment_id;
                    cell3.appendChild(a);

                    a.addEventListener('click', commentReply);
                }
                commentDiv.append(tbl);
            })
            .catch(err => console.log('fetching failed'))
    }
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
            // tbl.setAttribute('id', 'hello');
            for (let i = 0; i < data.length; i++) {
                let row = tbl.insertRow(i);
                row.id = "tableRepliesRow" + i;

                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                // let cell3 = row.insertCell(2);

                cell1.innerHTML = '@' + data[i].username;
                cell1.style.fontWeight = 'bold';
                cell2.innerHTML = data[i].comment;
                // let a = document.createElement('a');
                // a.setAttribute('data-toggle', 'modal');
                // a.setAttribute('data-target', '#exampleModal2');
                // let link = document.createTextNode("View Replies");
                // a.appendChild(link);
                // a.href = "#";
                // a.id = data[i].comment_id;
                // cell3.appendChild(a);

                // a.addEventListener('click', commentReply);
            }
            commentReplyDiv.append(tbl);

            //var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

            // Insert a row at the end of table
            // var newRow = table.insertRow();

            // // Insert a cell at the end of the row
            // var newCell = newRow.insertCell();
            // var newCell1 = newRow.insertCell();

            // // Append a text node to the cell
            // var newText = document.createTextNode('new row');
            // newCell1.appendChild(newText);
            // var td = document.createElement('td')
            // var tbl = document.createElement('table');
            // for (var i = 0; i < res1.reply.length; i++) {
            //     var tr = document.createElement('tr');

            //     var td1 = document.createElement('td');
            //     var td2 = document.createElement('td');
            //     td1.appendChild(document.createTextNode('@' + res1.reply[i].username));
            //     td2.appendChild(document.createTextNode(res1.reply[i].comment));
            //     td1.style.fontWeight = 'bold'

            //     tr.appendChild(td1)
            //     tr.appendChild(td2)
            //     tbl.appendChild(tr);
            //     console.log("ok")
            // }
            // // var row = table.insertRow(r);
            // // var celltr = row.insertCell(0);
            // // row.appendChild(tbl);
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