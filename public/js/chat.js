const socket = io();

//elements
const $messageForm = document.querySelector('#form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send_location');
const $messages = document.querySelector('#messages');

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

socket.on('message', (message) =>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const text = e.target.elements.message.value;
    if(!text){
        document.getElementById('main').innerHTML = 'Please provide a message';
    }else{
        socket.emit('sendMessage', text, (error) => {
            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value ='';
            $messageFormInput.focus();
            if(error){
                return console.log(error);
            }
            console.log('Message delivered!');
        });
    }
})

document.querySelector('#send_location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not Supported by Your Browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        $locationButton.setAttribute('disabled', 'disabled');
        socket.emit('locationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            $locationButton.removeAttribute('disabled');
            if(error){
                return console.log(error);
            }
            console.log('Your Location has been shared!');
        });
    })

})
