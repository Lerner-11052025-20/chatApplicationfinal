import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Check,
  CheckCheck,
  Edit,
  Trash2,
  X,
  Reply,
  Smile,
  Image,
  Heart,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  ChevronLeft,
  Paperclip,
  Wallet,
  Mic,
  Pin,
  PinOff,
  ChevronUp,
  ChevronDown,
  UserX,
  ShieldAlert,
  Flag
} from "lucide-react";
import VerifiedBadge from "./common/VerifiedBadge";

const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const ChatWindow = ({
  messages,
  onSend,
  onEdit,
  onDelete,
  onReact,
  onPin,
  onUnpin,
  currentUser,
  partner,
  isPartnerTyping,
  onTypingStart,
  onTypingStop,
  onBack,
  pinnedMessages = [],
  onBlock,
  onUnblock,
  onReport
}) => {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [reactMenuId, setReactMenuId] = useState(null);
  const [pinConfirmMsg, setPinConfirmMsg] = useState(null); // message obj to confirm pin
  const [viewAllPinned, setViewAllPinned] = useState(false); // show "view all" modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");
  const [reportDesc, setReportDesc] = useState("");
  const [blocking, setBlocking] = useState(false);

  const typingTimeoutRef = useRef(null);
  const scrollRef = useRef();
  const messageRefs = useRef({}); // map of messageId -> DOM element

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
      // flash highlight
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
    if (isPartnerTyping) return "Typing...";
    if (partner?.isOnline) return "Online";
    if (partner?.lastSeen) {
      const date = new Date(partner.lastSeen);
      const now = new Date();
      const diffMs = now - date;
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "Last seen just now";
      if (diffMin < 60) return `Last seen ${diffMin}m ago`;
      return `Last seen ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return "Offline";
  };

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  // Latest pinned message to show in the banner
  const latestPinned = pinnedMessages.length > 0 ? pinnedMessages[0] : null;

  const handleBlockAction = async () => {
    if (!partner) return;
    const isBlocked = partner?.blockedBy?.includes(currentUser?._id);
    const confirmMsg = isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Blocking this user will prevent them from messaging you and viewing your profile. Proceed?";

    if (window.confirm(confirmMsg)) {
      setBlocking(true);
      // We'll call a prop function here
      if (isBlocked) {
        await onUnblock(partner._id);
      } else {
        await onBlock(partner._id);
      }
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

      {/* ===== REPORT MODAL ===== */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md glass p-6 rounded-[2rem] border border-white/10 shadow-2xl"
            >
              <h4 className="text-xl font-bold mb-2">Report User</h4>
              <p className="text-sm text-gray-500 mb-6">Explain why you are reporting {partner?.username}. This report is anonymous.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Reason</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Spam', 'Harassment', 'Inappropriate Content', 'Fake Account', 'Other'].map(r => (
                      <button
                        key={r}
                        onClick={() => setReportReason(r)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${reportReason === r ? 'bg-blue-600 border-blue-500 text-white' : 'glass border-white/5 text-gray-400 hover:text-white'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Details (Optional)</label>
                  <textarea
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Provide more context..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowReportModal(false)} className="flex-1 py-3 rounded-2xl glass border border-white/5 text-sm font-bold text-gray-400">Cancel</button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 py-3 rounded-2xl bg-yellow-600 font-bold text-white text-sm shadow-lg shadow-yellow-500/20"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PIN CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {pinConfirmMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="w-full max-w-sm glass p-6 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Pin size={18} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Pin Message</h4>
                  <p className="text-xs text-gray-500">Visible to everyone in this chat</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-300 line-clamp-3 italic">"{pinConfirmMsg.content}"</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPinConfirmMsg(null)}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-bold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onPin(pinConfirmMsg._id);
                    setPinConfirmMsg(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  📌 Pin it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== VIEW ALL PINNED MODAL ===== */}
      <AnimatePresence>
        {viewAllPinned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center p-4 bg-dark-bg/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="w-full max-w-lg glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Pin size={16} className="text-blue-400" />
                  <h4 className="font-bold text-white text-sm uppercase tracking-widest">
                    Pinned Messages ({pinnedMessages.length})
                  </h4>
                </div>
                <button
                  onClick={() => setViewAllPinned(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                {pinnedMessages.map((pm) => (
                  <div key={pm._id} className="px-6 py-4 hover:bg-white/3 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setViewAllPinned(false);
                          scrollToMessage(pm._id);
                        }}
                      >
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">
                          {pm.sender?.username || "Unknown"} · {new Date(pm.pinnedAt || pm.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-300 line-clamp-2">{pm.content}</p>
                      </div>
                      <button
                        onClick={() => onUnpin(pm._id)}
                        title="Unpin"
                        className="opacity-0 group-hover:opacity-100 shrink-0 p-2 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <PinOff size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== EDIT MODAL ===== */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-sm"
          >
            <div className="w-full max-w-sm glass p-6 rounded-3xl border border-white/10 shadow-2xl">
              <h4 className="text-lg font-bold mb-4">Edit Message</h4>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-4 h-32"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-gray-400 font-medium">Cancel</button>
                <button
                  onClick={handleEditSubmit}
                  className="px-6 py-2 rounded-xl bg-blue-600 font-bold text-white text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DELETE MODAL ===== */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-sm"
          >
            <div className="w-full max-w-xs glass p-6 rounded-3xl border border-white/10 shadow-2xl text-center">
              <h4 className="text-lg font-bold mb-6">Delete message?</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { onDelete(deleteModal.id, 'me'); setDeleteModal(null); }}
                  className="w-full py-3 rounded-xl hover:bg-white/5 text-blue-400 font-bold transition-colors"
                >
                  Delete for me
                </button>
                {checkTimeLimit(deleteModal.createdAt) && (
                  <button
                    onClick={() => { onDelete(deleteModal.id, 'everyone'); setDeleteModal(null); }}
                    className="w-full py-3 rounded-xl hover:bg-white/5 text-blue-400 font-bold transition-colors"
                  >
                    Delete for everyone
                  </button>
                )}
                <button
                  onClick={() => setDeleteModal(null)}
                  className="w-full py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HEADER ===== */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-dark-bg/30 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
              {partner?.username?.[0]?.toUpperCase() || '?'}
            </div>
            {partner?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-bg shadow-sm" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white leading-tight">{partner?.username || "Chat"}</h3>
              {partner?.isVerified && <VerifiedBadge size={16} />}
            </div>
            <div className="flex items-center gap-1.5">
              {partner?.isOnline && !isPartnerTyping && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
              <span className={`text-xs font-medium transition-colors ${isPartnerTyping ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)] animate-pulse' : 'text-gray-500'}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group/moderation">
            <button className="p-2.5 glass rounded-xl text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/moderation:opacity-100 group-hover/moderation:visible transition-all z-[60] py-2">
              <button
                onClick={handleBlockAction}
                disabled={blocking}
                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-white/5 flex items-center gap-3 text-red-500"
              >
                <UserX size={16} />
                {partner?.blockedBy?.includes(currentUser?._id) ? "Unblock User" : "Block User"}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-white/5 flex items-center gap-3 text-yellow-500"
              >
                <Flag size={16} /> Report User
              </button>
            </div>
          </div>
          <button className="p-2.5 glass rounded-xl text-gray-400 hover:text-blue-400 transition-colors hidden md:flex">
            <Phone size={20} />
          </button>
          <button className="p-2.5 glass rounded-xl text-gray-400 hover:text-indigo-400 transition-colors hidden md:flex">
            <Video size={20} />
          </button>
          <button className="p-2.5 glass rounded-xl text-blue-400 hover:bg-blue-500/10 transition-colors">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* ===== BLOCK BANNER ===== */}
      {(partner?.blockedBy?.includes(currentUser?._id) || currentUser?.blockedBy?.includes(partner?._id)) && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-6 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-400 text-xs font-bold"
        >
          <ShieldAlert size={16} />
          {partner?.blockedBy?.includes(currentUser?._id) ? "You have blocked this user" : "This user has restricted their profile"}
        </motion.div>
      )}

      {/* ===== PINNED BANNER ===== */}
      <AnimatePresence>
        {latestPinned && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="overflow-hidden shrink-0"
          >
            <div className="mx-4 mt-2 mb-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl shadow-lg shadow-blue-500/5 group/banner cursor-pointer"
              onClick={() => scrollToMessage(latestPinned._id)}
            >
              {/* Pin accent bar */}
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 shrink-0" />

              {/* Icon */}
              <Pin size={14} className="text-blue-400 shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400/70 mb-0.5">
                  📌 Pinned · {latestPinned.sender?.username}
                </p>
                <p className="text-xs text-gray-300 truncate font-medium">
                  {latestPinned.content}
                </p>
              </div>

              {/* View All button (when multiple are pinned) */}
              {pinnedMessages.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setViewAllPinned(true); }}
                  className="shrink-0 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 hover:bg-blue-500/20 transition-colors uppercase tracking-widest"
                >
                  View All {pinnedMessages.length}
                </button>
              )}

              {/* Unpin button */}
              <button
                onClick={(e) => { e.stopPropagation(); onUnpin(latestPinned._id); }}
                title="Unpin"
                className="shrink-0 p-1.5 rounded-full hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover/banner:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MESSAGES ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-8">
        <div className="flex flex-col gap-8">
          {messages.map((msg, idx) => {
            const senderId = msg.sender?._id || msg.sender;
            const isOwn = String(senderId) === String(currentUser?._id);
            const isSystem = String(senderId) === 'system';
            const isPinned = msg.isPinned;

            if (isSystem) return (
              <div key={msg._id || idx} className="flex justify-center">
                <span className="px-4 py-1.5 rounded-full glass text-[10px] text-gray-500 font-bold tracking-widest uppercase">{msg.content}</span>
              </div>
            );

            return (
              <motion.div
                key={msg._id || idx}
                ref={(el) => { if (el && msg._id) messageRefs.current[msg._id] = el; }}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                data-message-id={msg._id}
              >
                <div className={`flex gap-3 max-w-[75%] relative ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <div className="flex-shrink-0 mt-auto">
                      <div className="w-8 h-8 rounded-xl bg-gray-800 border border-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                        {msg.sender?.username?.[0]?.toUpperCase()}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 relative group">
                    {/* Pinned indicator glow border */}
                    {isPinned && (
                      <div className={`absolute -inset-1 rounded-3xl bg-blue-500/10 border border-blue-500/20 -z-0 pointer-events-none`} />
                    )}

                    <div className={`px-5 py-3 rounded-3xl text-sm relative overflow-visible flex flex-col z-0 ${isOwn
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                      : 'glass rounded-tl-none border border-white/5 text-gray-200'
                      } ${msg.isDeleted ? 'bg-white/5 text-gray-500 italic' : ''}`}>

                      {/* Threaded Reply Context */}
                      {msg.parentMessage && (
                        <div className={`mb-2 p-2 rounded-xl bg-black/10 border-l-4 border-blue-400 text-xs overflow-hidden max-h-16 ${isOwn ? 'text-white/80' : 'text-gray-400'}`}>
                          <p className="font-bold text-[10px] text-blue-400 mb-0.5">
                            {msg.parentMessage.sender?.username === currentUser.username ? 'You' : msg.parentMessage.sender?.username}
                          </p>
                          <p className="truncate italic">
                            {msg.parentMessage.isDeleted ? "This message was deleted" : msg.parentMessage.content}
                          </p>
                        </div>
                      )}

                      <span>{msg.content}</span>

                      {/* Reactions Display */}
                      {msg.reactions?.length > 0 && (
                        <div className={`absolute -bottom-2 ${isOwn ? 'right-0' : 'left-0'} flex items-center gap-1 bg-gray-800/95 border border-white/10 rounded-full px-2 py-0.5 shadow-xl scale-95 z-10 hover:scale-105 transition-transform cursor-default translate-y-[20%]`}>
                          {[...new Set(msg.reactions.map(r => r.emoji))].slice(0, 3).map((emoji, i) => (
                            <span key={i} className="text-[10px] leading-none">{emoji}</span>
                          ))}
                          <span className="text-[10px] font-black text-gray-300 ml-1 leading-none">{msg.reactions.length || 0}</span>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 px-2 mt-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {msg.isEdited && !msg.isDeleted && <span className="text-[9px] text-gray-500 uppercase font-black">Edited</span>}
                      {/* 📌 pin icon indicator */}
                      {isPinned && !msg.isDeleted && (
                        <span title="Pinned message" className="text-[10px] text-blue-400/80 cursor-default select-none">📌</span>
                      )}
                      <span className="text-[10px] text-gray-600 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOwn && <div className="text-blue-500/50"><CheckCheck size={12} /></div>}
                    </div>

                    {/* Context Menu Triggers */}
                    {!msg.isDeleted && (
                      <div className={`absolute ${isOwn ? '-left-10' : '-right-10'} top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setReactMenuId(reactMenuId === msg._id ? null : msg._id); setActiveMenuId(null); }}
                          className="p-1.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white"
                        >
                          <Smile size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === msg._id ? null : msg._id); setReactMenuId(null); }}
                          className="p-1.5 rounded-full hover:bg-white/5 text-gray-500 hover:text-white"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    )}

                    {/* Emoji Picker Bubble */}
                    <AnimatePresence>
                      {reactMenuId === msg._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className={`absolute ${isOwn ? 'right-0' : 'left-0'} -top-12 z-40 glass p-1.5 rounded-full border border-white/10 flex gap-1 shadow-2xl`}
                        >
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => { onReact(msg._id, emoji); setReactMenuId(null); }}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Context Menu */}
                    <AnimatePresence>
                      {activeMenuId === msg._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`absolute ${isOwn ? 'right-0' : 'left-0'} top-10 z-40 min-w-[150px] glass border border-white/10 rounded-2xl p-1 shadow-2xl overflow-hidden`}
                        >
                          <button
                            onClick={() => { setReplyingTo(msg); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-white/5 text-gray-200"
                          >
                            <Reply size={14} /> Reply
                          </button>

                          {/* Pin / Unpin */}
                          {!isPinned ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setPinConfirmMsg(msg); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-blue-500/10 text-blue-400"
                            >
                              <Pin size={14} /> Pin
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); onUnpin(msg._id); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-red-500/10 text-red-400"
                            >
                              <PinOff size={14} /> Unpin
                            </button>
                          )}

                          {isOwn && checkTimeLimit(msg.createdAt) && (
                            <button
                              onClick={() => { setEditingId(msg._id); setEditText(msg.content); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-white/5 text-gray-200"
                            >
                              <Edit size={14} /> Edit
                            </button>
                          )}
                          <button
                            onClick={() => { setDeleteModal({ id: msg._id, createdAt: msg.createdAt }); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="px-6 pb-6 shrink-0 relative bg-dark-bg/20 backdrop-blur-md border-t border-white/5 pt-4">
        {/* Reply Preview */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-w-4xl mx-auto mb-4 overflow-hidden"
            >
              <div className="glass border-l-4 border-blue-500 p-3 rounded-xl flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-0.5">
                    Replying to {replyingTo.sender?.username === currentUser.username ? 'Yourself' : replyingTo.sender?.username}
                  </p>
                  <p className="text-sm text-gray-400 truncate pr-4">{replyingTo.content}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isPartnerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-6 left-10 flex items-center gap-2"
            >
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
                {partner?.username} is typing ........
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(partner?.blockedBy?.includes(currentUser?._id) || currentUser?.blockedBy?.includes(partner?._id)) ? (
          <div className="max-w-4xl mx-auto flex items-center justify-center p-4 glass rounded-[2rem] border border-dashed border-red-500/20 text-red-500/60 font-medium text-xs">
            You cannot send messages to this user
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex items-center gap-3 glass p-2 rounded-[2rem] border border-white/10 shadow-2xl relative group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <div className="flex items-center"><motion.button whileHover={{ scale: 1.1 }} className="p-3 text-gray-500 hover:text-blue-400 transition-colors"><Smile size={22} /></motion.button></div>
            <input
              value={text}
              onChange={handleTyping}
              placeholder="Say something nice..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 text-sm py-2"
            />
            <div className="flex items-center gap-1 pr-2">
              <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 text-gray-500 hover:text-white transition-colors"><Paperclip size={20} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} className="p-2.5 text-gray-500 hover:text-white transition-colors"><Image size={20} /></motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleSend} className="ml-2 w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"><Send size={18} fill="currentColor" /></motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Inline CSS for the highlight flash animation */}
      <style>{`
        .pin-highlight {
          animation: pinFlash 1.8s ease-out;
        }
        @keyframes pinFlash {
          0%   { background: rgba(59,130,246,0.25); border-radius: 24px; }
          60%  { background: rgba(59,130,246,0.12); }
          100% { background: transparent; }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
