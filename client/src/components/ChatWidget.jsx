// ChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "assistant", text: "Hi there! How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [conversationState, setConversationState] = useState({
        intent: null,
        order_number: null,
        items: [],
        issue_details: null,
        status: "waiting_for_user"
    });

    const chatBodyRef = useRef(null);

    const toggleChat = () => setIsOpen(prev => !prev);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user's message to chat
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);

        const formattedHistory = newMessages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }));



        // Call Python backend
        try {

            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: input,
                    chat_history: formattedHistory,
                    conversation_state: conversationState
                })
            });

            console.log("tsttttt res!?: ", res)

            const data = await res.json();
            console.log("tsttttt data!?: ", data)
            setMessages([...newMessages, { sender: "assistant", text: data.reply }]);
            setConversationState(data.updated_state);
        } catch (err) {
            setMessages([...newMessages, { sender: "assistant", text: "Something went wrong." }]);
        }

        setInput('');
    };

    // Scroll to bottom on new messages
    useEffect(() => {
        if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-toggle" onClick={toggleChat}>💬</div>

            {isOpen && (
                <div className="chat-box">
                    <div className="chat-header">Customer Support</div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
