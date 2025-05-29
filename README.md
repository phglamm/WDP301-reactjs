# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





import React, { useState } from 'react';
import { FaBookMedical, FaDeaf, FaExclamationTriangle, FaEye, FaHistory, FaNotesMedical, FaRegStickyNote, FaRulerVertical, FaTint, FaWeight, FaUserMd, FaHeartbeat, FaChartLine } from 'react-icons/fa';

const initialChildren = [
    {
        id: 1,
        fullName: 'Nguyễn Khánh Tùng',
        studentId: 'SS160730',
        profiles: [
            {
                id: 1,
                weight: 65,
                height: 170,
                bloodType: 'A',
                vision: 7,
                hearing: 10,
                allergy: '10',
                note: 'dd',
                date: '2025-05-29T10:58:25',
            },
            {
                id: 2,
                weight: 1,
                height: 1,
                bloodType: 'A',
                vision: 0,
                hearing: 0,
                allergy: '',
                note: '',
                date: '2025-05-28T09:00:00',
            },
        ],
    },
    {
        id: 2,
        fullName: 'Nguyễn Quốc Huy',
        studentId: 'SE444444',
        profiles: [],
    }
];

// Helper tính BMI
const calcBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const h = height / 100;
    return +(weight / (h * h)).toFixed(1);
};

// Helper đánh giá BMI
const bmiStatus = (bmi) => {
    if (bmi === 0) return '';
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường';
    if (bmi < 30) return 'Thừa cân';
    return 'Béo phì';
};

const HealthProfile = () => {
    const [children, setChildren] = useState(initialChildren);
    const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || null);

    const selectedChild = children.find(c => c.id === selectedChildId);

    const [newProfile, setNewProfile] = useState({
        weight: '',
        height: '',
        bloodType: 'A',
        vision: '',
        hearing: '',
        allergy: '',
        note: ''
    });

    React.useEffect(() => {
        setNewProfile({
            weight: '',
            height: '',
            bloodType: 'A',
            vision: '',
            hearing: '',
            allergy: '',
            note: ''
        });
    }, [selectedChildId]);

    const handleAddProfile = () => {
        if (!newProfile.weight || !newProfile.height || !newProfile.bloodType || !newProfile.vision || !newProfile.hearing) {
            alert('Vui lòng nhập đầy đủ các trường bắt buộc!');
            return;
        }
        const profile = {
            id: Date.now(),
            weight: Number(newProfile.weight),
            height: Number(newProfile.height),
            bloodType: newProfile.bloodType,
            vision: Number(newProfile.vision),
            hearing: Number(newProfile.hearing),
            allergy: newProfile.allergy,
            note: newProfile.note,
            date: new Date().toISOString()
        };
        const updatedChildren = children.map(c => {
            if (c.id === selectedChildId) {
                return { ...c, profiles: [profile, ...c.profiles] };
            }
            return c;
        });
        setChildren(updatedChildren);
        setNewProfile({
            weight: '',
            height: '',
            bloodType: 'A',
            vision: '',
            hearing: '',
            allergy: '',
            note: ''
        });
    };

    const healthScore = (vision, hearing) => {
        if (typeof vision !== 'number' || typeof hearing !== 'number') return 0;
        return ((vision + hearing) / 2).toFixed(1);
    };

    const formatDate = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px',
        gap: '8px'
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            // background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 50%, #fdf2f8 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite'
        }}>
            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .input-focus:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    outline: none;
                }
                .student-card:hover {
                    transform: translateX(8px);
                }
            `}</style>

            {/* Sidebar */}
            <div style={{ 
                width: '320px', 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)', 
                padding: '32px 24px',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '32px',
                    gap: '12px'
                }}>
                    <FaUserMd size={28} color="#ffffff" />
                    <h2 style={{ 
                        fontWeight: '700', 
                        fontSize: '24px', 
                        color: '#ffffff',
                        margin: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Học sinh
                    </h2>
                </div>
                
                {children.map((child, index) => (
                    <div
                        key={child.id}
                        onClick={() => setSelectedChildId(child.id)}
                        className="student-card hover-lift"
                        style={{
                            cursor: 'pointer',
                            padding: '20px 24px',
                            marginBottom: '16px',
                            borderRadius: '16px',
                            background: child.id === selectedChildId 
                                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                                : 'rgba(255, 255, 255, 0.9)',
                            color: child.id === selectedChildId ? 'white' : '#1f2937',
                            boxShadow: child.id === selectedChildId 
                                ? '0 10px 25px rgba(59, 130, 246, 0.4)' 
                                : '0 4px 15px rgba(0,0,0,0.1)',
                            fontWeight: '600',
                            transition: 'all 0.4s ease',
                            transform: child.id === selectedChildId ? 'scale(1.02)' : 'scale(1)',
                            animationDelay: `${index * 0.1}s`
                        }}
                    >
                        <div style={{ fontSize: '16px', marginBottom: '6px' }}>
                            {child.fullName}
                        </div>
                        <div style={{ 
                            fontSize: '13px', 
                            opacity: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <span>MSSV: {child.studentId}</span>
                            {child.profiles.length > 0 && (
                                <span style={{
                                    background: child.id === selectedChildId ? 'rgba(255,255,255,0.2)' : '#10b981',
                                    color: child.id === selectedChildId ? 'white' : 'white',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '11px'
                                }}>
                                    {child.profiles.length} hồ sơ
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ 
                flex: 1, 
                padding: '32px', 
                overflow: 'auto'
            }}>
                <div className="fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '32px',
                        marginBottom: '32px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                            <FaHeartbeat size={36} color="#f43f5e" />
                            <h1 style={{ 
                                fontSize: '32px', 
                                fontWeight: '800', 
                                margin: 0,
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f43f5e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Hồ sơ sức khỏe
                            </h1>
                        </div>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '4px'
                        }}>
                            {selectedChild?.fullName || 'Chưa chọn học sinh'}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                            MSSV: {selectedChild?.studentId}
                        </div>
                    </div>

                    {/* Form thêm hồ sơ */}
                    <div className="glass-card hover-lift" style={{
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        padding: '40px',
                        marginBottom: '40px',
                        transition: 'all 0.4s ease'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            marginBottom: '32px'
                        }}>
                            <FaBookMedical size={28} color="#3b82f6" />
                            <h2 style={{ 
                                fontWeight: '700', 
                                fontSize: '24px',
                                margin: 0,
                                color: '#1f2937'
                            }}>
                                Khai báo hồ sơ mới
                            </h2>
                        </div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '24px' 
                        }}>
                            <div>
                                <label style={labelStyle}>
                                    <FaWeight color="#3b82f6" size={18} />
                                    Cân nặng (kg) *
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ví dụ: 60"
                                    value={newProfile.weight}
                                    onChange={e => setNewProfile({ ...newProfile, weight: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <FaRulerVertical color="#10b981" size={18} />
                                    Chiều cao (cm) *
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ví dụ: 160"
                                    value={newProfile.height}
                                    onChange={e => setNewProfile({ ...newProfile, height: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <FaTint color="#ef4444" size={18} />
                                    Nhóm máu *
                                </label>
                                <select
                                    value={newProfile.bloodType}
                                    onChange={e => setNewProfile({ ...newProfile, bloodType: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                >
                                    {['A', 'B', 'AB', 'O'].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <FaEye color="#f59e0b" size={18} />
                                    Thị lực (0-10) *
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    placeholder="10 = tốt nhất"
                                    value={newProfile.vision}
                                    onChange={e => setNewProfile({ ...newProfile, vision: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <FaDeaf color="#6366f1" size={18} />
                                    Thính giác (0-10) *
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    placeholder="10 = tốt nhất"
                                    value={newProfile.hearing}
                                    onChange={e => setNewProfile({ ...newProfile, hearing: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <FaExclamationTriangle color="#f97316" size={18} />
                                    Dị ứng (nếu có)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Phấn hoa"
                                    value={newProfile.allergy}
                                    onChange={e => setNewProfile({ ...newProfile, allergy: e.target.value })}
                                    className="input-focus"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>
                                    <FaNotesMedical color="#4f46e5" size={18} />
                                    Ghi chú
                                </label>
                                <textarea
                                    placeholder="Nhập ghi chú bổ sung..."
                                    value={newProfile.note}
                                    onChange={e => setNewProfile({ ...newProfile, note: e.target.value })}
                                    className="input-focus"
                                    style={{
                                        ...inputStyle,
                                        minHeight: '100px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddProfile}
                            style={{
                                marginTop: '32px',
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                            }}
                        >
                            <FaBookMedical size={16} />
                            Lưu hồ sơ
                        </button>
                    </div>

                    {/* Lịch sử hồ sơ */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginBottom: '24px'
                    }}>
                        <FaHistory size={28} color="#ffffff" />
                        <h2 style={{ 
                            fontWeight: '700', 
                            fontSize: '24px',
                            margin: 0,
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Lịch sử hồ sơ
                        </h2>
                    </div>

                    {selectedChild?.profiles.length > 0 ? (
                        selectedChild.profiles.map((p, idx) => {
                            const bmi = calcBMI(p.weight, p.height);
                            const bmiStatusText = bmiStatus(bmi);
                            const healthTotal = healthScore(p.vision, p.hearing);
                            const visionGood = p.vision >= 8;
                            const hearingGood = p.hearing >= 8;
                            
                            return (
                                <div key={p.id} className="glass-card hover-lift fade-in-up" style={{
                                    borderRadius: '20px',
                                    padding: '32px',
                                    marginBottom: '24px',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                                    transition: 'all 0.4s ease',
                                    animationDelay: `${idx * 0.1}s`
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-start', 
                                        marginBottom: '24px',
                                        flexWrap: 'wrap',
                                        gap: '16px'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <h3 style={{ 
                                                    fontWeight: '700', 
                                                    fontSize: '22px', 
                                                    margin: 0,
                                                    color: '#1f2937'
                                                }}>
                                                    Hồ sơ #{idx + 1}
                                                </h3>
                                                {idx === 0 && (
                                                    <span style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                                    }}>
                                                        Mới nhất
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ 
                                                color: '#6b7280', 
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <FaChartLine size={14} />
                                                Cập nhật: {formatDate(p.date)}
                                            </div>
                                        </div>
                                        
                                        <div style={{ 
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                                            padding: '20px',
                                            borderRadius: '16px',
                                            border: '2px solid #e0e7ff'
                                        }}>
                                            <div style={{ 
                                                fontWeight: '800', 
                                                fontSize: '28px', 
                                                color: '#3b82f6',
                                                marginBottom: '4px'
                                            }}>
                                                {bmi}
                                            </div>
                                            <div style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600',
                                                color: bmiStatusText === 'Bình thường' ? '#16a34a' : '#dc2626',
                                                marginBottom: '2px'
                                            }}>
                                                {bmiStatusText}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>BMI</div>
                                        </div>
                                    </div>

                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                        gap: '16px', 
                                        marginBottom: '20px' 
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaWeight color="#3b82f6" />
                                            <span>Cân nặng: <strong>{p.weight}kg</strong></span>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaRulerVertical color="#10b981" />
                                            <span>Chiều cao: <strong>{p.height}cm</strong></span>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaTint color="#ef4444" />
                                            <span>Nhóm máu: <strong>{p.bloodType}</strong></span>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(139, 92, 246, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaHeartbeat color="#8b5cf6" />
                                            <span>Điểm tổng quát: <strong>{healthTotal}/10</strong></span>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(245, 158, 11, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaEye color="#f59e0b" />
                                            <span>Thị lực: <strong>{p.vision}/10</strong> {visionGood ? '✅' : '⚠️'}</span>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            padding: '12px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '12px'
                                        }}>
                                            <FaDeaf color="#6366f1" />
                                            <span>Thính giác: <strong>{p.hearing}/10</strong> {hearingGood ? '✅' : '⚠️'}</span>
                                        </div>
                                    </div>

                                    {p.allergy && (
                                        <div style={{ 
                                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                            padding: '16px', 
                                            borderRadius: '12px', 
                                            color: '#991b1b', 
                                            fontWeight: '600', 
                                            marginBottom: '16px',
                                            border: '1px solid #fecaca',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <FaExclamationTriangle />
                                            <span>Dị ứng: {p.allergy}</span>
                                        </div>
                                    )}
                                    
                                    {p.note && (
                                        <div style={{ 
                                            color: '#374151', 
                                            fontSize: '14px',
                                            background: 'rgba(156, 163, 175, 0.1)',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '8px'
                                        }}>
                                            <FaNotesMedical color="#6b7280" style={{ marginTop: '2px' }} />
                                            <div>
                                                <strong>Ghi chú:</strong>
                                                <div style={{ marginTop: '4px' }}>{p.note}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="glass-card" style={{ 
                            color: '#6b7280', 
                            fontStyle: 'italic',
                            textAlign: 'center',
                            padding: '40px',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.7)'
                        }}>
                            <FaRegStickyNote size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                            <div style={{ fontSize: '18px' }}>Chưa có hồ sơ sức khỏe nào cho học sinh này.</div>
                            <div style={{ fontSize: '14px', marginTop: '8px' }}>Hãy tạo hồ sơ đầu tiên bằng cách điền form bên trên.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthProfile;