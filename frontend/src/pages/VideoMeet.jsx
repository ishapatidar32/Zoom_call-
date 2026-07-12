import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, IconButton, TextField, Snackbar } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LinkIcon from '@mui/icons-material/Link'
import { getVideoGridClass } from '../utils/meetgride';
import { copyMeetingLink } from '../utils/meetlink';
import { copyMeetingCode } from '../utils/meetcode';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
   iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "75fc5e6173607011940de046",
        credential: "1sfQTs3qToryGcWs",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "75fc5e6173607011940de046",
        credential: "1sfQTs3qToryGcWs",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "75fc5e6173607011940de046",
        credential: "1sfQTs3qToryGcWs",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "75fc5e6173607011940de046",
        credential: "1sfQTs3qToryGcWs",
      },
  ],
}

export default function VideoMeetComponent() {

    const navigate = useNavigate();
    const { url: meetingCode } = useParams();

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    let [linkCopied, setLinkCopied] = useState(false);
    let [codeCopied, setCodeCopied] = useState(false);

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
    console.log("HELLO")
    getPermissions();
    }, []);   

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

   /* useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])*/
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
          if (videoAvailable || audioAvailable) {
            navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        }
    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue
            window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
            });
            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream);
                });
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }    
    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }
    let createPeerConnection = (peerId) => {
        if (peerId === socketIdRef.current) return null;
        if (connections[peerId]) return connections[peerId];

        connections[peerId] = new RTCPeerConnection(peerConfigConnections);

        connections[peerId].onicecandidate = (event) => {
            if (event.candidate != null) {
                socketRef.current.emit('signal', peerId, JSON.stringify({ ice: event.candidate }));
            }
        };

        connections[peerId].ontrack = (event) => {
            const remoteStream = event.streams[0];
            let videoExists = videoRef.current.find(video => video.socketId === peerId);

            if (videoExists) {
                setVideos(videos => {
                    const updatedVideos = videos.map(video =>
                        video.socketId === peerId ? { ...video, stream: remoteStream } : video
                    );
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });
            } else {
                let newVideo = {
                    socketId: peerId,
                    stream: remoteStream,
                    autoplay: true,
                    playsinline: true
                };

                setVideos(videos => {
                    const updatedVideos = [...videos, newVideo];
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });
            }
        };

        if (window.localStream !== undefined && window.localStream !== null) {
           window.localStream.getTracks().forEach(track => {
            connections[peerId].addTrack(track, window.localStream);
           });
        } else {
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            window.localStream.getTracks().forEach(track => {
            connections[peerId].addTrack(track, window.localStream);
            });
        }

        return connections[peerId];
    };

    let removePeerConnection = (peerId) => {
        if (connections[peerId]) {
            connections[peerId].close();
            delete connections[peerId];
        }
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    };




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                removePeerConnection(id);
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                  createPeerConnection(socketListId);
            });
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            window.localStream.getTracks().forEach(track => {
                                connections[id2].addTrack(track, window.localStream);
                            });
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const next = !video;
        setVideo(next);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => {
                track.enabled = next;
            });
        }
        if (localVideoref.current) {
            localVideoref.current.style.opacity = next ? '1' : '0';
        }
    }
    let handleAudio = () => {
        const next = !audio;
        setAudio(next);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => {
                track.enabled = next;
            });
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        Object.keys(connections).forEach(removePeerConnection);

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        if (localStorage.getItem("token")) {
            navigate("/home")
        } else {
            navigate("/")
        }
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }
    
     let handleCopyLink = async () => {
        try {
            await copyMeetingLink(meetingCode);
            setLinkCopied(true);
        } catch (e) {
            console.log(e);
        }
    }

    let handleCopyCode = async () => {
        try {
            await copyMeetingCode(meetingCode);
            setCodeCopied(true);
        } catch (e) {
            console.log(e);
        }
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <div style={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem"
                }}>

                    <h2 style={{
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        marginBottom: "1.5rem"
                    }}>
                        Enter into Lobby
                    </h2>

                    <div style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        marginBottom: "2rem"
                    }}>
                        <TextField
                            id="outlined-basic"
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: "#1e293b",
                                    borderRadius: "8px",
                                    color: "#f1f5f9",
                                    "& fieldset": { borderColor: "#334155" },
                                    "&:hover fieldset": { borderColor: "#6366f1" },
                                    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                                },
                                "& .MuiInputLabel-root": { color: "#94a3b8" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={connect}
                            sx={{
                                background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                padding: "10px 24px",
                                boxShadow: "none",
                                "&:hover": {
                                    opacity: 0.9,
                                    boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                                    background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                                }
                            }}
                        >
                            Connect
                        </Button>
                    </div>

                    <div style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #334155",
                        background: "#1e293b",
                        width: "100%",
                        maxWidth: "480px"
                    }}>
                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </div>

                </div> :


                <div className={styles.meetVideoContainer}>

                    <div className={styles.meetingInfoBar}>
                        <span className={styles.meetingCodeLabel}>Code: <strong>{meetingCode}</strong></span>
                        <IconButton onClick={handleCopyCode} size="small" title="Copy meeting code" sx={{ color: 'white' }}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleCopyLink} size="small" title="Copy meeting link" sx={{ color: 'white' }}>
                            <LinkIcon fontSize="small" />
                        </IconButton>
                    </div>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <h1>Chat</h1>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )
                                }) : <p>No Messages Yet</p>}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                                <Button variant='contained' onClick={sendMessage}>Send</Button>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: video ? "white" : "#ef4444" }}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: audio ? "white" : "#ef4444" }}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />                        </IconButton>
                        </Badge>

                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={`${styles.conferenceView} ${styles[getVideoGridClass(videos.length + 1)]}`}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

              <Snackbar
                open={linkCopied}
                autoHideDuration={3000}
                message="Meeting link copied!"
                onClose={() => setLinkCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
            <Snackbar
                open={codeCopied}
                autoHideDuration={3000}
                message="Meeting code copied!"
                onClose={() => setCodeCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />

        </div>
    )
}
