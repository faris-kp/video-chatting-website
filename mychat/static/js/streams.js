const APP_ID = 'fdace256278a4fbf969f89c72a20ec32'
const CHANNEL ='main'
const TOKEN = '007eJxTYFBOY4tavzb8oc6f3i2HVjNNLYw79UY1eHvKyuI9PTpVLzQVGNJSEpNTjUzNjMwtEk3SktIszSzTLCyTzY0SjQxSk42NlKfOSW4IZGSoygxgYmSAQBCfhSE3MTOPgQEAeucfyg=='


// const APP_ID = '' /*agoura app _id*/ 
// const CHANNEL ='' /*agoura channel name*/
// const TOKEN = ''  /*agoura token*/


let UID;

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let LocalTracks = []
let RemoteUsers = {}

let JoinAndDisplayLocalStream = async() => {

    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)

    UID = await client.join(APP_ID,CHANNEL,TOKEN,null)

    LocalTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player =`<div class="video-container" id="user-container-${UID}">
                    <div class="username"><span class="user-name">My Name</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`
    
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    LocalTracks[1].play(`user-${UID}`)

    await client.publish([LocalTracks[0], LocalTracks[1]])
}

let handleUserJoined = async(user,mediaType) =>{
    RemoteUsers[user.uid]=user
    await client.subscribe(user,mediaType)


    if(mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null)
        {
            player.remove()
        }
        player =`<div class="video-container" id="user-container-${user.uid}">
                    <div class="username"><span class="user-name">My Name</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
    
}
let handleUserLeft = async(user) =>{
    delete RemoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () =>{
    for(let i=0;LocalTracks.length > i;i++){
            LocalTracks[i].stop()
            LocalTracks[i].close()
    }
    await client.leave()
    window.open('/','_self')
}

JoinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)

