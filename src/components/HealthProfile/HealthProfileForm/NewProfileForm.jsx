import React from 'react';
import {
  FaBookMedical, FaWeight, FaRulerVertical, FaTint, FaEye, FaDeaf,
  FaExclamationTriangle, FaNotesMedical
} from 'react-icons/fa';

const NewProfileForm = ({ newProfile, setNewProfile, handleAddProfile }) => {
  const input = (label, icon, value, setValue, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label><span className="icon">{icon}</span> {label}</label>
      <input
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="new-profile-form">
      <div className="form-header">
        <FaBookMedical />
        <h2>Khai báo hồ sơ mới</h2>
      </div>
      <div className="form-grid">
        {input("Cân nặng (kg) *", <FaWeight />, newProfile.weight, val => setNewProfile({ ...newProfile, weight: val }), 'number', '60')}
        {input("Chiều cao (cm) *", <FaRulerVertical />, newProfile.height, val => setNewProfile({ ...newProfile, height: val }), 'number', '160')}
        <div className="form-group">
          <label><FaTint /> Nhóm máu *</label>
          <select value={newProfile.bloodType} onChange={e => setNewProfile({ ...newProfile, bloodType: e.target.value })}>
            {['A', 'B', 'AB', 'O'].map(type => <option key={type}>{type}</option>)}
          </select>
        </div>
        {input("Thị lực (0-10) *", <FaEye />, newProfile.vision, val => setNewProfile({ ...newProfile, vision: val }), 'number', '10')}
        {input("Thính giác (0-10) *", <FaDeaf />, newProfile.hearing, val => setNewProfile({ ...newProfile, hearing: val }), 'number', '10')}
        {input("Dị ứng", <FaExclamationTriangle />, newProfile.allergy, val => setNewProfile({ ...newProfile, allergy: val }))}
        <div className="form-group full-width">
          <label><FaNotesMedical /> Ghi chú</label>
          <textarea
            value={newProfile.note}
            onChange={e => setNewProfile({ ...newProfile, note: e.target.value })}
            placeholder="Nhập ghi chú bổ sung..."
          />
        </div>
      </div>
      <button className="save-button" onClick={handleAddProfile}>
        <FaBookMedical />
        Lưu hồ sơ
      </button>
    </div>
  );
};

export default NewProfileForm;
