export const filterRequests = (requests, searchTerm) => {
  if (!searchTerm) return requests;
  
  const term = searchTerm.toLowerCase();
  return requests.filter(item =>
    item.student?.fullName?.toLowerCase().includes(term) ||
    item.student?.studentCode?.toLowerCase().includes(term) ||
    item.student?.class?.toLowerCase().includes(term) ||
    item.note?.toLowerCase().includes(term) ||
    item.parent?.fullName?.toLowerCase().includes(term)
  );
};

export const generateReportData = (todayRequests, allRequests) => {
  const approvedCount = todayRequests.filter(item => item.status === 'approved').length;
  const pendingCount = todayRequests.filter(item => item.status === 'pending').length;

  return [
    {
      title: "Tất cả yêu cầu",
      value: todayRequests.length,
      subtitle: "trong hôm nay",
      data: todayRequests
    },
    {
      title: "Yêu cầu đã xử lý",
      value: approvedCount,
      subtitle: "trong hôm nay",
      data: todayRequests.filter(item => item.status === 'approved')
    },
    {
      title: "Yêu cầu chưa xử lý",
      value: pendingCount,
      subtitle: "trong hôm nay",
      data: todayRequests.filter(item => item.status === 'pending')
    },
    {
      title: "Tất cả yêu cầu",
      value: allRequests.length,
      subtitle: "trong năm",
      data: allRequests
    },
  ];
};