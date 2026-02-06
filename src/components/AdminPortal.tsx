import React, { useState } from 'react';
import { Newspaper, Mail, ShoppingCart, RefreshCw, Send, ChevronLeft, Bell, Trash2 } from 'lucide-react';
import { api } from '../api';

const AdminPortal: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [tab, setTab] = useState<'news' | 'mail' | 'shop' | 'popup' | 'version'>('popup');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        newsTitle: '', newsContent: '', newsColor: 'sky',
        mailTarget: 'all', mailTitle: '', mailContent: '',
        popupTitle: '', popupMessage: '',
        verNum: '1.2.0', verMsg: ''
    });

    const [newsList, setNewsList] = useState<any[]>([]);
    const [popupsList, setPopupsList] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const news = await api.getNews();
            setNewsList(news);
            const popups = await api.getPopups();
            setPopupsList(popups);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [tab]);

    const handleAction = async (type: string, id?: string) => {
        setLoading(true);
        try {
            if (type === '彈窗公告' && form.popupTitle && form.popupMessage) {
                await api.createPopup(form.popupTitle, form.popupMessage);
                alert('✅ 彈窗公告發布成功！');
                setForm({ ...form, popupTitle: '', popupMessage: '' });
                fetchData();
            } else if (type === '新聞' && form.newsTitle && form.newsContent) {
                await api.createNews(form.newsTitle, `${form.newsColor}|${form.newsContent}`);
                alert('✅ 新聞發布成功！');
                setForm({ ...form, newsTitle: '', newsContent: '' });
                fetchData();
            } else if (type === '郵件' && form.mailTitle && form.mailContent) {
                await api.sendMail(form.mailTarget, form.mailTitle, form.mailContent);
                alert('✅ 郵件發送成功！');
                setForm({ ...form, mailTarget: 'all', mailTitle: '', mailContent: '' });
            } else if (type === '熱更新' && form.verNum) {
                const response = await fetch('https://game-xhnj.onrender.com/api/admin/trigger-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ version: form.verNum, message: form.verMsg }),
                });
                if (response.ok) {
                    alert('✅ 熱更新已觸發！');
                }
            } else if (type === '刪除新聞' && id) {
                if (confirm('確定要刪除這條新聞嗎？')) {
                    await api.deleteNews(id);
                    fetchData();
                }
            } else if (type === '刪除彈窗' && id) {
                if (confirm('確定要刪除這個彈窗嗎？')) {
                    await api.deletePopup(id);
                    fetchData();
                }
            } else {
                alert('請填寫完整資料');
            }
        } catch (error) {
            console.error('Action failed:', error);
            alert('❌ 操作失敗，請檢查網路連線');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background text-white overflow-y-auto pb-20">
            <div className="max-w-4xl mx-auto p-6 flex flex-col min-h-screen">
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-3 glass-card hover:bg-white/10 transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold gradient-text">管理員控制台</h1>
                    </div>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        Admin Authorized
                    </div>
                </header>

                <nav className="flex gap-2 mb-8 overflow-x-auto pb-2 noscrollbar">
                    {[
                        { id: 'popup', icon: Bell, label: '彈窗' },
                        { id: 'news', icon: Newspaper, label: '新聞' },
                        { id: 'mail', icon: Mail, label: '郵件' },
                        { id: 'shop', icon: ShoppingCart, label: '商店' },
                        { id: 'version', icon: RefreshCw, label: '更新' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap
                ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'glass-card text-slate-400 hover:bg-white/5'}`}
                        >
                            <t.icon size={18} />
                            {t.label}
                        </button>
                    ))}
                </nav>

                <main className="flex-grow glass-card p-8 min-h-[400px] mb-10">
                    {tab === 'popup' && (
                        <section className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <Bell className="text-primary" /> 彈窗公告管理
                            </h2>
                            <div className="space-y-4">
                                <input
                                    placeholder="公告標題"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                    value={form.popupTitle} onChange={e => setForm({ ...form, popupTitle: e.target.value })}
                                />
                                <textarea
                                    rows={4} placeholder="公告內容..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none resize-none"
                                    value={form.popupMessage} onChange={e => setForm({ ...form, popupMessage: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAction('彈窗公告')} disabled={loading}
                                    className="w-full py-4 bg-primary text-black rounded-xl font-black hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? '發布中...' : ' 立即發布彈窗'}
                                </button>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">歷史彈窗紀錄</h3>
                                <div className="space-y-3">
                                    {popupsList.map(p => (
                                        <div key={p.id} className="glass-card p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{p.title}</p>
                                                <p className="text-xs text-slate-500">{p.message.slice(0, 30)}...</p>
                                            </div>
                                            <button onClick={() => handleAction('刪除彈窗', p.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {tab === 'news' && (
                        <section className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Newspaper className="text-primary" /> 發布最新消息
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        placeholder="新聞標題"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                        value={form.newsTitle} onChange={e => setForm({ ...form, newsTitle: e.target.value })}
                                    />
                                    <select
                                        className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
                                        value={form.newsColor} onChange={e => setForm({ ...form, newsColor: e.target.value })}
                                    >
                                        <option value="sky">藍色 (Sky)</option>
                                        <option value="amber">橙色 (Amber)</option>
                                        <option value="emerald">綠色 (Emerald)</option>
                                        <option value="rose">紅色 (Rose)</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={4} placeholder="消息內容..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none resize-none"
                                    value={form.newsContent} onChange={e => setForm({ ...form, newsContent: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAction('新聞')} disabled={loading}
                                    className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? '發布中...' : '立即發布'}
                                </button>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">現有新聞列表</h3>
                                <div className="space-y-3">
                                    {newsList.map(n => (
                                        <div key={n.id} className="glass-card p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full bg-${n.color || 'sky'}-500`} />
                                                <div>
                                                    <p className="font-bold text-sm">{n.title}</p>
                                                    <p className="text-xs text-slate-500">{n.date}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleAction('刪除新聞', n.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {tab === 'mail' && (
                        <section className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Mail className="text-primary" /> 全域郵件 / 私訊
                            </h2>
                            <div className="space-y-4">
                                <input
                                    placeholder="對象玩家 ID (all 為全體)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                    value={form.mailTarget} onChange={e => setForm({ ...form, mailTarget: e.target.value })}
                                />
                                <input
                                    placeholder="郵件主旨"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                    value={form.mailTitle} onChange={e => setForm({ ...form, mailTitle: e.target.value })}
                                />
                                <textarea
                                    rows={4} placeholder="郵件內容..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none resize-none"
                                    value={form.mailContent} onChange={e => setForm({ ...form, mailContent: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAction('郵件')} disabled={loading}
                                    className="w-full py-4 bg-secondary rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    <Send className="inline mr-2" size={18} /> {loading ? '傳送中...' : '發送郵件'}
                                </button>
                                <p className="text-xs text-slate-500">※ 郵件發出後目前僅支援資料庫手動操作刪除（或點對點刪除）。</p>
                            </div>
                        </section>
                    )}

                    {tab === 'version' && (
                        <section className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <RefreshCw className="text-primary" /> OTA 熱更新管理
                            </h2>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                                <p className="text-sm text-primary font-bold mb-2">💡 OTA 熱更新說明</p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    此功能可讓您直接推送遊戲內容更新，無需玩家重新下載APK。
                                    <br />⚠️ 目前正在運行版本號：1.2.0
                                </p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    placeholder="新版本號 (例如 1.2.1)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                    value={form.verNum} onChange={e => setForm({ ...form, verNum: e.target.value })}
                                />
                                <input
                                    placeholder="更新說明"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                                    value={form.verMsg} onChange={e => setForm({ ...form, verMsg: e.target.value })}
                                />
                                <button
                                    onClick={() => handleAction('熱更新')}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-black rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                                >
                                    {loading ? '推送中...' : '🚀 推播OTA熱更新'}
                                </button>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPortal;
