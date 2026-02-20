import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Check, CheckCheck, Edit, Trash2, X, Reply, Smile,
  Image, Heart, MoreHorizontal, Phone, Video, Info,
  ChevronLeft, ChevronRight, Paperclip, Wallet, Mic, Pin, PinOff,
  ChevronUp, ChevronDown, UserX, ShieldAlert, Flag,
  Clock, Hash, Maximize2, ShieldCheck, Sparkles, MessageSquare
} from "lucide-react";
import VerifiedBadge from "./common/VerifiedBadge";

const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const ChatWindow = ({
  messages, onSend, onEdit, onDelete, onReact,
  onPin, onUnpin, currentUser, partner,
  isPartnerTyping, onTypingStart, onTypingStop,
  onBack, pinnedMessages = [], onBlock, onUnblock, onReport
}) => {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [reactMenuId, setReactMenuId] = useState(null);
  const [pinConfirmMsg, setPinConfirmMsg] = useState(null);
  const [viewAllPinned, setViewAllPinned] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [reportDesc, setReportDesc] = useState("");
  const [blocking, setBlocking] = useState(false);

  const typingTimeoutRef = useRef(null);
  const scrollRef = useRef();
  const messageRefs = useRef({});

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim(), replyingTo?._id);
      setText("");
      setReplyingTo(null);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        onTypingStop();
      }
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    else onTypingStart();
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editingId) {
      onEdit(editingId, editText.trim());
      setEditingId(null);
      setEditText("");
    }
  };

  const checkTimeLimit = (createdAt) => {
    const diff = (new Date() - new Date(createdAt)) / 60000;
    return diff <= 15;
  };

  const scrollToMessage = (msgId) => {
    const el = messageRefs.current[msgId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("pin-highlight");
      setTimeout(() => el.classList.remove("pin-highlight"), 1800);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
      setReactMenuId(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getStatusText = () => {
    if (isPartnerTyping) return "Transmitting...";
    if (partner?.isOnline) return "Active Network";
    if (partner?.lastSeen) {
      const date = new Date(partner.lastSeen);
      return `Last sync ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return "Disconnected";
  };

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  const latestPinned = pinnedMessages.length > 0 ? pinnedMessages[0] : null;

  const handleBlockAction = async () => {
    if (!partner) return;
    const isBlocked = partner?.blockedBy?.includes(currentUser?._id);
    if (window.confirm(isBlocked ? "Unblock this user?" : "Block this user? All communications will cease.")) {
      setBlocking(true);
      if (isBlocked) await onUnblock(partner._id);
      else await onBlock(partner._id);
      setBlocking(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!partner) return;
    await onReport(partner._id, reportReason, reportDesc);
    setShowReportModal(false);
    setReportDesc("");
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">

      {/* ── Modals (Preserved & Styled) ── */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#030014]/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md bg-[#0a0a0f] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Flag size={20} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight">Report Channel</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Protocol breach reporting</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {['Spam', 'Harassment', 'Abuse', 'Fake', 'Other'].map(r => (
                    <button key={r} onClick={() => setReportReason(r)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${reportReason === r ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Technical details..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white h-28 focus:outline-none focus:border-blue-500/50 transition-colors" />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowReportModal(false)} className="flex-1 py-4 px-6 rounded-2xl bg-white/2 border border-white/5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                <button onClick={handleReportSubmit} className="flex-1 py-4 px-6 rounded-2xl bg-amber-600 shadow-lg shadow-amber-600/20 text-xs font-black uppercase tracking-widest text-white hover:bg-amber-500 transition-all">Submit Report</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-[#030014]/90 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm bg-[#0a0a0f] border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight">Erase Signal</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Permanent data termination</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => { onDelete(deleteModal._id, "me"); setDeleteModal(null); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 text-white transition-all group"
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white mb-0.5">Delete for Me</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Clear local memory</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-all" />
                </button>

                {String(deleteModal.sender?._id || deleteModal.sender) === String(currentUser?._id) && !deleteModal.isDeleted && (
                  <button
                    onClick={() => { onDelete(deleteModal._id, "everyone"); setDeleteModal(null); }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all group"
                  >
                    <div className="text-left">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-red-400 mb-0.5">Delete for Everyone</span>
                      <span className="text-[9px] text-red-900/50 font-black uppercase">Terminate across network</span>
                    </div>
                    <ChevronRight size={14} className="text-red-500 group-hover:translate-x-1 transition-all" />
                  </button>
                )}

                <button
                  onClick={() => setDeleteModal(null)}
                  className="w-full py-4 mt-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                >
                  Abort Protocol
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {pinConfirmMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#030014]/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-black border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Pin size={20} className="text-blue-400" />
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">Pin Secure Message</h4>
              </div>
              <div className="bg-white/3 border border-indigo-500/20 rounded-2xl p-4 mb-8">
                <p className="text-xs text-gray-400 italic line-clamp-3">"{pinConfirmMsg.content}"</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPinConfirmMsg(null)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-white">Abort</button>
                <button onClick={() => { onPin(pinConfirmMsg._id); setPinConfirmMsg(null); }} className="flex-1 py-3 rounded-xl bg-blue-600 font-black text-white text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">Confirm Pin</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#030014]/90 backdrop-blur-3xl">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-xs bg-black border border-white/10 p-6 rounded-[2rem] text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h4 className="text-lg font-black text-white mb-2">Delete Message?</h4>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">Irreversible action</p>
              <div className="space-y-2">
                <button onClick={() => { onDelete(deleteModal.id, 'me'); setDeleteModal(null); }} className="w-full py-3.5 rounded-xl bg-white/5 border border-white/5 text-xs font-black uppercase text-blue-400 hover:bg-white/10">Delete for me</button>
                {checkTimeLimit(deleteModal.createdAt) && (
                  <button onClick={() => { onDelete(deleteModal.id, 'everyone'); setDeleteModal(null); }} className="w-full py-3.5 rounded-xl bg-red-600/10 border border-red-600/20 text-xs font-black uppercase text-red-500 hover:bg-red-600/20">Delete for all</button>
                )}
                <button onClick={() => setDeleteModal(null)} className="w-full py-3 text-xs font-black uppercase text-gray-600 hover:text-white transition-colors">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="relative z-30 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5"
      >
        <div className="flex items-center gap-4">
          {onBack && (
            <motion.button whileHover={{ x: -2 }} onClick={onBack} className="md:hidden p-2 text-gray-400">
              <ChevronLeft size={24} />
            </motion.button>
          )}
          <div className="relative group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border transition-all duration-300 flex items-center justify-center ${partner?.isOnline ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
              <span className="text-xl font-black text-white drop-shadow-lg">
                {partner?.username?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            {partner?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black z-10" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">{partner?.username || "Secure Channel"}</h3>
              {partner?.isVerified && <VerifiedBadge size={16} />}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black uppercase tracking-widest ${isPartnerTyping ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <button className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-gray-600 hover:text-white hover:bg-white/5 transition-all"><Phone size={18} /></button>
            <button className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-gray-600 hover:text-white hover:bg-white/5 transition-all"><Video size={18} /></button>
          </div>
          <div className="relative group/more">
            <button className="p-2.5 rounded-xl bg-white/3 border border-white/5 text-gray-400 transition-all group-hover/more:bg-white/5 group-hover/more:text-white">
              <MoreHorizontal size={20} />
            </button>
            <div className="absolute top-full right-0 mt-3 w-48 bg-black border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-[60] overflow-hidden">
              <button onClick={handleBlockAction} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors">
                <UserX size={16} /> {partner?.blockedBy?.includes(currentUser?._id) ? "Enable Signal" : "Sever Link"}
              </button>
              <button onClick={() => setShowReportModal(true)} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-colors border-t border-white/5">
                <Flag size={16} /> Report Breach
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-colors border-t border-white/5">
                <ShieldCheck size={16} /> Protocol Info
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── ALERT BANNERS ── */}
      <AnimatePresence>
        {(partner?.blockedBy?.includes(currentUser?._id) || currentUser?.blockedBy?.includes(partner?._id)) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center gap-4 text-red-400">
            <ShieldAlert size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signal encryption restricted by protocol</span>
          </motion.div>
        )}

        {latestPinned && (
          <motion.div key="pin-banner" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mx-6 mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-3xl backdrop-blur-xl flex items-center gap-4 group/banner cursor-pointer" onClick={() => scrollToMessage(latestPinned._id)}>
            <div className="w-1.5 h-10 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Pin size={10} className="text-blue-400" />
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Global Pin: {latestPinned.sender?.username}</span>
              </div>
              <p className="text-xs text-gray-300 truncate font-medium">{latestPinned.content}</p>
            </div>
            {pinnedMessages.length > 1 && (
              <button onClick={(e) => { e.stopPropagation(); setViewAllPinned(true); }} className="px-3 py-1.5 rounded-xl bg-blue-600 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-600/20">All ({pinnedMessages.length})</button>
            )}
            <button onClick={(e) => { e.stopPropagation(); onUnpin(latestPinned._id); }} className="p-2 text-gray-600 hover:text-white transition-colors opacity-0 group-hover/banner:opacity-100"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MESSAGES VIEW ── */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-10 relative">
        <div className="flex flex-col gap-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const senderId = msg.sender?._id || msg.sender;
              const isOwn = String(senderId) === String(currentUser?._id);
              const isSystem = String(senderId) === 'system';
              const isPinned = msg.isPinned;

              if (isSystem) return (
                <div key={msg._id || idx} className="flex justify-center">
                  <div className="px-5 py-2 rounded-full bg-white/2 border border-white/5 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">{msg.content}</div>
                </div>
              );

              return (
                <motion.div
                  key={msg._id || idx}
                  ref={(el) => { if (el && msg._id) messageRefs.current[msg._id] = el; }}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    {!isOwn && (
                      <div className="flex-shrink-0 self-end mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center text-[12px] font-black text-gray-400 uppercase shadow-xl">
                          {msg.sender?.username?.[0] || '?'}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 w-full min-w-0">
                      {/* Message Bubble Layer */}
                      <div className={`relative px-4 py-3 rounded-2xl group transition-all duration-300 border backdrop-blur-xl shadow-lg ${isOwn
                        ? 'bg-gradient-to-br from-blue-600/90 to-indigo-700/90 border-blue-400/20 shadow-blue-500/10'
                        : 'bg-white/5 border border-white/10 shadow-purple-500/5'
                        } ${isPinned ? 'ring-2 ring-blue-500/30' : ''} ${msg.isDeleted ? 'opacity-50 grayscale italic' : ''}`}>

                        {/* Content Area */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-24">
                          {msg.parentMessage && (
                            <div className={`p-2.5 rounded-xl bg-black/30 border-l-4 border-blue-500 text-xs overflow-hidden ${isOwn ? 'text-white/70' : 'text-gray-400'} mb-1`}>
                              <div className="flex items-center gap-1.5 mb-0.5 font-black text-[9px] uppercase tracking-widest text-blue-400">
                                <MessageSquare size={10} />
                                {msg.parentMessage.sender?.username === currentUser.username ? 'YOU' : msg.parentMessage.sender?.username}
                              </div>
                              <p className="truncate italic">"{msg.parentMessage.isDeleted ? "Signal terminated" : msg.parentMessage.content}"</p>
                            </div>
                          )}

                          {editingId === msg._id ? (
                            <div className="flex flex-col gap-3 py-2">
                              <textarea
                                autoFocus
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleEditSubmit();
                                  } else if (e.key === "Escape") {
                                    setEditingId(null);
                                  }
                                }}
                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-medium resize-none min-h-[80px]"
                              />
                              <div className="flex items-center gap-2">
                                <button onClick={handleEditSubmit} className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-blue-600/20">Apply</button>
                                <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[14px] leading-relaxed font-medium tracking-wide text-white break-words">
                              {msg.content}
                            </div>
                          )}
                        </div>

                        {/* Quick Actions (Absolute) */}
                        {!msg.isDeleted && editingId !== msg._id && (
                          <div className="absolute top-2 right-2 flex items-center gap-3 z-50 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={(e) => { e.stopPropagation(); setReactMenuId(reactMenuId === msg._id ? null : msg._id); setActiveMenuId(null); }}
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${reactMenuId === msg._id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                              title="Add Reaction"
                            >
                              <Smile size={18} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === msg._id ? null : msg._id); setReactMenuId(null); }}
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${activeMenuId === msg._id ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                              title="More Options"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        )}

                        {/* Dropdown Menus */}
                        <AnimatePresence>
                          {reactMenuId === msg._id && (
                            <motion.div
                              initial={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.8 }}
                              className={`absolute top-0 ${isOwn ? 'right-full mr-4' : 'left-full ml-4'} z-[100] bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl flex gap-1 shadow-2xl`}
                            >
                              {QUICK_EMOJIS.map(emoji => (
                                <button key={emoji} onClick={(e) => { e.stopPropagation(); onReact(msg._id, emoji); }} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-lg hover:scale-125">{emoji}</button>
                              ))}
                            </motion.div>
                          )}
                          {activeMenuId === msg._id && (
                            <motion.div
                              initial={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.9 }}
                              className={`absolute top-0 ${isOwn ? 'right-full mr-4' : 'left-full ml-4'} z-[100] w-48 bg-black/95 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden`}
                            >
                              <button onClick={() => { setReplyingTo(msg); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><Reply size={14} /> Reply</button>
                              {!isPinned
                                ? <button onClick={() => { onPin(msg._id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600/10 rounded-xl transition-colors"><Pin size={14} /> Global Pin</button>
                                : <button onClick={() => { onUnpin(msg._id); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><PinOff size={14} /> Unpin</button>
                              }
                              {isOwn && checkTimeLimit(msg.createdAt) && (
                                <button onClick={() => { setEditingId(msg._id); setEditText(msg.content); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 border-t border-white/5 mt-1 pt-3.5 rounded-xl transition-colors"><Edit size={14} /> Edit</button>
                              )}
                              <button onClick={() => { setDeleteModal(msg); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 border-t border-white/5 mt-1 pt-3.5 rounded-xl transition-colors"><Trash2 size={14} /> Erase</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Info & Reactions Footer */}
                      <div className={`flex flex-col gap-1.5 ${isOwn ? 'items-end' : 'items-start'} px-1 mt-1`}>
                        <div className="flex items-center gap-2">
                          {isPinned && <Pin size={10} className="text-blue-500 animate-pulse" />}
                          {msg.isEdited && <span className="text-[9px] font-bold text-gray-600 uppercase">Edited</span>}
                          <span className="text-[10px] font-bold text-gray-500 tabular-nums uppercase">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && (
                            <div className={msg.status === 'seen' ? 'text-blue-500' : 'text-gray-600'}>
                              {msg.status === 'seen' ? <CheckCheck size={13} strokeWidth={3} /> : <Check size={13} strokeWidth={3} />}
                            </div>
                          )}
                        </div>

                        {msg.reactions?.length > 0 && (
                          <div className={`flex flex-wrap gap-2 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            {Array.from(new Set(msg.reactions.map(r => r.emoji))).map((emoji, i) => {
                              const reactorList = msg.reactions.filter(r => r.emoji === emoji);
                              const count = reactorList.length;
                              const hasReacted = reactorList.some(r => {
                                const rid = r.userId?._id || r.userId;
                                return String(rid) === String(currentUser?._id);
                              });
                              const reactorNames = reactorList.map(r => r.userId?.username || "Unknown").join(", ");
                              const tooltipText = hasReacted
                                ? `You ${count > 1 ? `and ${count - 1} others` : ''} reacted with ${emoji}`
                                : `${reactorNames} reacted with ${emoji}`;

                              return (
                                <motion.button
                                  key={i}
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => { e.stopPropagation(); onReact(msg._id, emoji); }}
                                  title={tooltipText}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all backdrop-blur-md border ${hasReacted
                                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-white/10 border-white/5 text-gray-300'
                                    }`}
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px] font-bold tabular-nums">{count}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* ── INPUT CAPSULE ── */}
      <footer className="px-6 py-8 relative bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <AnimatePresence>
          {replyingTo && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="max-w-4xl mx-auto mb-6">
              <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-3xl flex items-center justify-between backdrop-blur-md">
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  <div className="w-1 h-10 rounded-full bg-blue-500" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Replying to {replyingTo.sender?.username}</span>
                    <p className="text-sm text-gray-400 truncate mt-1">"{replyingTo.content}"</p>
                  </div>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-2.5 rounded-2xl bg-white/5 text-gray-500 hover:text-white"><X size={16} /></button>
              </div>
            </motion.div>
          )}

          {isPartnerTyping && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="absolute top-[-30px] left-10 flex items-center gap-3">
              <div className="flex gap-1.5 p-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              </div>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Signal Detected</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          {(partner?.blockedBy?.includes(currentUser?._id) || currentUser?.blockedBy?.includes(partner?._id)) ? (
            <div className="p-5 bg-red-600/5 border border-dashed border-red-500/20 rounded-3xl text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50 italic">Communications restricted by administrative policy</span>
            </div>
          ) : (
            <div className="relative group flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2.5rem] px-5 py-2.5 transition-all duration-300 focus-within:border-blue-500/40 focus-within:bg-white/[0.08] shadow-2xl">
                <button className="p-2 text-gray-500 hover:text-white"><Smile size={22} /></button>
                <input
                  value={text}
                  onChange={handleTyping}
                  placeholder="Initiate communication protocol..."
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 font-medium text-sm py-2"
                />
                <div className="flex items-center gap-1">
                  <button className="p-2.5 text-gray-600 hover:text-white"><Paperclip size={20} /></button>
                  <button className="p-2.5 text-gray-600 hover:text-white"><Image size={20} /></button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!text.trim()}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl shadow-blue-600/20 ${text.trim() ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-700 opacity-50'}`}
              >
                <Send size={20} fill={text.trim() ? "currentColor" : "none"} />
              </motion.button>
            </div>
          )}
        </div>
      </footer>

      <style>{`
    .pin-highlight { animation: pinFlash 1.8s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes pinFlash {
      0% { background: rgba(59,130,246,0.3); border-radius: 32px; box-shadow: 0 0 20px rgba(59,130,246,0.2); transform: scale(1.02); }
      50% { background: rgba(59,130,246,0.1); }
      100% { background: transparent; transform: scale(1); }
    }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
  `}</style>
    </div>
  );
};

export default ChatWindow;
