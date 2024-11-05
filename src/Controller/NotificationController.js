const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Tạo thông báo mới
const createNotification = async (req, res) => {
    const { customer_id, notification_message, notification_type } = req.body;

    try {
        // Kiểm tra xem khách hàng có tồn tại hay không
        const checkUser = await User.findById(customer_id);
        if (checkUser) {
            await Notification.createNotification(customer_id, notification_message, notification_type);
            return res.status(201).json({ message: 'Notification created successfully' });
        } else {
            return res.status(404).json({ message: 'Account does not exist' });
        }
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: 'Error creating notification' });
    }
};

// Lấy tất cả thông báo của khách hàng
const getNotificationsByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    try {
        const notifications = await Notification.findByCustomerId(customer_id);
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications' });
        }
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error while retrieving notification:', error);
        return res.status(500).json({ message: 'Error while retrieving notification' });
    }
};

// Cập nhật trạng thái của thông báo
const updateNotificationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notice does not exist' });
        }
        await Notification.updateStatus(id, status);
        return res.status(200).json({ message: 'Notification status has been updated' });
    } catch (error) {
        console.error('Error while updating notification status:', error);
        return res.status(500).json({ message: 'Error while updating notification status' });
    }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notice does not exist' });
        }
        await Notification.deleteNotification(id);
        return res.status(200).json({ message: 'The message has been deleted' });
    } catch (error) {
        console.error('Error while deleting notification:', error);
        return res.status(500).json({ message: 'Error while deleting notification' });
    }
};

module.exports = {
    createNotification,
    getNotificationsByCustomerId,
    updateNotificationStatus,
    deleteNotification
};
