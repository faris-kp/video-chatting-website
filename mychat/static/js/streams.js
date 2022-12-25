const APP_ID = 'fdace256278a4fbf969f89c72a20ec32'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('UID')

let NAME = sessionStorage.getItem('name')

// const APP_ID = '' /*agoura app _id*/ 
// const CHANNEL ='' /*agoura channel name*/
// const TOKEN = ''  /*agoura token*/



const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let LocalTracks = []
let RemoteUsers = {}

let JoinAndDisplayLocalStream = async() => {
    document.getElementById('room-name').innerText = CHANNEL

    client.on('user-published',handleUserJoined)
    client.on('user-left',handleUserLeft)
    try{
        await client.join(APP_ID,CHANNEL,TOKEN,UID)
    }catch(error){
        console.error(error)
        window.open('/', '_self')
    }

    

    LocalTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createMember()

    let player =`<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
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
                    <div class="username-wrapper"><span class="user-name">My Name</span></div>
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

let toggleCamera = async (e) =>{
    if(LocalTracks[1].muted){
        await LocalTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await LocalTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}
let toggleMic = async (e) =>{
    if(LocalTracks[0].muted){
        await LocalTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await LocalTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let createMember = async() =>{
    let response = await fetch('/create_member/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME , 'room_name':CHANNEL ,'UID':UID})
       
    })
    let member = await response.json()
    return member
}

JoinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)

