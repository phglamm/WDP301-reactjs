import React, { useState } from 'react';

const MedicationForm = ({ onAdd, disabled }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    onAdd(formData);
    setFormData({
      name: '',
      dosage: '',
      unit: 'mg',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
  };

  return (
    <div className={`bg-white p-5 rounded shadow mb-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-semibold text-[#223A6A] mb-4">Add New Medication</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Medication Name" className="input" />
        <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="Dosage" className="input" />
        <input name="unit" value={formData.unit} onChange={handleChange} placeholder="Unit" className="input" />
        <input name="frequency" value={formData.frequency} onChange={handleChange} placeholder="Frequency" className="input" />
        <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="input" />
        <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="input" />
      </div>
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any important notes..." className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#407CE2]" />
      <button onClick={handleAdd} className="bg-[#407CE2] text-white px-4 py-2 rounded hover:bg-[#2b6cc6]">
        Add Medication
      </button>
    </div>
  );
};

export default MedicationForm;
