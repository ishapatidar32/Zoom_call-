import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../styles/homestyle.css"  
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';
import { Video } from 'lucide-react'
import { generateMeetingCode } from '../utils/meetcode';
function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
         if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }
    
     let handleStartMeeting = async () => {
        const code = generateMeetingCode();
        await addToUserHistory(code);
        navigate(`/${code}`);
    }

    return (
        <>

            <div className="navBar">

                <div className="nav-logo">
                     <div className="logo-icon">
                        <Video size={18} />
                    </div>
                    <h2> StreamSync</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        () => {
                            navigate("/history")
                        }
                    }>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div> 
                        <h2>Stay close to the people <br></br> <span style={{color : "#6366f1"}}>who matter most </span></h2>

                        <div style={{ display: 'flex', gap: "10px", flexWrap: 'wrap', alignItems: 'center' }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>
                            <Button onClick={handleStartMeeting} variant='outlined' sx={{ borderColor: '#6366f1', color: '#6366f1' }}>
                                Start Meeting
                            </Button>

                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                            Start a new room instantly, or join with a code from someone else
                        </p>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/homepage.png' alt="" />
                </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)