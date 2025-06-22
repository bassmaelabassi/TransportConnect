import { useState, useEffect } from "react"
import { notificationService } from "../services/notificationServices"
import { demandeService } from "../services/demandeService"
import { useNavigate } from "react-router-dom"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data || [])
    } catch (error) {
      setNotifications([])
      console.error("Erreur lors du chargement des notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = async (notification, action) => {
    setActionLoading(prev => ({ ...prev, [notification._id]: true }))
    
    try {
      if (action.action === 'accept' && notification.relatedDemande) {
        await demandeService.accepterDemande(notification.relatedDemande)
        await notificationService.markAllAsRead()
        await loadNotifications()
      } else if (action.action === 'refuse' && notification.relatedDemande) {
        await demandeService.refuserDemande(notification.relatedDemande)
        await notificationService.markAllAsRead()
        await loadNotifications()
      } else if (action.action === 'view' && action.url) {
        navigate(action.url)
      } else if (action.action === 'evaluate' && action.url) {
        navigate(action.url, { state: { scrollToDemande: notification.relatedDemande } });
      }
    } catch (error) {
      console.error("Erreur lors de l'action:", error)
    } finally {
      setActionLoading(prev => ({ ...prev, [notification._id]: false }))
    }
  }

  const filteredNotifications = (notifications || []).filter((notif) => {
    if (filter === "unread") return !notif.isRead
    if (filter === "read") return notif.isRead
    return true
  })

  const groupNotificationsByDate = (notifications) => {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const groups = { today: [], week: [], older: [] }
    notifications.forEach((notif) => {
      const notifDate = new Date(notif.createdAt)
      if (notifDate >= startOfToday) {
        groups.today.push(notif)
      } else if (notifDate >= startOfWeek) {
        groups.week.push(notif)
      } else {
        groups.older.push(notif)
      }
    })
    return groups
  }

  const grouped = groupNotificationsByDate(filteredNotifications)

  const getNotificationIcon = (type) => {
    switch (type) {
      case "demande":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6"
              />
            </svg>
          </div>
        )
      case "acceptation":
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case "refus":
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case "evaluation":
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
            </svg>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0ead2] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#6c584c] flex items-center">Notifications
              {(notifications || []).filter((n) => !n.isRead).length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#dde5b6] text-[#6c584c] animate-pulse border border-[#adc178]">
                  {(notifications || []).filter((n) => !n.isRead).length} non lue{(notifications || []).filter((n) => !n.isRead).length > 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p className="text-[#a98467]">Restez informé de toutes vos activités</p>
          </div>

        </div>
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setFilter("all")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Toutes ({(notifications || []).length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "unread"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Non lues ({(notifications || []).filter((n) => !n.isRead).length})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  filter === "read"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Lues ({(notifications || []).filter((n) => n.isRead).length})
              </button>
            </nav>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([group, notifs]) =>
            notifs.length > 0 && (
              <div key={group}>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {group === 'today' ? "Aujourd'hui" : group === 'week' ? 'Cette semaine' : 'Plus ancien'}
                </h2>
                {notifs.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white rounded-lg shadow-md p-6 mb-2 transition-all duration-300 ${!notification.isRead ? "border-l-4 border-blue-500 animate-pulse" : ""}`}
                  >
                    <div className="flex items-start space-x-4">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                        
                        {(notification.type === 'demande' || notification.type === 'evaluation') && notification.actions && notification.actions.length > 0 && (
                          <div className="flex space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleActionClick(notification, action)}
                                disabled={actionLoading[notification._id]}
                                className={`text-xs px-3 py-1 rounded-md font-medium ${
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
                ))}
              </div>
            )
          )}
          {filteredNotifications.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification à afficher</h3>
              <p className="text-gray-500">
                {filter === "unread" ? "Vous avez lu toutes vos notifications." : "Vos notifications apparaîtront ici."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
