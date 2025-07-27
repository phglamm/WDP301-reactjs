import React from 'react';
import { Card } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = ({ 
  calendarEvents, 
  calendarView, 
  loading, 
  onEventClick, 
  onDateSelect 
}) => {
  return (
    <Card loading={loading}>      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={calendarEvents}
        eventClick={onEventClick}
        select={onDateSelect}
        selectable={true}
        selectMirror={true}     
        dayMaxEvents={true}
        height="calc(100vh - 320px)"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        locale="vi"
        firstDay={1}
        eventContent={(eventInfo) => (
          <div className="flex flex-col items-start pl-1 justify-center ">
            <div className="font-medium text-[10px] truncate">
              {eventInfo.event.title}
            </div>
            <div className="text-[10px] opacity-80">
              {moment(eventInfo.event.start).format('HH:mm')} - {moment(eventInfo.event.end).format('HH:mm')}
            </div>
          </div>
        )}
      />
    </Card>
  );
};

export default CalendarView;