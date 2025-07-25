import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data - will be replaced with real MongoDB data
const mockConversations = [
  {
    id: '1',
    userName: 'Alice Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    lastMessage: 'Thank you for the information about our lead tracking system...',
    lastMessageDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 2,
    status: 'active'
  },
  {
    id: '2', 
    userName: 'Bob Smith',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    lastMessage: 'Could you help me with the dashboard analytics?',
    lastMessageDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 0,
    status: 'pending'
  },
  {
    id: '3',
    userName: 'Carol Williams',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: 'The lead conversion rate has improved significantly.',
    lastMessageDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 1,
    status: 'active'
  }
];

const mockMessages = [
  {
    id: '1',
    text: 'Hello! I need help with understanding the lead tracking metrics.',
    sender: 'user',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    text: 'Hi! I\'d be happy to help you with the lead tracking metrics. Our system tracks several key indicators including conversion rates, response times, and lead quality scores.',
    sender: 'system',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: '3',
    text: 'That sounds great! Can you show me how to filter leads by conversion probability?',
    sender: 'user',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
  },
  {
    id: '4',
    text: 'Absolutely! You can use the filtering options in the Lead Tracking section. Look for the "Conversion Probability" dropdown where you can select ranges like High (>80%), Medium (40-80%), or Low (<40%).',
    sender: 'system',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  }
];

export default function ChatHistory() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = mockConversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Here you would save to MongoDB
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat History</h1>
        <p className="text-muted-foreground">Manage and review all conversations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`lg:col-span-1 ${selectedChat ? 'hidden lg:block' : ''}`}
        >
          <Card className="card-elegant h-full flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`
                    p-4 rounded-xl cursor-pointer transition-all duration-300 border
                    ${selectedChat === conversation.id 
                      ? 'bg-primary/10 border-primary shadow-primary' 
                      : 'bg-card hover:bg-muted border-border'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={conversation.userAvatar} />
                      <AvatarFallback className="bg-primary text-white">
                        {conversation.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {conversation.userName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary text-white text-xs px-2 py-1">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              conversation.status === 'active' 
                                ? 'border-success text-success' 
                                : 'border-warning text-warning'
                            }`}
                          >
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {formatDistanceToNow(conversation.lastMessageDate, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="card-elegant h-full flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToList}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={selectedConversation.userAvatar} />
                      <AvatarFallback className="bg-primary text-white">
                        {selectedConversation.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedConversation.userName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last seen {formatDistanceToNow(selectedConversation.lastMessageDate, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[80%] p-3 rounded-2xl shadow-sm
                          ${message.sender === 'user'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <span 
                          className={`text-xs mt-2 block ${
                            message.sender === 'user' ? 'text-white/80' : 'text-muted-foreground'
                          }`}
                        >
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>

                <div className="border-t border-border/50 p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="btn-primary px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a chat from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}