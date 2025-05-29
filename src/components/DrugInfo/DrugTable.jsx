import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import styles from '../../pages/DrugInfo/DrugInfo.module.scss';

const DrugTable = ({ medications, handleEdit, handleDelete }) => {
  return (
    <div className={styles['form-container']}>
      <div
        className={styles['form-header']}
        style={{ background: 'linear-gradient(to right, #a9c9ff, #5076c1)' }}
      >
        <div className={styles['form-header__icon-wrapper']}>
          <Calendar className={styles['form-header__icon']} />
        </div>
        Danh Sách Thuốc Hiện Tại & Đã Dùng
      </div>
      <div className={styles['form-body']}>
        {medications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-[#223A6A]/20 to-[#407CE2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-[#407CE2]" />
            </div>
            <h3 className="text-2xl font-bold text-[#223A6A] mb-2">Chưa có thuốc nào</h3>
            <p className="text-slate-500 text-lg">Thêm thuốc đầu tiên của bạn bằng biểu mẫu bên trên</p>
          </div>
        ) : (
          <div className={styles['table-container']}>
            <div className={styles['table-wrapper']}>
              <table>
                <thead>
                  <tr>
                    <th>Tên Thuốc</th>
                    <th>Liều Lượng</th>
                    <th>Tần Suất</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Ghi Chú</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication, index) => (
                    <tr
                      key={medication.id}
                      className={index % 2 === 0 ? '' : ''}
                    >
                      <td>
                        <div className={styles['td-name']}>
                          <div className={styles['td-name__dot']}></div>
                          <span>{medication.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-gradient">
                          {medication.dosage} {medication.unit}
                        </span>
                      </td>
                      <td>{medication.frequency}</td>
                      <td>{medication.startDate}</td>
                      <td>{medication.endDate || '-'}</td>
                      <td title={medication.notes}>
                        <div className="truncate">{medication.notes || '-'}</div>
                      </td>
                      <td className={styles['td-actions']}>
                        <button
                          onClick={() => handleEdit(medication)}
                          className={styles['btn-edit']}
                          title="Chỉnh sửa thuốc"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(medication.id)}
                          className={styles['btn-delete']}
                          title="Xóa thuốc"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugTable;
