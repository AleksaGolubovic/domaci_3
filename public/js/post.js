const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

function fillUserInfo(){
  fetch(`/posts/getPost/${postId}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    console.log('Current user ID:', data.user);
      document.getElementById('poster-name').textContent = data.user.username;

      fetch(`/users/getUserPosts/${data.user._id}`, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('postCount').textContent = data.length;
        var sum=0;
        for (let i = 0; i < data.length; i++) {
          sum += data[i].rating;
        }
        document.getElementById('averageRating').textContent =(sum / data.length).toFixed(2);
      })
    

    });
}
fillUserInfo();


fetch(`/posts/getPost/${postId}`)
.then(response => response.json())
.then(data => {
    console.log(data);
    const { coordinates, description, category, _id, rating, comments, photos } = data;
    const mainImage = document.getElementById('mainImage');
    mainImage.src = photos[0];

    const thumbnailGallery = document.getElementById('thumbnailGallery');
    photos.forEach((image, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = image;
    thumbnail.alt = `Thumbnail ${index + 1}`;
    thumbnail.className = 'thumbnail';

    
    thumbnail.addEventListener('click', () => {
      mainImage.src = image;
    });

    thumbnailGallery.appendChild(thumbnail);
  });


  const ratingContainer = document.getElementById('ratingContainer');
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.innerHTML = '&#9733;'; 
    if(i <= rating){
    star.className = 'star';
    }
    else{
    star.className = 'starGray';
    }
    
    star.addEventListener('click', () => {
      alert(`Ocena: ${i}`);
     
     const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ rating: i }), 
      };
    
    fetch(`/posts/updatePost/${postId}`, requestOptions)
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
    console.log('Post successfully updated:', data);
    window.location.href = `/post?id=${postId}`;
    
    })
    .catch(error => {
    console.error('Error updating post:', error);
    
    });

    });

    ratingContainer.appendChild(star);
  }


    const postDescElement = document.getElementById('deskripcija');
    postDescElement.innerText = description;
    document.body.appendChild(postDescElement);

    showComments(comments);
})
.catch(error => {
  console.error('Error fetching location:', error);
});

function showComments(commentsData) {
    const commentsContainer = document.getElementById('commentsContainer');
    console.log(commentsData);

    
    commentsData.forEach(comment => {
      const commentElement = createCommentElement(comment);
      commentsContainer.appendChild(commentElement);
    });
  }
  
  
  function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
  
    const userTextElement = document.createElement('div');
    userTextElement.classList.add('user-text');
  
    const userElement = document.createElement('div');
    userElement.classList.add('user');
    userElement.textContent = comment.user.username; 
  
    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.textContent = comment.text; 
  
    userTextElement.appendChild(userElement);
    userTextElement.appendChild(textElement);
  
    commentElement.appendChild(userTextElement);
  
    return commentElement;
  }
  
  
  function createReplyElement(reply) {
    const replyElement = document.createElement('div');
    replyElement.className = 'comment reply';
  
    
    const userAvatar = document.createElement('img');
    userAvatar.src = reply.avatar;
    userAvatar.alt = 'User Avatar';
    userAvatar.className = 'user-avatar';
    replyElement.appendChild(userAvatar);
  
    
    const replyText = document.createElement('div');
    replyText.className = 'comment-text reply-text';
    replyText.innerHTML = `<strong>${reply.user}</strong>: ${reply.text}`;
    replyElement.appendChild(replyText);
  
    return replyElement;
  }
  
  
  function addComment() {
    fetch('/users/currentUser', {
      method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
    console.log('Current user ID:', data);
      const user = data._id;
    const newCommentText = document.getElementById('newCommentText').value;
    console.log('Current user ID:', user);
    console.log('New comment text:', newCommentText);
    if (newCommentText.trim() !== '') {
      const newComment = {
        post: postId,
        user: user, 
        text: newCommentText
      };
      console.log(newComment);
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ newComment }), 
      };

    fetch(`/comment/addCommentToPost/`, requestOptions)
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
    })
    .then(data => {
    console.log('Post successfully updated:', data);
    
    window.location.href = `/post?id=${postId}`;
    })
    .catch(error => {
    console.error('Error updating post:', error);
    
    });
  
      
      document.getElementById('newCommentText').value = '';
  
      
      
    }
  }).catch((error) => {
    console.error('Error:', error);
});
}
  
  
  
  document.getElementById('addCommentButton').addEventListener('click', addComment);
  
  
  function deletePost() {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`/posts/deletePost/${postId}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Post successfully deleted:', data);
        
        window.location.href = `/`;
      })
      .catch(error => {
        console.error('Error deleting post:', error);
        
      });
  }
  
  fetch(`/comment/getAllComments/${postId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    
    console.log('All comments:', data);
    showComments(data);
    

  })
  .catch(error => {
    console.error('Error getting all comments:', error);
    
  });

  function returnToHome() {
    window.location.href = `/`;
  }