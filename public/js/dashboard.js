const setDeleteAction = () => {
    document.getElementById("form-update-delete").action = "/osr/delete";
}
const ratingZeroLike = (rating_id) => {
    console.log(rating_id);
    fetch('/osr/ratingZeroLike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

const ratingZeroUnlike = (rating_id) => {
    fetch('/osr/ratingZeroUnlike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

const ratingOneLike = (rating_id) => {
    console.log(rating_id);
    fetch('/osr/ratingOneLike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

const ratingOneUnlike = (rating_id) => {
    fetch('/osr/ratingOneUnlike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

const ratingMinusOneLike = (rating_id) => {
    console.log(rating_id);
    fetch('/osr/ratingMinusOneLike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

const ratingMinusOneUnlike = (rating_id) => {
    fetch('/osr/ratingMinusOneUnlike', {
        method: "POST",
        body: JSON.stringify({
            rating_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}

function FirstLike(res_id) {
    console.log(res_id);
    fetch('/osr/FirstLike', {
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
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}
function FirstUnlike(res_id) {
    console.log(res_id);
    fetch('/osr/FirstUnlike', {
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
            location.reload();
        })
        .catch(err => console.log('fetching failed'))
}
function comment(res_id) {
    // console.log(res_id)
    if (document.getElementById("myTable" + res_id).style.display == "block") {
        document.getElementById("myTable" + res_id).style.display = "none"
        location.reload()
    }
    else {
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
                document.getElementById("myTable" + res_id).style.display = "block"
                // const comment_div = document.getElementById('comment-div');
                var tbodyRef = document.getElementById('myTable' + res_id);
                for (var i = 0; i < res1.data.length; i++) {
                    var newRow = tbodyRef.insertRow();
                    newRow.setAttribute("id", i);
                    // console.log(document.getElementById(i))
                    // Insert a cell at the end of the row
                    var tbl = document.createElement("table");
                    const id = 'comment' + parseInt(res1.data[i].comment_id)
                    tbl.setAttribute('id', id);
                    const tbl_id = document.getElementById(id);
                    console.log(tbl_id);
                    var tr = document.createElement('tr');
                    var td = document.createElement("td");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var a = document.createElement('a');
                    var link = document.createTextNode("reply");
                    a.appendChild(link);
                    a.id = res1.data[i].comment_id
                    a.href = "#";
                    td.appendChild(document.createTextNode('@' + res1.data[i].username));
                    td1.appendChild(document.createTextNode(res1.data[i].comment));
                    td2.appendChild(a);
                    td.style.fontWeight = 'bold'
                    tr.appendChild(td);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tbl.appendChild(tr);
                    var newCell = newRow.insertCell();
                    newCell.appendChild(tbl)
                    document.getElementById(a.id).onclick = commentReply
                    // console.log(document.getElementById(a.id))
                    // var newCell1 = newRow.insertCell();
                    // var newCell2 = newRow.insertCell();

                    // // Append a text node to the cell
                    // newCell.appendChild(document.createTextNode('@' + res1.data[i].username));
                    // newCell1.appendChild(document.createTextNode(res1.data[i].comment));
                    // newCell2.appendChild(a);
                    // console.log('A_id' + a.id);
                }
            })
            .catch(err => console.log('fetching failed'))
    }
}

function commentReply() {
    console.log(this.id);
    //console.log('this.id' + this.id);
    c_id = this.id
    console.log(this.parentNode.parentNode.parentNode.id)
    var x = this.parentNode.parentNode.parentNode.id
    console.log(document.getElementById(x))
    var table = document.getElementById(x)
    console.log(table)
    // var x = this.parentNode.parentNode.parentNode.parentNode.id;
    // console.log('X' +x);
    // var table = document.getElementById(x)
    // var r = parseInt(this.parentNode.parentNode.id)+1;
    fetch('/osr/commentReply', {
        method: "POST",
        body: JSON.stringify({
            c_id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(res1 => {
            //var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

            // Insert a row at the end of table
            var newRow = table.insertRow();

            // Insert a cell at the end of the row
            var newCell = newRow.insertCell();
            var newCell1 = newRow.insertCell();

            // Append a text node to the cell
            var newText = document.createTextNode('new row');
            newCell1.appendChild(newText);
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
const update = (res_id) => {
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
            document.getElementById('title').value = result.title;
            document.getElementById('description').value = result.description;
            document.getElementById('res_id').value = result.res_id;
            console.log(result.description);
        })
        .catch(err => console.log('fetching failed'))
}