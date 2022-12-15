const APP_ID = '' /*agoura app _id*/ 
const CHANNEL ='' /*agoura channel name*/
const TOKEN = ''  /*agoura token*/

let UID;

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let LocalTracks = []
let RemoteUsers = {}

let JoinAndDisplayLocalStream = async() => {
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

JoinAndDisplayLocalStream()
