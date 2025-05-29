import React from 'react';
import { Plus, Pill } from 'lucide-react';
import styles from '../../pages/DrugInfo/DrugInfo.module.scss';

const DrugForm = ({
  formData,
  units,
  isEditing,
  handleInputChange,
  handleSubmit,
  cancelEdit
}) => (
  <div className={styles['form-container']}>
    <div className={styles['form-header']}>
      <div className={styles['form-header__icon-wrapper']}>
        <Plus className={styles['form-header__icon']} />
      </div>
      {isEditing ? 'Chỉnh Sửa Thuốc' : 'Thêm Thuốc Mới'}
    </div>
    <div className={styles['form-body']}>
      <div className={styles['grid-3-cols']}>
        <div className={styles['input-group']}>
          <label className={styles.label}>
            <Pill className={styles.icon} /> Tên Thuốc *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="VD: Paracetamol"
            className={styles.input}
            required
          />
        </div>
        <div className={styles['input-group']}>
          <label className={styles.label}>Liều Lượng *</label>
          <input
            type="number"
            name="dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            placeholder="VD: 500"
            className={styles.input}
            required
          />
        </div>
        <div className={styles['input-group']}>
          <label className={styles.label}>Đơn Vị</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className={styles.select}
          >
            {units.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles['grid-3-cols']}>
        <div className={styles['input-group']}>
          <label className={styles.label}>Tần Suất Sử Dụng *</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChange}
            placeholder="VD: Hai lần mỗi ngày"
            className={styles.input}
            required
          />
        </div>
        <div className={styles['input-group']}>
          <label className={styles.label}>Ngày Bắt Đầu *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles['input-group']}>
          <label className={styles.label}>Ngày Kết Thúc (Tùy chọn)</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles['input-group']}>
        <label className={styles.label}>Ghi Chú</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Các ghi chú quan trọng về thuốc này..."
          rows="4"
          className={styles.textarea}
        />
      </div>

      <div className={styles.buttons}>
        <button onClick={handleSubmit} className={styles['button-primary']}>
          <Plus className="icon" />
          {isEditing ? 'Cập Nhật Thuốc' : 'Thêm Thuốc'}
        </button>
        {isEditing && (
          <button onClick={cancelEdit} className={styles['button-cancel']}>
            Hủy Bỏ
          </button>
        )}
      </div>
    </div>
  </div>
);

export default DrugForm;
