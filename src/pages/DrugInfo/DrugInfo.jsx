import React, { useState } from 'react';
import styles from './DrugInfo.module.scss';
import DrugForm from '../../components/DrugInfo/DrugForm';
import DrugTable from '../../components/DrugInfo/DrugTable';
import { Pill } from 'lucide-react';


const DrugInfo = () => {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Aspirin',
      dosage: '100',
      unit: 'mg',
      frequency: 'Một lần mỗi ngày',
      startDate: '2024-01-15',
      endDate: '',
      notes: 'Uống cùng thức ăn để tránh đau dạ dày'
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500',
      unit: 'mg',
      frequency: 'Hai lần mỗi ngày',
      startDate: '2024-02-01',
      endDate: '',
      notes: 'Theo dõi đường huyết thường xuyên'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const units = ['mg', 'g', 'ml', 'viên', 'gói', 'giọt', 'ống'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.dosage || !formData.frequency || !formData.startDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (isEditing) {
      setMedications(prev => prev.map(med =>
        med.id === editingId
          ? { ...formData, id: editingId }
          : med
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newMedication = {
        ...formData,
        id: Date.now()
      };
      setMedications(prev => [...prev, newMedication]);
    }

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

  const handleEdit = (medication) => {
    setFormData(medication);
    setIsEditing(true);
    setEditingId(medication.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này không?')) {
      setMedications(prev => prev.filter(med => med.id !== id));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles['header__icon-wrapper']}>
            <Pill className={styles['header__icon']} />
          </div>
          <h1 className={styles['header__title']}>Quản Lý Thuốc</h1>
          <p className={styles['header__subtitle']}>Theo dõi và quản lý thông tin thuốc một cách dễ dàng</p>
        </header>

        <DrugForm
          formData={formData}
          units={units}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          cancelEdit={cancelEdit}
        />

        <DrugTable
          medications={medications}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default DrugInfo;
