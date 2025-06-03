
import React from 'react';

const StudentSelector = ({ students, selectedStudent, setSelectedStudent }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-[#223A6A] mb-1">Select Student</label>
      <select
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#407CE2]"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">-- Select a student --</option>
        {students.map((student, idx) => (
          <option key={idx} value={student}>{student}</option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;
