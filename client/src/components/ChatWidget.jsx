// // src/components/ChatWidget.jsx

// import React, { useState, useRef, useEffect } from 'react';

// const ChatWidget = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([
//         { sender: "assistant", text: "Hi there! How can I help you today?" }
//     ]);
//     const [input, setInput] = useState('');
//     const [conversationState, setConversationState] = useState({
//         intent: null,
//         order_number: null,
//         items: [],
//         issue_details: null,
//         status: "waiting_for_user"
//     });

//     const chatBodyRef = useRef(null);

//     const toggleChat = () => setIsOpen(prev => !prev);

//     const sendMessage = async () => {
//         if (!input.trim()) return;

//         // Add user's message to chat
//         const newMessages = [...messages, { sender: "user", text: input }];
//         setMessages(newMessages);

//         const formattedHistory = newMessages.map(msg => ({
//             role: msg.sender === "user" ? "user" : "assistant",
//             content: msg.text
//         }));



//         // Call Python backend
//         try {

//             const res = await fetch('/chat', {                          // 'http://localhost:5000/chat'
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     user_input: input,
//                     chat_history: formattedHistory,
//                     conversation_state: conversationState
//                 })
//             });

//             const data = await res.json();
//             setMessages([...newMessages, { sender: "assistant", text: data.reply }]);
//             setConversationState(data.updated_state);
//         } catch (err) {
//             setMessages([...newMessages, { sender: "assistant", text: "Something went wrong." }]);
//         }

//         setInput('');
//     };

//     // Scroll to bottom on new messages
//     useEffect(() => {
//         if (chatBodyRef.current) {
//         chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//         }
//     }, [messages]);

//     return (
//         <div className="chat-container">
//             <div className="chat-toggle" onClick={toggleChat}><span><i class="bi bi-chat-dots-fill"></i></span></div>

//             {isOpen && (
//                 <div className="chat-box">
//                     <div className="chat-header">Virtual Customer Support</div>
//                     <div className="chat-body" ref={chatBodyRef}>
//                         {messages.map((msg, i) => (
//                             <div key={i} className={`chat-msg ${msg.sender}`}>
//                                 {msg.text}
//                             </div>
//                         ))}
//                     </div>
//                     <div className="chat-footer">
//                         <input
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                             placeholder="Type your message..."
//                         />
//                         <button onClick={sendMessage}>Send</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatWidget;


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

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);

        const formattedHistory = newMessages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }));

        try {
            const res = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: input,
                    chat_history: formattedHistory,
                    conversation_state: conversationState
                })
            });

            const data = await res.json();
            setMessages([...newMessages, { sender: "assistant", text: data.reply }]);
            setConversationState(data.updated_state);
        } catch (err) {
            setMessages([...newMessages, { sender: "assistant", text: "Something went wrong." }]);
        }

        setInput('');
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container position-fixed bottom-0 end-0 p-3">
            <button
                className="btn act-btn rounded-circle"
                onClick={toggleChat}                
            >
                <i className="bi bi-chat-dots-fill"></i>
            </button>

            {isOpen && (
                <div className="card shadow chat-box mt-2">
                    <div className="card-header d-flex justify-content-between align-items-center text-white py-2 px-3">
                        <strong>Virtual Customer Support</strong>
                        <button className="btn btn-sm btn-light" onClick={toggleChat}><span><i class="bi bi-x-lg fs-5"></i></span></button>
                    </div>
                    <div className="card-body overflow-auto chat-body" ref={chatBodyRef}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`d-flex mb-2 ${msg.sender === 'user' ? 'justify-content-start' : 'justify-content-end'}`}
                            >
                                <div
                                    className={`p-2 rounded ${msg.sender}`}
                                    style={{ maxWidth: '75%' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer d-flex p-2 border-top">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button className="btn send-btn" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
