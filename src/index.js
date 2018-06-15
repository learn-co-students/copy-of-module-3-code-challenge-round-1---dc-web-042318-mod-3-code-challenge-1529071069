  const imageId = 3 //Enter your assigned imageId here
  const imageURL = `https://randopic-challenge.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic-challenge.herokuapp.com/likes/`
  const commentsURL = `https://randopic-challenge.herokuapp.com/comments/`

function getImageData() {
	return fetch(imageURL)
		.then(resp=>resp.json())

}

function getImageNode() {
	return document.querySelector('#image')
}

function getNameNode() {
	return document.querySelector('#name')
}

function getLikesNode() {
	return document.querySelector('#likes')
}

function getCommentsNode() {
	return document.querySelector('#comments')
}

function getFormNode() {
	return document.querySelector('#comment_form')
}


function parseImageData(imageData) {
	getNameNode().innerHTML = imageData.name
	getImageNode().src = imageData.url 
	getLikesNode().innerHTML = imageData.like_count
	getCommentsNode().innerHTML = ''
	imageData.comments.forEach((comment)=>{
		let commentLi = `<li>${comment.content}<button data-id='${comment.id}' name='delete' onClick='deleteComment(this)'>Delete</button></li>`
		getCommentsNode().innerHTML += commentLi
	})
}

function deleteComment(button) {
	return fetch(commentsURL+button.dataset.id, {
		method: 'delete',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		}
	}).then(()=>refreshScreen())
}

function getFormData() {
	let content = getFormNode().querySelector('#comment_input').value
	let image_id = imageId
	return {content, image_id}
}

function postComment() {
	return fetch(commentsURL, {
		method: 'post',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		},
		body: JSON.stringify(getFormData())
	}).then(resp=>resp.json())
	.then(json=>console.log(json))
}

function refreshScreen() {
	getImageData()
		.then(image=>parseImageData(image))
}

function addFormEventListener() {
	getFormNode().addEventListener('submit', (e)=>{
		e.preventDefault();
		postComment()
		.then(()=>refreshScreen())
		.then(()=>{
			getFormNode().querySelector('#comment_input').value = ''
		})
	})
}

function updateLikes() {
		return fetch(likeURL, {
		method: 'post',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		},
		body: JSON.stringify({image_id: imageId})
	}).then(resp=>resp.json())
}

function addLikeEventListener() {
	document.querySelector('#like_button').addEventListener('click', (e)=>{
		getLikesNode().innerHTML = parseInt(getLikesNode().innerHTML) + 1
		updateLikes()
			// Commented this out because you asked for optimistic rendering. 
			// My original code was refreshing screen data with a new fetch
			// .then(()=>refreshScreen());
	})
}




document.addEventListener('DOMContentLoaded', function() {
	refreshScreen();
	addFormEventListener();
	addLikeEventListener();



})
