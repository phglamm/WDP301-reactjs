import React from 'react';
import {
  FaWeight, FaRulerVertical, FaTint, FaHeartbeat, FaEye, FaDeaf,
  FaExclamationTriangle, FaNotesMedical, FaChartLine
} from 'react-icons/fa';

const ProfileCard = ({ profile, index, calcBMI, bmiStatus, healthScore, formatDate }) => {
  const bmi = calcBMI(profile.weight, profile.height);
  const bmiText = bmiStatus(bmi);
  const health = healthScore(profile.vision, profile.hearing);
  const visionGood = profile.vision >= 8;
  const hearingGood = profile.hearing >= 8;

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div>
          <h3>Hồ sơ #{index + 1}</h3>
          <div className="update-date">
            <FaChartLine />
            Cập nhật: {formatDate(profile.date)}
          </div>
        </div>
        <div className="bmi-box">
          <div className="bmi-value">{bmi}</div>
          <div className={`bmi-status ${bmiText === 'Bình thường' ? 'normal' : 'alert'}`}>{bmiText}</div>
          <div className="bmi-label">BMI</div>
        </div>
      </div>

      <div className="profile-details">
        <div><FaWeight /> Cân nặng: <strong>{profile.weight}kg</strong></div>
        <div><FaRulerVertical /> Chiều cao: <strong>{profile.height}cm</strong></div>
        <div><FaTint /> Nhóm máu: <strong>{profile.bloodType}</strong></div>
        <div><FaHeartbeat /> Tổng quát: <strong>{health}/10</strong></div>
        <div><FaEye /> Thị lực: <strong>{profile.vision}/10</strong> {visionGood ? '✅' : '⚠️'}</div>
        <div><FaDeaf /> Thính giác: <strong>{profile.hearing}/10</strong> {hearingGood ? '✅' : '⚠️'}</div>
      </div>

      {profile.allergy && (
        <div className="allergy-box"
        style={{marginBottom: '10px'}}>
          <FaExclamationTriangle />
          Dị ứng: {profile.allergy}
        </div>
      )}

      {profile.note && (
        <div className="note-box">
          <FaNotesMedical />
          <div>
            <strong>Ghi chú:</strong>
            <p>{profile.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
