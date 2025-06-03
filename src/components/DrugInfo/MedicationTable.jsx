const MedicationTable = ({ medications }) => {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="text-lg font-semibold text-[#223A6A] mb-4">Current & Past Medications</h3>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-[#223A6A] text-white">
            <th className="p-2">Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{med.name}</td>
              <td>{med.dosage} {med.unit}</td>
              <td>{med.frequency}</td>
              <td>{med.startDate}</td>
              <td>{med.endDate}</td>
              <td>{med.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTable;
