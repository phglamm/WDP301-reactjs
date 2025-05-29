// HealthProfile.jsx (component cha)
import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import Sidebar from '../../components/HealthProfile/HealthProfileSidebar/Sidebar';
import Header from '../../components/HealthProfile/HealthProfileHeader/Header';
import NewProfileForm from '../../components/HealthProfile/HealthProfileForm/NewProfileForm';
import ProfileCard from '../../components/HealthProfile/HealthProfileCard/ProfileCard';
import EmptyState from '../../components/HealthProfile/HealthProfileEmptyState/EmptyState';
import './HealthProfile.scss';

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
      }
    ],
  },
  {
    id: 2,
    fullName: 'Nguyễn Quốc Huy',
    studentId: 'SE444444',
    profiles: [],
  }
];

const calcBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
};

const bmiStatus = (bmi) => {
  if (bmi === 0) return '';
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 25) return 'Bình thường';
  if (bmi < 30) return 'Thừa cân';
  return 'Béo phì';
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

  useEffect(() => {
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

  return (
    <div className="health-profile">
      <Sidebar
        childrenList={children}
        selectedChildId={selectedChildId}
        setSelectedChildId={setSelectedChildId}
      />

      <main className="main-content">
        <div className="main-wrapper">
          <Header selectedChild={selectedChild} />
          <NewProfileForm
            newProfile={newProfile}
            setNewProfile={setNewProfile}
            handleAddProfile={handleAddProfile}
          />

          <section className="history-section">
            <div className="history-header">
              <FaHistory />
              <h2>Lịch sử hồ sơ</h2>
            </div>
            {selectedChild?.profiles.length > 0 ? (
              selectedChild.profiles.map((p, idx) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  index={idx}
                  calcBMI={calcBMI}
                  bmiStatus={bmiStatus}
                  healthScore={healthScore}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HealthProfile;
