import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Search, Ban, RotateCcw, Trash2, ShieldCheck, ShieldOff,
  Users, CheckCircle, AlertCircle, X, AlertTriangle,
  UserX, UserCheck, Crown, Filter, TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';
import { getGrad, formatDate } from './shared/adminUtils';

/* ─── Confirmation Modal ─────────────────────────────────────── */
function ConfirmModal({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,10,40,0.98) 0%, rgba(5,5,25,0.98) 100%)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Top accent */}
            <div className="h-1 w-full" style={{ background: confirmColor || '#ef4444' }} />

            <div className="p-7">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${confirmColor || '#ef4444'}18`, border: `1px solid ${confirmColor || '#ef4444'}30` }}>
                <AlertTriangle size={24} style={{ color: confirmColor || '#ef4444' }} />
              </div>

              <h3 className="text-xl font-black text-white text-center mb-2">{title}</h3>
              <p className="text-sm text-gray-400 text-center leading-relaxed mb-8">{message}</p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-400 border border-white/10 hover:bg-white/6 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${confirmColor || '#ef4444'}, ${confirmColor || '#ef4444'}99)` }}
                >
                  {confirmLabel || 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 p-5 space-y-4 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/8" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 bg-white/8 rounded-full" />
          <div className="h-2.5 w-36 bg-white/5 rounded-full" />
        </div>
        <div className="h-6 w-16 bg-white/6 rounded-full" />
      </div>
      <div className="h-px bg-white/5" />
      <div className="flex justify-between items-center">
        <div className="h-2.5 w-20 bg-white/5 rounded-full" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-xl bg-white/6" />
          <div className="h-8 w-8 rounded-xl bg-white/6" />
          <div className="h-8 w-8 rounded-xl bg-white/6" />
        </div>
      </div>
    </div>
  );
}

/* ─── User Card ──────────────────────────────────────────────── */
function UserCard({ u, actionLoading, onVerify, onBan, onDelete, index }) {
  const [g1, g2] = getGrad(u.username);

  const statusConfig = u.isBanned
    ? { label: 'Banned', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: UserX }
    : u.isVerified
    ? { label: 'Verified', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: ShieldCheck }
    : { label: 'Active', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: UserCheck };

  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-2xl border border-white/6 overflow-hidden transition-all duration-300 hover:border-white/14"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
    >
      {/* Hover gradient glow top-left */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${g1}08, transparent 60%)` }}
      />

      <div className="p-5">
        {/* Top row: avatar + name + status */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white font-black text-lg"
              style={{ background: `linear-gradient(135deg, ${g1}, ${g2})`, boxShadow: `0 6px 20px ${g1}40` }}
            >
              {u.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            {/* Online dot */}
            {!u.isBanned && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#030014]"
                style={{ background: u.isVerified ? '#10b981' : '#3b82f6' }} />
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm truncate">{u.username}</span>
              {u.isVerified && <Crown size={12} className="shrink-0" style={{ color: '#10b981' }} />}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">{u.email}</div>
          </div>

          {/* Status badge */}
          <div
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.color}25` }}
          >
            <StatusIcon size={10} />
            {statusConfig.label}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Bottom row: join date + actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="text-gray-600">Joined </span>
            <span className="text-gray-400">{formatDate(u.createdAt)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Verify / Unverify */}
            <ActionButton
              onClick={() => onVerify(u._id)}
              loading={actionLoading === u._id + '_ver'}
              tooltip={u.isVerified ? 'Unverify' : 'Verify'}
              color={u.isVerified ? '#f59e0b' : '#10b981'}
              icon={u.isVerified ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
            />
            {/* Ban / Unban */}
            <ActionButton
              onClick={() => onBan(u._id, u.isBanned)}
              loading={actionLoading === u._id + '_ban'}
              tooltip={u.isBanned ? 'Unban' : 'Ban'}
              color={u.isBanned ? '#3b82f6' : '#f59e0b'}
              icon={u.isBanned ? <RotateCcw size={14} /> : <Ban size={14} />}
            />
            {/* Delete */}
            <ActionButton
              onClick={() => onDelete(u._id, u.username)}
              loading={actionLoading === u._id + '_del'}
              tooltip="Delete"
              color="#ef4444"
              icon={<Trash2 size={14} />}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Action Button ──────────────────────────────────────────── */
function ActionButton({ onClick, loading, tooltip, color, icon }) {
  return (
    <div className="relative group/btn">
      <motion.button
        onClick={onClick}
        disabled={loading}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
        style={{ background: `${color}14`, color, border: `1px solid ${color}22` }}
        whileHover={{ scale: 1.12, background: `${color}28` }}
        whileTap={{ scale: 0.9 }}
      >
        {loading ? (
          <motion.div
            className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
            style={{ borderColor: `${color} transparent transparent transparent` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
          />
        ) : icon}
      </motion.button>
      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-10"
        style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid rgba(0,0,0,0.85)' }} />
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ label, value, color, icon: Icon }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-white/6"
      style={{ background: 'rgba(255,255,255,0.03)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, color }}>
        <Icon size={16} />
      </div>
      <div>
        <div className="text-xl font-black text-white leading-none">{value}</div>
        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── Filter Tab ─────────────────────────────────────────────── */
const FILTERS = [
  { key: 'all', label: 'All', color: '#6366f1' },
  { key: 'active', label: 'Active', color: '#3b82f6' },
  { key: 'banned', label: 'Banned', color: '#ef4444' },
  { key: 'verified', label: 'Verified', color: '#10b981' },
];

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ open: false, title: '', message: '', confirmLabel: '', confirmColor: '', onConfirm: null });

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const showModal = ({ title, message, confirmLabel, confirmColor, onConfirm }) => {
    setModal({ open: true, title, message, confirmLabel, confirmColor, onConfirm });
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/users?search=${encodeURIComponent(search)}&filter=${filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('fetchUsers error', err);
      setUsers([]);
    } finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleBanToggle = (id, current) => {
    showModal({
      title: current ? 'Unban User' : 'Ban User',
      message: current
        ? 'This user will regain full access to the platform.'
        : 'This user will be blocked from accessing the platform.',
      confirmLabel: current ? 'Yes, Unban' : 'Yes, Ban',
      confirmColor: current ? '#3b82f6' : '#f59e0b',
      onConfirm: async () => {
        closeModal();
        setActionLoading(id + '_ban');
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${API_BASE_URL}/api/admin/users/${id}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } });
          fetchUsers();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
      },
    });
  };

  const handleDelete = (id, username) => {
    showModal({
      title: 'Delete User',
      message: `Permanently delete "${username}"? This action cannot be undone.`,
      confirmLabel: 'Delete Forever',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        closeModal();
        setActionLoading(id + '_del');
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          fetchUsers();
        } catch (e) { console.error(e); } finally { setActionLoading(null); }
      },
    });
  };

  const handleVerifyToggle = async (id) => {
    setActionLoading(id + '_ver');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/users/${id}/verify`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
    } catch (e) { console.error(e); } finally { setActionLoading(null); }
  };

  const sorted = useMemo(() =>
    [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [users]
  );

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.isBanned).length,
    banned: users.filter(u => u.isBanned).length,
  }), [users]);

  return (
    <>
      {/* Confirmation modal */}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        confirmColor={modal.confirmColor}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      <div className="space-y-7">
        {/* ── Page Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', boxShadow: '0 10px 30px rgba(59,130,246,0.4)' }}
            >
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">User Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage accounts, permissions and access</p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Strip ── */}
        {!loading && (
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard label="Total Users" value={stats.total} color="#6366f1" icon={Users} />
            <StatCard label="Active" value={stats.active} color="#3b82f6" icon={CheckCircle} />
            <StatCard label="Banned" value={stats.banned} color="#ef4444" icon={AlertCircle} />
          </motion.div>
        )}

        {/* ── Search + Filters ── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 border"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Filter tabs */}
          <div
            className="flex items-center gap-1 p-1 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                style={{ color: filter === f.key ? f.color : '#6b7280' }}
              >
                {filter === f.key && (
                  <motion.div
                    layoutId="filterPill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Users size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-semibold">No users found</p>
            <p className="text-gray-700 text-sm mt-1">Try adjusting your search or filter</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {sorted.map((u, i) => (
                <UserCard
                  key={u._id}
                  u={u}
                  index={i}
                  actionLoading={actionLoading}
                  onVerify={handleVerifyToggle}
                  onBan={handleBanToggle}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}
