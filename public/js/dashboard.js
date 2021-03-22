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

function FirstLike(res_id){
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
function FirstUnlike(res_id){
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
