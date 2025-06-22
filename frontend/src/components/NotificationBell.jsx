import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notificationService } from "../services/notificationServices";
import { demandeService } from "../services/demandeService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const bellRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    }
  };

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      try {
        await notificationService.markAllAsRead();
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({...n, isRead: true})));
      } catch (error) {
        console.error("Erreur lors du marquage des notifications:", error)
      }
    }
  }

  const handleNotificationClick = (notification) => {
    setShowDropdown(false);
    if (notification.link) {
      navigate(notification.link);
    }
  }

  const handleActionClick = async (notification, action) => {
    setActionLoading(prev => ({ ...prev, [notification._id]: true }));
    
    try {
      if (action.action === 'accept' && notification.relatedDemande) {
        await demandeService.accepterDemande(notification.relatedDemande);
        await notificationService.markAllAsRead();
        await loadNotifications();
      } else if (action.action === 'refuse' && notification.relatedDemande) {
        await demandeService.refuserDemande(notification.relatedDemande);
        await notificationService.markAllAsRead();
        await loadNotifications();
      } else if (action.action === 'view' && action.url) {
        navigate(action.url);
        setShowDropdown(false);
      } else if (action.action === 'evaluate' && action.url) {
        navigate(action.url, { state: { scrollToDemande: notification.relatedDemande } });
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [notification._id]: false }));
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "demande":
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6" />
            </svg>
          </div>
        );
      case "acceptation":
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "refus":
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "evaluation":
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-[#6c584c] hover:text-[#a98467] focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg py-1 z-50 border border-[#dde5b6]">
          <div className="px-4 py-2 border-b flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#6c584c]">Notifications</h3>
            <Link to="/notifications" className="text-xs text-[#adc178] hover:underline" onClick={() => setShowDropdown(false)}>Tout voir</Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-sm text-gray-500 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="mt-2">Vous n'avez aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 hover:bg-[#f0ead2] border-b border-[#dde5b6] ${
                    !notification.isRead ? "bg-[#dde5b6]/50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-bold text-[#6c584c]' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      
                      {(notification.type === 'demande' || notification.type === 'evaluation') && notification.actions && notification.actions.length > 0 && (
                        <div className="flex space-x-2 mt-2">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(notification, action);
                              }}
                              disabled={actionLoading[notification._id]}
                              className={`text-xs px-2 py-1 rounded ${
                                action.action === 'accept'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : action.action === 'refuse'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : action.action === 'evaluate'
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {actionLoading[notification._id] ? (
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                action.label
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
