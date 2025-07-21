import React, { useState, useEffect, useCallback } from "react";
import { Form, message } from "antd";
import moment from "moment";
import AppointmentService from "../../../services/Nurse/AppointmentService/AppointmentService";

// Import components
import AppointmentStats from "../../../components/appointment/AppointmentStats";
import AppointmentHeader from "../../../components/appointment/AppointmentHeader";
import DateFilter from "../../../components/appointment/DateFilter";
import CalendarLegend from "../../../components/appointment/CalendarLegend";
import CalendarView from "../../../components/appointment/CalendarView";
import TableView from "../../../components/appointment/TableView";
import AppointmentFormModal from "../../../components/appointment/AppointmentFormModal";
import AppointmentDetailModal from "../../../components/appointment/AppointmentDetailModal";
import UserService from "../../../services/User/UserService";

const Appointment = () => {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [viewMode, setViewMode] = useState("calendar");
  const [dateRange, setDateRange] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [parent, setParent] = useState(null); // Assuming parentId is needed for filtering
  const [statistics, setStatistics] = useState({
    total: 0,
    today: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    inProgress: 0,
  });

  const getParent = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllParents();

      if (response && response.status) {
        console.log("Parent data:", response.data);
        const parents = response.data || [];
        setParent(parents);
      } else {
        message.error(response?.message || "Không thể tải danh sách phụ huynh");
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
      message.error("Có lỗi xảy ra khi tải danh sách phụ huynh");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics function
  const calculateStatistics = (appointmentList, todayList) => {
    const stats = {
      total: appointmentList.length,
      today: todayList.length,
      scheduled: appointmentList.filter((apt) => apt.status === "scheduled")
        .length,
      completed: appointmentList.filter((apt) => apt.status === "completed")
        .length,
      cancelled: appointmentList.filter((apt) => apt.status === "cancelled")
        .length,
      inProgress: appointmentList.filter((apt) => apt.status === "in-progress")
        .length,
    };

    setStatistics(stats);
  };

  // Apply date range filter
  const applyDateRangeFilter = (appointmentList, startDate, endDate) => {
    if (!startDate || !endDate) return appointmentList;

    return appointmentList.filter((appointment) => {
      const appointmentDate = moment(appointment.appointmentTime);
      return appointmentDate.isBetween(startDate, endDate, "day", "[]");
    });
  };

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const [allResponse, todayResponse] = await Promise.all([
        AppointmentService.getAllAppointments(),
        AppointmentService.getTodayAppointments().catch((error) => {
          console.error("Error fetching today appointments:", error);
          return { status: false, data: [] };
        }),
      ]);

      if (allResponse && allResponse.status) {
        setAppointments(allResponse.data || []);
        applyFilters(allResponse.data || [], activeFilter, dateRange);
      }

      if (todayResponse && todayResponse.status) {
        setTodayAppointments(todayResponse.data || []);
      }

      calculateStatistics(allResponse?.data || [], todayResponse?.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Có lỗi xảy ra khi tải danh sách cuộc hẹn");
    } finally {
      setLoading(false);
    }
  };
  // Combined filter function
  const applyFilters = useCallback((appointmentList, filterType, dateRangeFilter) => {
    let filtered = [...appointmentList];

    // Apply status filter first
    switch (filterType) {
      case "today":
        filtered = todayAppointments;
        break;
      case "scheduled":
        filtered = appointmentList.filter((apt) => apt.status === "scheduled");
        break;
      case "completed":
        filtered = appointmentList.filter((apt) => apt.status === "completed");
        break;
      case "cancelled":
        filtered = appointmentList.filter((apt) => apt.status === "cancelled");
        break;
      case "in-progress":
        filtered = appointmentList.filter(
          (apt) => apt.status === "in-progress"
        );
        break;
      case "all":
      default:
        filtered = appointmentList;
        break;
    }

    // Apply date range filter
    if (dateRangeFilter && dateRangeFilter.length === 2) {
      filtered = applyDateRangeFilter(
        filtered,
        dateRangeFilter[0],
        dateRangeFilter[1]
      );
    }

    setFilteredAppointments(filtered);
  }, [todayAppointments]);

  // Filter appointments by status
  const filterAppointments = (filterType) => {
    setActiveFilter(filterType);
    applyFilters(appointments, filterType, dateRange);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(appointments, activeFilter, dates);
  };

  // Clear date range filter
  const clearDateRange = () => {
    setDateRange(null);
    applyFilters(appointments, activeFilter, null);
  };

  // Toggle date filter visibility
  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
    if (showDateFilter && dateRange) {
      clearDateRange();
    }
  };
  useEffect(() => {
    fetchAppointments();
    getParent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Update applyFilters when todayAppointments changes
  useEffect(() => {
    if (appointments.length > 0) {
      applyFilters(appointments, activeFilter, dateRange);
    }
  }, [todayAppointments, appointments, activeFilter, dateRange, applyFilters]);
    // Convert appointments to calendar events
  const calendarEvents = filteredAppointments.map((appointment) => {
    const startTime = moment(appointment.appointmentTime);
    // Use duration from appointment data or default to 45 minutes
    const duration = appointment.duration || 45;
    const endTime = moment(appointment.appointmentTime).add(duration, "minutes");

    const getEventColor = (status) => {
      const colors = {
        scheduled: "#1890ff",
        completed: "#52c41a",
        cancelled: "#ff4d4f",
        "in-progress": "#fa8c16",
      };
      return colors[status] || "#1890ff";
    };

    return {
      id: appointment.id.toString(),
      title: `${appointment.purpose} (${duration}min)`,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      backgroundColor: getEventColor(appointment.status),
      borderColor: getEventColor(appointment.status),
      extendedProps: {
        appointment: appointment,
        status: appointment.status,
        googleMeetLink: appointment.googleMeetLink,
        duration: duration,
      },
    };
  });

  // Handle calendar event click
  const handleEventClick = async (info) => {
    const appointmentId = parseInt(info.event.id);
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (appointment) {
      await handleViewDetail(appointment);
    }
  };

  // Handle view detail
  const handleViewDetail = async (appointment) => {
    try {
      setLoading(true);
      const response = await AppointmentService.getAppointmentById(
        appointment.id
      );
      if (response && response.status) {
        setSelectedAppointment(response.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      message.error("Có lỗi xảy ra khi tải chi tiết cuộc hẹn");
    } finally {
      setLoading(false);
    }
  };  // Handle create new appointment
  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    // Set default duration when creating new appointment
    form.setFieldsValue({
      duration: 45
    });
    setModalVisible(true);
  };  // Handle calendar date selection
  const handleDateSelect = (selectInfo) => {
    setEditingId(null);
    form.resetFields();
    
    // Convert to local moment and ensure it's in the correct format
    const selectedDateTime = moment(selectInfo.start).local();
    console.log("Original selectInfo.start:", selectInfo.start);
    console.log("Moment parsed:", selectedDateTime.format("DD/MM/YYYY HH:mm:ss"));
    console.log("Moment toISOString:", selectedDateTime.toISOString());
    console.log("Is valid moment:", selectedDateTime.isValid());
    
    // Set form values after a small delay to ensure form is ready
    setTimeout(() => {
      form.setFieldsValue({
        appointmentTime: selectedDateTime,
        duration: 45
      });
      console.log("Form values set:", form.getFieldsValue());
    }, 100);
    
    setModalVisible(true);
  };// Handle form submit
  const handleSubmit = async (values) => {
    console.log("appointmentTime type:", typeof values.appointmentTime);
    console.log("appointmentTime moment check:", values.appointmentTime.format("DD/MM/YYYY HH:mm:ss"));
    console.log("appointmentTime raw:", (values.appointmentTime).format("DD/MM/YYYY HH:mm:ss"));
    console.log("Form values formatted:", (values.appointmentTime).format("DD-MM-YYYY HH:mm:ss"));
    
    try {
      setLoading(true);
      const formData = {
        parentId: values.parentId.toString(),
        purpose: values.purpose,
        appointmentTime: (values.appointmentTime).format(
          "DD-MM-YYYY HH:mm:ss"
        ),
        duration: values.duration || 45, // Default to 45 minutes if not provided
      };

      console.log("Final formData:", formData);

      if (editingId) {
        // Add update API call when available
        // await AppointmentService.updateAppointment(editingId, formData);
        message.success("Cập nhật cuộc hẹn thành công");
      } else {
        await AppointmentService.createAppointment(formData);
        message.success("Tạo cuộc hẹn thành công");
      }

      setModalVisible(false);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      message.error("Có lỗi xảy ra khi lưu cuộc hẹn");
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await fetchAppointments();
    message.success("Dữ liệu đã được làm mới");
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).format("dddd, DD/MM/YYYY HH:mm");
  };

  return (
    <div className="p-6">
      {/* Statistics Cards - Only show in List view */}
      {viewMode === "list" && (
        <AppointmentStats
          statistics={statistics}
          activeFilter={activeFilter}
          onFilterChange={filterAppointments}
        />
      )}      {/* Header with controls */}
      <AppointmentHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        showDateFilter={showDateFilter}
        toggleDateFilter={toggleDateFilter}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        onCreateNew={handleCreate}
        onRefresh={handleRefresh}
      />

      {/* Date Range Filter */}
      {viewMode === "calendar" && showDateFilter && (
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={clearDateRange}
        />
      )}

      {/* Calendar Legend */}
      {viewMode === "calendar" && <CalendarLegend />}      {/* Main Content Area */}
      {viewMode === "calendar" ? (
        <CalendarView
          calendarEvents={calendarEvents}
          calendarView={calendarView}
          loading={loading}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
        />
      ) : (
        <TableView
          filteredAppointments={filteredAppointments}
          loading={loading}
          onViewDetail={handleViewDetail}
        />
      )}

      {/* Modals */}
      <AppointmentFormModal
        visible={modalVisible}
        editingId={editingId}
        form={form}
        loading={loading}
        parent={parent}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onSubmit={handleSubmit}
      />

      <AppointmentDetailModal
        visible={detailModalVisible}
        selectedAppointment={selectedAppointment}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedAppointment(null);
        }}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};

export default Appointment;
