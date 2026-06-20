import { useEffect, useState } from 'react';
import { DollarSign, Plus, Receipt, Clock, CheckCircle2, XCircle, CreditCard, Wallet, X } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { financeApi, hrApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

function ReimbursementModal({ user, onClose, onSaved }) {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        category: 'Travel',
        notes: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await financeApi.createExpense({
                ...form,
                amount: parseFloat(form.amount),
                submitted_by: user.email,
                status: 'pending'
            });
            onSaved();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3>Request Reimbursement</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
                </div>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                        <label className="form-label">Expense Title</label>
                        <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Flight to conference, Client Lunch" required />
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <input type="number" step="0.01" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="Travel">Travel</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Meals">Meals</option>
                                <option value="Software">Software</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes / Description</label>
                        <textarea className="form-input" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Provide more details or receipt info..." />
                    </div>
                    {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MyFinancePage() {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [emps, exps] = await Promise.all([
                hrApi.employees(),
                financeApi.expenses(user.email)
            ]);
            const me = emps.find(e => e.email.toLowerCase() === user.email.toLowerCase());
            setEmployee(me);
            setExpenses(exps);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [user.email]);

    const fmt = n => `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

    const grossMonthly = (employee?.salary_lpa * 100000) / 12;
    const netMonthly = employee?.monthly_take_home || 0;
    const deductions = Math.max(0, grossMonthly - netMonthly);

    const getStatusBadge = (status) => {
        if (status === 'approved') return <span className="badge badge-success"><CheckCircle2 size={10} /> Approved</span>;
        if (status === 'rejected') return <span className="badge badge-danger"><XCircle size={10} /> Rejected</span>;
        return <span className="badge badge-warning"><Clock size={10} /> Pending</span>;
    };

    return (
        <AppLayout pageTitle="My Salary & Finances">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>My Salary & Finances</h1>
                    <p>View your compensation and manage reimbursements</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    <Plus size={16} /> New Reimbursement
                </button>
            </div>

            <div className="grid-3" style={{ marginBottom: 32 }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', color: '#fff', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div style={{ padding: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 12 }}><Wallet size={24} /></div>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Annual Package</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{employee?.salary_lpa} LPA</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{fmt(employee?.salary_lpa * 100000)} / year</div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ background: 'var(--success-glow)', padding: 8, borderRadius: 8, color: 'var(--success)' }}><CheckCircle2 size={18} /></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Net Monthly Take-home</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)' }}>{fmt(netMonthly)}</div>
                        </div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Gross Monthly:</span>
                        <span style={{ fontWeight: 600 }}>{fmt(grossMonthly)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Deductions (PT/PF/Tax):</span>
                        <span style={{ fontWeight: 600, color: 'var(--danger)' }}>-{fmt(deductions)}</span>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'var(--warning-glow)', padding: 12, borderRadius: 12, color: 'var(--warning)' }}><Receipt size={24} /></div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0))}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pending Reimbursements</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Reimbursement Requests</span>
                    <span className="badge badge-gray">{expenses.length} total</span>
                </div>
                <div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title / Activity</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ width: 24, height: 24, margin: '0 auto' }} /></td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No reimbursement requests found</td></tr>
                            ) : expenses.map(e => (
                                <tr key={e.id}>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{e.title}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }} className="truncate">{e.notes || 'No description'}</div>
                                    </td>
                                    <td><span className="chip">{e.category}</span></td>
                                    <td style={{ fontWeight: 600 }}>{fmt(e.amount)}</td>
                                    <td style={{ fontSize: 12 }}>{e.date}</td>
                                    <td>{getStatusBadge(e.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <ReimbursementModal
                    user={user}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { setModalOpen(false); loadData(); }}
                />
            )}
        </AppLayout>
    );
}
