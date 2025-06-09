import { Image } from "antd";


const NotificationSection = () => {
    const noti = [
        {
            id: 1,
            title: 'Bạn có 1 thông báo mới',
            userName: 'Thầy Hiệu trưởng',
            content: 'vừa gửi cho bạn một thông báo quan trọng. Hãy kiểm tra ngay!',
            timestamp: '2025-06-06T09:15:00Z',
        },
        {
            id: 2,
            title: 'Báo cáo buổi sáng ',
            userName: 'Hệ thống',
            content: 'vừa cập nhật số liệu buổi sáng. Bạn có thể xem chi tiết trong báo cáo.',
            timestamp: '2025-06-06T09:15:00Z',
        },
        {
            id: 3,
            title: 'Bạn có một tin nhắn mới',
            userName: 'Nguyễn Thị B',
            content: 'đã gửi cho bạn một tin nhắn. Hãy kiểm tra hộp thư của bạn để xem chi tiết.',
            timestamp: '2025-06-06T09:15:00Z',
        },
    ];

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMilliseconds = now.getTime() - notificationTime.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);

        if (diffInMinutes < 1) {
            return 'Vừa xong';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInHours < 24) {
            return `${diffInHours} giờ trước`;
        } else if (diffInDays < 7) {
            return `${diffInDays} ngày trước`;
        } else if (diffInWeeks < 4) {
            return `${diffInWeeks} tuần trước`;
        } else {
            return `${diffInMonths} tháng trước`;
        }
    };

    return (
        <div>
            <div className="flex flex-col w-full overflow-y-auto h-[95vh]">
                {noti.map((notification) => (
                    <div
                        key={notification.id}
                        className="shadow-md px-1 py-2 flex flex-row items-center gap-4"
                    >
                        <Image
                            src={`https://ui-avatars.com/api/?name=${notification.userName}&background=random`}
                            alt="Logo"
                            style={{ objectFit: "cover", width: "140px", height: "45px", borderRadius: "50%" }}
                        />
                        <div>
                            <h3 className="text-[80%] font-semibold line-clamp-1">{notification.title}</h3>
                            <div>
                                <p className="text-sm text-gray-700 line-clamp-2">
                                    <span className="font-bold text-[#FF7345]">{notification.userName}</span> {notification.content}
                                </p>
                            </div>

                            <p className="text-[80%] text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationSection;