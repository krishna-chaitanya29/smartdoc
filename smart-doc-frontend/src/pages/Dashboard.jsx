import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Upload, FileText, User, Loader2, LogOut, Trash2, Eraser } from 'lucide-react';

// IMPORT THE CONFIG URL (For Deployment)
import { API_BASE_URL } from '../config'; 

// Construct the full endpoint
const API_URL = `${API_BASE_URL}/api/docs`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  
  // File State
  const [file, setFile] = useState(null);
  const [activeDocName, setActiveDocName] = useState(""); 
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user_id");
    const storedDoc = localStorage.getItem("active_doc");

    if (!storedUser) {
      navigate("/auth");
    } else {
      setUserId(storedUser);
      loadHistory(storedUser);
      
      if (storedDoc) {
        setActiveDocName(storedDoc);
        setUploadStatus("✅ Ready (Restored)");
      }
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNCTIONS ---

  const loadHistory = async (user) => {
    try {
      const res = await axios.get(`${API_URL}/history?user_id=${user}`);
      const history = res.data.map(log => ([
        { role: 'user', text: log.question },
        { role: 'ai', text: log.answer }
      ])).flat();
      
      if (history.length > 0) setMessages(history);
      else setMessages([{ role: 'ai', text: 'Hello! Upload a document to start.' }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("active_doc");
    navigate("/");
  };

  // 2. CLEAR CHAT HISTORY
  const handleClearChat = async () => {
    if (messages.length <= 1) return; 
    if (!window.confirm("Clear all chat history? This cannot be undone.")) return;

    try {
      await axios.delete(`${API_URL}/history?user_id=${userId}`);
      setMessages([{ role: 'ai', text: 'Chat history cleared. Start fresh!' }]);
    } catch (err) {
      alert("Failed to clear history.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const docName = file.name;
      setActiveDocName(docName);
      localStorage.setItem("active_doc", docName);
      
      setUploadStatus("✅ Ready!");
      setMessages(prev => [...prev, { role: 'ai', text: `I've read ${docName}. Ask me anything!` }]);
    } catch (error) {
      setUploadStatus("❌ Failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!activeDocName) {
        alert("No document to delete.");
        return;
    }
    if(!window.confirm(`Delete memory for "${activeDocName}"?`)) return;

    try {
        await axios.delete(`${API_URL}/delete?filename=${activeDocName}&user_id=${userId}`);
        
        alert("Document memory wiped.");
        setMessages([{ role: 'ai', text: 'Memory cleared.' }]);
        setFile(null);
        setActiveDocName("");
        localStorage.removeItem("active_doc");
        setUploadStatus("");
    } catch (err) {
        alert("Failed to delete.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        question: userMessage,
        user_id: userId,
        filename: activeDocName
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText color="#2563eb" />
          <h2>SmartDoc AI</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
            <User size={18} />
            <span style={{ fontWeight: 600 }}>{userId}</span>
          </div>

          {/* CLEAR CHAT BUTTON */}
          <button 
            onClick={handleClearChat} 
            title="Clear Chat History"
            style={{ 
              background: '#f1f5f9', 
              color: '#64748b', 
              padding: '8px', 
              borderRadius: '50%', 
              border: '1px solid #e2e8f0', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Eraser size={18} />
          </button>

          <button onClick={handleLogout} style={{ background: '#ef4444', padding: '8px 16px', fontSize: '0.9rem', display:'flex', gap:'5px', alignItems:'center' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="main-grid">
        <aside className="sidebar">
          <h3>Documents</h3>
          <div className="upload-box">
            <input type="file" id="file-upload" hidden onChange={handleFileChange} accept=".pdf"/>
            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Upload size={32} color="#94a3b8" />
              <span style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
                {file ? file.name : (activeDocName || "Select PDF")}
              </span>
            </label>
          </div>
          
          <div style={{display:'flex', gap:'10px'}}>
             <button onClick={handleUpload} disabled={!file || isUploading} style={{ flex: 1 }}>
                {isUploading ? <Loader2 className="animate-spin" /> : "Upload"}
             </button>
             <button onClick={handleDeleteDoc} disabled={!activeDocName} title="Delete Document Memory" style={{ background: '#fee2e2', color:'#ef4444', flex: 0.3, display:'flex', justifyContent:'center' }}>
                <Trash2 size={20} />
             </button>
          </div>
          
          {uploadStatus && (
            <div style={{ fontSize: '13px', textAlign: 'center', marginTop: '10px', color: uploadStatus.includes('Failed') ? 'red' : 'green' }}>
              {uploadStatus}
            </div>
          )}
        </aside>

        <main className="chat-area">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="message ai">...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-area" onSubmit={handleSend}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask..." disabled={isTyping} />
            <button type="submit" disabled={isTyping || !input.trim()}><Send size={18} /></button>
          </form>
        </main>
      </div>
    </div>
  )
}