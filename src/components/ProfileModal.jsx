import { useState, useEffect } from 'react';
import { X, User, Shield, Briefcase, Phone, Mail, Building, CheckCircle2 } from 'lucide-react';
import { hrApi } from '../api/client';

const ROLE_COLOR = {
    SUPER_ADMIN: 'var(--danger)',
    ORG_ADMIN: 'var(--primary)',
    HR_MANAGER: 'var(--success)',
    PROJECT_MANAGER: 'var(--secondary)',
    FINANCE_MANAGER: 'var(--warning)',
    EMPLOYEE: 'var(--text-muted)'
};

const DEPT_COLORS = {
    Engineering: 'var(--primary)',
    HR: 'var(--success)',
    Finance: 'var(--warning)',
    Marketing: 'var(--pink)',
    Operations: 'var(--secondary)'
};

export default function ProfileModal({ user: initialUser, employee: initialEmployee, onClose }) {
    const [user, setUser] = useState(initialUser);
    const [employee, setEmployee] = useState(initialEmployee);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch employee if only user provided
                if (user && !employee) {
                    const employees = await hrApi.employees();
                    const found = employees.find(e => e.email.toLowerCase() === user.email.toLowerCase());
                    setEmployee(found);
                }
                // Fetch user if only employee provided
                if (employee && !user) {
                    const users = await usersApi.list();
                    const found = users.find(u => u.email.toLowerCase() === employee.email.toLowerCase());
                    setUser(found);
                }
            } catch (err) {
                console.error("Failed to fetch profile details", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [initialUser, initialEmployee]);

    // Fallback data if user not found in auth (e.g. employee without login)
    const displayUser = user || {
        first_name: employee?.first_name || 'User',
        last_name: employee?.last_name || '',
        email: employee?.email,
        role: 'N/A',
        status: employee?.status || 'active'
    };

    const displayEmployee = employee;

    const rc = ROLE_COLOR[displayUser.role] || 'var(--text-muted)';
    const initials = `${displayUser.first_name?.[0] ?? ''}${displayUser.last_name?.[0] ?? ''}`.toUpperCase();

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 450 }}>
                <div className="modal-header" style={{ border: 'none', paddingBottom: 0 }}>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft: 'auto' }}><X size={18} /></button>
                </div>

                <div style={{ padding: '0 24px 32px 24px', textAlign: 'center' }}>
                    <div className="avatar" style={{ width: 80, height: 80, fontSize: 32, margin: '0 auto 16px', background: rc, color: '#fff', boxShadow: `0 8px 16px -4px ${rc}66` }}>
                        {initials}
                    </div>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: 20 }}>{displayUser.first_name} {displayUser.last_name}</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                        <span className="badge" style={{ background: `${rc}22`, color: rc, border: `1px solid ${rc}44` }}>
                            <Shield size={10} style={{ marginRight: 4 }} /> {displayUser.role}
                        </span>
                        <span className={`badge ${displayUser.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                            {displayUser.status}
                        </span>
                    </div>

                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ padding: '16px', background: 'var(--bg-base)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <div style={{ color: 'var(--primary)' }}><Mail size={16} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{displayUser.email}</div>
                                </div>
                            </div>

                            {loading ? (
                                <div style={{ padding: '20px 0', textAlign: 'center' }}><div className="spinner" style={{ width: 20, height: 20, margin: '0 auto' }}></div></div>
                            ) : displayEmployee ? (
                                <>
                                    <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <div style={{ color: DEPT_COLORS[displayEmployee.department] || 'var(--success)' }}><Building size={16} /></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{displayEmployee.department}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <div style={{ color: 'var(--warning)' }}><Briefcase size={16} /></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{displayEmployee.position || 'Not specified'}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ color: 'var(--secondary)' }}><Phone size={16} /></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{displayEmployee.phone || 'Not specified'}</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    No additional HR details available for this user.
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={onClose}>
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
