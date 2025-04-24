import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

function RoomEntry() {
    const [roomName, setRoomName] = useState('');
    const [createdRoom, setCreatedRoom] = useState('');
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const createRoom = (e) => {
        e.preventDefault();
        const trimmed = roomName.trim();
        // 房間 id = 輸入房名 + "-" + 隨機 ID
        const displayName = trimmed.replace(/\s+/g, '-').toLowerCase(); // e.g. "study group" → "study-group"
        const encodedName = encodeURIComponent(displayName); // e.g. "房間A" → "房間A"
        const uniqueId = nanoid(6); // or Math.random().toString(36).substring(2, 8);
        const finalRoomId = `${encodedName}-${uniqueId}`;
        setCreatedRoom(finalRoomId);
        setCopied(false);
    };

    const handleCopy = () => {
        const url = `${window.location.origin}/#/room/${createdRoom}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
    };

    const enterRoom = () => {
        if (createdRoom) {
            navigate(`/room/${createdRoom}`);
        }
    };

    return (
        <div className="login-container">
            <h2>Create your Chat Room</h2>
            <form onSubmit={createRoom} style={{ display: 'flex', gap: '10px', marginBottom: '1em' }}>
                <input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Room Name"
                    style={{ padding: '10px', borderRadius: '6px', fontSize: '1em' }}
                />
                <button type="submit">Create</button>
            </form>

            {createdRoom && (
                <div>
                    <div style={{ marginBottom: '0.5em' }}>
                        <strong>Room Link:</strong>
                        <code style={{ marginLeft: '10px' }}>{`${window.location.origin}/#/room/${createdRoom}`}</code>
                        <button onClick={handleCopy} className="copy-button">Copy</button>
                        {!copied  && <p> Send the link to someone you'd like to chat with.</p>}
                    </div>
                    {copied && <div className="copy-tip">✅ Copied! Send the link to someone you'd like to chat with.</div>}
                    <button onClick={enterRoom} style={{ marginTop: '10px'}}>Enter Chat Room</button>
                </div>
            )}
        </div>
    );
}

export default RoomEntry;
