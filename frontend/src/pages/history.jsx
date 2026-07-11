import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import '../styles/history.css';

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }
        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    return (
        <div className="history-page">

            <div className="history-header">
                <IconButton className="history-home-btn" onClick={() => { routeTo("/home") }}>
                    <HomeIcon />
                </IconButton>
                <h2 className="history-title">Meeting History</h2>
            </div>

            <div className="history-list">
                {
                    (meetings.length !== 0) ? meetings.map((e, i) => {
                        return (
                            <Card key={i} variant="outlined" className="history-card">
                                <CardContent>
                                    <Typography className="history-code" gutterBottom>
                                        Code: {e.meetingCode}
                                    </Typography>
                                    <Typography className="history-date">
                                        Date: {formatDate(e.date)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    }) : (
                        <p className="history-empty">No meeting history yet</p>
                    )
                }
            </div>

        </div>
    )
}