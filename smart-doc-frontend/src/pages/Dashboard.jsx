import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Upload, FileText, User, Loader2, LogOut, Trash2, Eraser, Menu } from 'lucide-react';

// IMPORT THE CONFIG URL (For Deployment)
import { API_BASE_URL } from '../config'; 

// Construct the full endpoint
const API_URL = `${API_BASE_URL}/api/docs`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
  const fileInputRef = useRef(null);

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
        setUploadStatus("✅ Ready");
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
      else setMessages([{ role: 'ai', text: 'Upload a document to get started. I\'ll help you find answers instantly.' }]);
    } catch (err) {
      console.error(err);
      setMessages([{ role: 'ai', text: 'Upload a document to get started. I\'ll help you find answers instantly.' }]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("active_doc");
    navigate("/");
  };

  const handleClearChat = async () => {
    if (messages.length === 0) return; 
    if (!window.confirm("Clear all chat history? This cannot be undone.")) return;

    try {
      await axios.delete(`${API_URL}/history?user_id=${userId}`);
      setMessages([{ role: 'ai', text: 'Chat history cleared. Ready for new questions!' }]);
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
      
      setUploadStatus("✅ Ready");
      setMessages(prev => [...prev, { role: 'ai', text: `Perfect! I've analyzed "${docName}". What would you like to know?` }]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setUploadStatus("❌ Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async () => {
    if (!activeDocName) {
        alert("No document to delete.");
        return;
    }
    if(!window.confirm(`Delete "${activeDocName}"?`)) return;

    try {
        await axios.delete(`${API_URL}/delete?filename=${activeDocName}&user_id=${userId}`);
        
        setMessages([{ role: 'ai', text: 'Document cleared. Upload a new one to continue.' }]);
        setFile(null);
        setActiveDocName("");
        localStorage.removeItem("active_doc");
        setUploadStatus("");
        if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
        alert("Failed to delete.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeDocName) return;

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
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't get an answer. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FileText size={20} color="#3b82f6" />
            <span>SmartDoc</span>
          </div>
          <div className="sidebar-actions">
            <button onClick={handleClearChat} title="Clear Chat History">
              <Eraser size={16} />
            </button>
            <button onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          {/* Document Status */}
          <div className="doc-status">
            <h4>📄 Active Document</h4>
            {activeDocName ? (
              <>
                <div className="doc-title">{activeDocName}</div>
                <span className="status-badge">✓ Ready</span>
              </>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No document loaded</div>
            )}
          </div>

          {/* Upload Section */}
          <div className="upload-section" onClick={() => fileInputRef.current?.click()}>
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange}
              accept=".pdf,.txt,.doc,.docx"
            />
            <Upload size={28} color="var(--accent)" style={{ margin: '0 auto', marginBottom: '8px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {file ? file.name : "Click to upload document"}
            </p>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>PDF, TXT, DOC up to 10MB</p>
          </div>

          {/* Upload Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="btn-primary"
              style={{ flex: 1, opacity: !file || isUploading ? 0.5 : 1 }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
            <button 
              onClick={handleDeleteDoc} 
              disabled={!activeDocName}
              className="btn-danger"
              style={{ opacity: !activeDocName ? 0.5 : 1 }}
              title="Delete Document"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {uploadStatus && (
            <div style={{ 
              fontSize: '0.85rem', 
              marginTop: '12px', 
              padding: '8px',
              borderRadius: '6px',
              textAlign: 'center',
              background: uploadStatus.includes('Failed') ? '#fee2e2' : '#ecfdf5',
              color: uploadStatus.includes('Failed') ? '#ef4444' : '#10b981'
            }}>
              {uploadStatus}
            </div>
          )}

          {/* User Info */}
          <div style={{ 
            marginTop: '20px', 
            padding: '12px',
            background: 'var(--bg-light)',
            borderRadius: '8px',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Logged in as</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> {userId}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'transparent', border: 'none', padding: '8px' }}
              title="Toggle Sidebar"
            >
              <Menu size={20} color="var(--text-primary)" />
            </button>
            <h2>SmartDoc AI Assistant</h2>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              <div>
                <FileText size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p>Upload a document to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-content">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-section">
          <form onSubmit={handleSend} className="chat-input-wrapper">
            <div className="input-container">
              <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder={activeDocName ? "Ask a question about the document..." : "Upload a document first..."}
                disabled={isTyping || !activeDocName}
              />
            </div>
            <button 
              type="submit" 
              disabled={isTyping || !input.trim() || !activeDocName}
              className="send-btn"
              title="Send message"
            >
              {isTyping ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}