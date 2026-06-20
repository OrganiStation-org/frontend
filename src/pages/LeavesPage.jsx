import { useEffect, useState } from 'react';
import { Plus, Calendar, CheckCircle2, Clock, XCircle, Coffee, Briefcase, FileText, X } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { hrApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

function LeaveModal({ employee, onClose, onSaved }) {
    const [form, setForm] = useState({
        type: 'annual',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        reason: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await hrApi.createLeave({
                ...form,
                employee_id: employee.id || employee._id,
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
                    <h3>Apply for Leave / WFH</h3>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
                </div>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="annual">Annual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="wfh">Work From Home (WFH)</option>
                            <option value="unpaid">Unpaid Leave</option>
                        </select>
                    </div>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input type="date" className="form-input" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Reason / Notes</label>
                        <textarea className="form-input" rows={3} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Family vacation, medical checkup..." />
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

export default function LeavesPage() {
    const { user, hasPermission } = useAuth();
    const isHR = hasPermission('hr:write');

    const [employee, setEmployee] = useState(null);
    const [myLeaves, setMyLeaves] = useState([]);
    const [allLeaves, setAllLeaves] = useState([]);
    const [employeesMap, setEmployeesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const emps = await hrApi.employees();
            const map = {};
            emps.forEach(e => { map[e.id || e._id] = e; });
            setEmployeesMap(map);

            const me = emps.find(e => e.email.toLowerCase() === user.email.toLowerCase());
            setEmployee(me);

            if (me) {
                const leaves = await hrApi.leaveRequests(me.id || me._id);
                setMyLeaves(leaves);
            }

            if (isHR) {
                const total = await hrApi.leaveRequests();
                setAllLeaves(total);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [user, isHR]);

    const updateStatus = async (id, status) => {
        try {
            await hrApi.updateLeave(id, status);
            await loadData();
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') return <span className="badge badge-success"><CheckCircle2 size={10} /> Approved</span>;
        if (status === 'rejected') return <span className="badge badge-danger"><XCircle size={10} /> Rejected</span>;
        return <span className="badge badge-warning"><Clock size={10} /> Pending</span>;
    };

    return (
        <AppLayout pageTitle="Leaves & Time Off">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Leaves & Time Off</h1>
                    <p>Apply for leaves, WFH and track your balance</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    <Plus size={16} /> Apply for Leave
                </button>
            </div>

            {employee && (
                <div className="grid-4" style={{ marginBottom: 32 }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ background: 'var(--primary-glow)', padding: 12, borderRadius: 12, color: 'var(--primary)' }}><Calendar size={24} /></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{employee.annual_total - employee.annual_used}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Annual Leaves Left</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--success)' }}>
                        <div style={{ background: 'var(--success-glow)', padding: 12, borderRadius: 12, color: 'var(--success)' }}><Coffee size={24} /></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{employee.sick_total - employee.sick_used}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sick Leaves Left</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--warning)' }}>
                        <div style={{ background: 'var(--warning-glow)', padding: 12, borderRadius: 12, color: 'var(--warning)' }}><Briefcase size={24} /></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{employee.wfh_total - employee.wfh_used}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>WFH Credits Left</div>
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--purple)' }}>
                        <div style={{ background: 'var(--purple-glow)', padding: 12, borderRadius: 12, color: 'var(--purple)' }}><FileText size={24} /></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 800 }}>{myLeaves.length}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Requests</div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: isHR ? '1fr 1fr' : '1fr', gap: 24 }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>My Recent Requests</div>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        <table className="data-table">
                            <thead><tr><th>Type</th><th>Dates</th><th>Status</th></tr></thead>
                            <tbody>
                                {myLeaves.length === 0 ? (
                                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No leave requests yet</td></tr>
                                ) : myLeaves.map(l => (
                                    <tr key={l.id}>
                                        <td style={{ textTransform: 'capitalize', fontWeight: 500 }}>{l.type}</td>
                                        <td style={{ fontSize: 12 }}>{l.start_date} to {l.end_date}</td>
                                        <td>{getStatusBadge(l.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isHR && (
                    <div className="card" style={{ padding: 0, borderTop: '4px solid var(--primary)' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Approval Queue</span>
                            <span className="badge badge-primary">{allLeaves.filter(l => l.status === 'pending').length} Pending</span>
                        </div>
                        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                            <table className="data-table">
                                <thead><tr><th>Employee</th><th>Type</th><th>Period</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {allLeaves.filter(l => l.status === 'pending').length === 0 ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>All caught up! No pending requests.</td></tr>
                                    ) : allLeaves.filter(l => l.status === 'pending').map(l => {
                                        const emp = employeesMap[l.employee_id];
                                        return (
                                            <tr key={l.id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp?.department}</div>
                                                </td>
                                                <td style={{ textTransform: 'capitalize' }}>{l.type}</td>
                                                <td style={{ fontSize: 11 }}>{l.start_date}<br />to {l.end_date}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-success btn-xs" onClick={() => updateStatus(l.id, 'approved')}>Approve</button>
                                                        <button className="btn btn-danger btn-xs" onClick={() => updateStatus(l.id, 'rejected')}>Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {modalOpen && employee && (
                <LeaveModal
                    employee={employee}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { setModalOpen(false); loadData(); }}
                />
            )}
        </AppLayout>
    );
}
