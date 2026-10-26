import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Send, MessageCircle } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

const Chat = () => {
  const { conversations, messages, sendMessage } = useApp();
  const [activeConv, setActiveConv] = useState(null);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const convMessages = messages.filter(m => m.conversationId === activeConv);
  const filteredConvs = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    sendMessage(activeConv, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-10rem)]">
      <div className="flex h-full">
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Messages</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map(conv => (
              <button key={conv.id} onClick={() => setActiveConv(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-purple-50 transition-colors text-left
                  ${activeConv === conv.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate">{conv.name}</p>
                    <span className="text-[10px] text-gray-400">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-purple-500 text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0">{conv.unread}</span>
                )}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">Demo chat — messages are stored locally</p>
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="md:hidden p-1 rounded hover:bg-gray-100">←</button>
                {(() => { const c = conversations.find(cv => cv.id === activeConv); return c ? (
                  <>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg">{c.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </>
                ) : null; })()}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {convMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`chat-message ${
                      msg.sender === 'user'
                        ? 'chat-message-sent'
                        : 'chat-message-received'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                        {formatDateTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                <button type="submit" disabled={!newMessage.trim()} className="btn-primary p-2.5 rounded-xl disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Select a conversation to start chatting</p>
                <p className="text-xs text-gray-400 mt-1">Demo chat — messages stored locally</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
