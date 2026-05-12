import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { toast } from 'react-hot-toast';

export const useSocket = () => {
  const socket = useRef(null);
  const { user, isLoggedIn } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isLoggedIn && user) {
      socket.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

      socket.current.emit('join', user.id);

      socket.current.on('notification:new', (notification) => {
        addNotification(notification);
        toast(notification.title, { icon: '🔔' });
      });

      socket.current.on('message:new', (data) => {
        toast(`New message from ${data.from}`, { icon: '💬' });
        // This could also update a messageStore
      });

      return () => {
        if (socket.current) socket.current.disconnect();
      };
    }
  }, [isLoggedIn, user, addNotification]);

  return socket.current;
};
