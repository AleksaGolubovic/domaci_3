var currentCityCenter = [43.3194, 21.8960]; 
var map
var markerGroup

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('sidebarAddLocation').style.display='none';
  document.getElementById('sidebarSearchLocation').style.display='none';

  
    map = L.map('map', {
    center: currentCityCenter,
    zoom: 12,
    minZoom: 7,
    maxZoom: 18,
  });

  markerGroup = L.layerGroup().addTo(map);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  
  window.changeCity = function(center) {
    map.setView(center, 12); 
    currentCityCenter = center; 
  };
  
  
  var locationNameInput = document.getElementById('locationName');
  var categorySelect = document.getElementById('category');
  var addLocationButton = document.getElementById('addLocationButton');

  
  categorySelect.addEventListener('input', toggleAddButtonState);

  
  function fetchCategories() {
    fetch('/posts/getAllCategories')
        .then(response => response.json())
        .then(data => {
            
            updateCategoryList(data.categories);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
  }

  
  

fetchCategories();



function updateCategoryList(categories) {
    var categorySelect = document.getElementById('category');
    var searchCategory = document.getElementById('searchCategory');

    
    while (categorySelect.options.length > 0) {
        categorySelect.remove(0);
    }

    while (searchCategory.options.length > 0) {
      searchCategory.remove(0);
  }

    
    categories.forEach(category => {
        var option = document.createElement('option');
        option.value = category;
        option.text = category;
        categorySelect.add(option);
    });

    categories.forEach(category => {
      var option = document.createElement('option');
      option.value = category;
      option.text = category;
      searchCategory.add(option);
  });
}

function handleCategoryChange(){
  
}

  var marker; 



  
  map.on('click', function (e) {
    
    if (marker) {
        map.removeLayer(marker);
    }

    
    marker = L.marker(e.latlng).addTo(map);

    
    document.getElementById('locationForm').setAttribute('data-lat', e.latlng.lat);
    document.getElementById('locationForm').setAttribute('data-lng', e.latlng.lng);

    
    document.getElementById('coordinatesDisplay').innerText = `Coordinates: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
});

function toggleAddButtonState() {
  
  addLocationButton.disabled = !categorySelect.value;
}
});

function loadAllLocations(fcategory,frating) {
  fetch('/posts/getAllPosts')
    .then(response => response.json())
    .then(data => {
      
      
      data.forEach(location => {
        var { rating, coordinates, description, category, _id } = location;
        if(rating==0)
          rating='';
        else
          rating='  Rating: '+rating;
        if (typeof fcategory === 'string' || fcategory instanceof String) {
          if(fcategory===category)
            {
              if(typeof frating === 'string' || frating instanceof String){
                if(frating==='all'){
                    console.log(_id);
                    
                    const marker = L.marker(coordinates).addTo(map);
                    marker.addTo(markerGroup);
                    let popup;
    
                    marker.on('mouseover', function(){
                    
                    
                    popup = L.popup().setContent(`<b>${category}</b><b>${rating}</b><br>${description}`);
                    
                    marker.bindPopup(popup).openPopup();
                    });
                    marker.on('mouseout', function(){
                      
                      if (popup) {
                        marker.closePopup();
                        marker.unbindPopup();
                        popup = null;
                      }
                    });
                  
    
                    
                    marker.on('click', function () {
                      
                      
                      
                    
                    window.location.href = `/post?id=${_id}`;
                    
                    });
    
                  }
                else if(Math.round(Number(location.rating))==Math.round(Number(frating))){
              
                  
                  const marker = L.marker(coordinates).addTo(map);
                  marker.addTo(markerGroup);
                  let popup;

                  marker.on('mouseover', function(){
                  
                  
                  popup = L.popup().setContent(`<b>${category}</b><b>${rating}</b><br>${description}`);
                  marker.bindPopup(popup).openPopup();
                  });
                  marker.on('mouseout', function(){
                    
                    if (popup) {
                      marker.closePopup();
                      marker.unbindPopup();
                      popup = null;
                    }
                  });
                

                  
                  marker.on('click', function () {
                    
                    
                    
                  
                  window.location.href = `/post?id=${_id}`;
                  
                  });
                }
              }
            }
          }else{
            const marker = L.marker(coordinates).addTo(map);
            marker.addTo(markerGroup);
            let popup;

            marker.on('mouseover', function(){
            
            
            popup = L.popup().setContent(`<b>${category}</b><b>${rating}</b><br>${description}`);
            
            marker.bindPopup(popup).openPopup();
            });
            marker.on('mouseout', function(){
              
              if (popup) {
                marker.closePopup();
                marker.unbindPopup();
                popup = null;
              }
            });
          

            
            marker.on('click', function () {
              
              
              
            
            window.location.href = `/post?id=${_id}`;
            
            });
          }
      });
    })
    .catch(error => {
      console.error('Error fetching locations:', error);
    });
}

loadAllLocations();

function addLocation() {

    
    
   
    var categorySelect = document.getElementById('category');
    var category = categorySelect.value;
    var description = document.getElementById('description').value;
    var newCategory = document.getElementById('newCategory').value;
    var latitude = document.getElementById('locationForm').getAttribute('data-lat');
    var longitude = document.getElementById('locationForm').getAttribute('data-lng');
  
    if(latitude == null && longitude == null){
      confirm('Click on the map to pick location!');
      } else{
    
    if (newCategory.trim() !== '') {
      console.log("evo je kategorija")
      category = newCategory;
    }
    
    
  fetch('/users/currentUser', {
      method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
      const user = data._id;
      var data2 = {
        user: user,                   
        category: category,
        description: description,
        coordinates: [latitude, longitude], 
        photos: [], 
      };
      
      const photoInput = document.getElementById('photo');
      const filePromises = Array.from(photoInput.files).map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function (event) {
            const base64String = event.target.result;
            data2.photos.push(base64String);
            resolve();
          };
          reader.onerror = function (error) {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });
      
      
      return Promise.all(filePromises).then(() => data2);
    }).then(data=>{
      
     
      fetch('/posts/addPost', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(responseData => {
          console.log('Location added:', responseData);
          window.location.href = `/`;
          
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}
 
}



function confirmLogout() {
  const confirmLogout = confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    fetch('/users/logout', {
      method: 'POST',
      credentials: 'same-origin', 
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = '/';
      } else {
        alert('Logout failed. Please try again.'); 
      }
    })
    .catch(error => {
      console.error('Error during logout:', error.message);
      alert('Error during logout. Please try again.');
    });
  }
}

function openAddSidebar(){
  document.getElementById('sidebarAddLocation').style.display = 'block';
  document.getElementById('sidebarMain').style.display = 'none';
}

function openSearchSidebar(){
  document.getElementById('sidebarSearchLocation').style.display = 'block';
  document.getElementById('sidebarMain').style.display = 'none';
}

function openMainSidebar(){
  document.getElementById('sidebarAddLocation').style.display = 'none';
  document.getElementById('sidebarSearchLocation').style.display = 'none';
  document.getElementById('sidebarMain').style.display = 'block';
}

function returnToHome() {
  openMainSidebar();
}

function displayCategoryMarkers(){
  markerGroup.clearLayers();
  var category = document.getElementById('searchCategory').value;
  console.log(category);
  loadAllLocations(category,document.getElementById('ratingSelect').value);
 
  
  
  
  
  
  
}

function handleRatingChange(){
  markerGroup.clearLayers();
  var category = document.getElementById('searchCategory').value;
  var rank = document.getElementById('ratingSelect').value; 
  console.log(category);
  loadAllLocations(category,rank);
}


























