import { useState } from 'react'
import axios from 'axios'

function ChatWindow() {

    //state vairables , message  = ""
    const [message, setMessage] = useState('')
    const [response, setResponse] = useState('')

    const sendMessage = async () => {
        try {
            //Axios Sends HTTP Request
            //sends HTTP POST request to backend.
            const res = await axios.post('http://localhost:8080/chat', {
                message
            })

            console.log("FRONTEND RECEIVED:", res.data)

            setResponse(JSON.stringify(res.data, null, 2))
        } catch (error) {
            console.error("FULL ERROR:", error)

            if (error.response) {
                console.log("Response:", error.response.data)
                console.log("Status:", error.response.status)
            }

            if (error.request) {
                console.log("Request sent but no usable response:", error.request)
            }
            setResponse('Error calling backend')
        }
    }

    return (
        <div style={{ padding: '30px' }}>
            <h1>AI Chat UI</h1>

            <textarea
                rows="5"
                cols="50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <br /><br />

            <button onClick={sendMessage}>
                Send
            </button>

            <h3>Response:</h3>

            <div>
                {response}
            </div>
        </div>
    )
}

export default ChatWindow