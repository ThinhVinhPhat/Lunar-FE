import { NotificationTemplate } from "@/shared/types/notification";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useNavigate } from "react-router-dom";
import useNotificationMessageAction from "@/pages/admin/notification/hooks/useNotificationMessageAction";
import React, { useState } from "react";
import { formatTime } from "@/lib/ultis/formatDate";

import {
  Box,
  IconButton,
  Badge,
  Menu,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function NotificationBell({ isOpen, setIsOpen }: Props) {
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">(
    "messages"
  );
  const navigate = useNavigate();
  const {
    notifications,
    totalUnreadCount,
    groupedNotifications,
    isLoadingNotification,
    isLoading,
    dropdownRef,
    toggleDropdown,
    isRead,
    handleUpdateNotificationStatus
  } = useNotificationMessageAction(setIsOpen, isOpen);

  const handleTabChange = (newValue: "messages" | "notifications") => {
    setActiveTab(newValue);
  };

  return (
    <IsLoadingWrapper isLoading={isLoading || isLoadingNotification}>
      <Box sx={{ position: "relative" }} ref={dropdownRef}>
        <IconButton
          color="inherit"
          onClick={toggleDropdown}
          sx={{ p: 1, borderRadius: "50%", "&:hover": { bgcolor: "#f0f0f0" } }}
        >
          <Badge badgeContent={totalUnreadCount} color="error">
            <NotificationsIcon sx={{ color: "#606060" }} />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={dropdownRef.current}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              mt: 2,
              width: 360,
              maxHeight: 400,
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: 3,
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => handleTabChange(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Messages" value="messages" />
            <Tab label="Notifications" value="notifications" />
          </Tabs>

          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {activeTab === "messages" ? (
              groupedNotifications.length === 0 ? (
                <Typography sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                  No messages yet
                </Typography>
              ) : (
                <List disablePadding>
                  {groupedNotifications.map((notification) => (
                    <React.Fragment key={notification.senderId}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            navigate(`/admin/message/${notification.senderId}`);
                            setIsOpen(false);
                          }}
                          sx={{
                            borderLeft: notification.unreadCount > 0 ? "4px solid #C8A846" : "none",
                            bgcolor: notification.unreadCount > 0 ? "#e3f2fd" : "inherit",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                        <Avatar sx={{ bgcolor: "#C8A846", mr: 2 }}>
                          {notification.senderName
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </Avatar>
                        <ListItemText
                          primary={notification.senderName}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: "block" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                noWrap
                              >
                                {notification.latestMessage}
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTime(notification.latestTime)}
                                </Typography>
                                <Badge color="primary" sx={{ bgcolor: "#C8A846", color: "white", px: 1, borderRadius: 1 }}>
                                  Message
                                </Badge>
                              </Box>
                            </>
                          }
                        />
                        </ListItemButton>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )
            ) : notifications.length === 0 ? (
              <Typography sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                No notifications yet
              </Typography>
            ) : (
              <List disablePadding>
                {notifications?.map((notif: NotificationTemplate) => {
                  return (
                    <React.Fragment key={notif?.id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleUpdateNotificationStatus(notif?.id)}
                          sx={{
                            borderLeft: !isRead(notif?.id) ? "4px solid #C8A846" : "none",
                            bgcolor: !isRead(notif?.id) ? "#fffde7" : "inherit",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                        <Avatar src={notif?.image?.[0]} alt="icon" sx={{ mr: 2 }} />
                        <ListItemText
                          primary={notif?.title}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: "block" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                noWrap
                              >
                                {notif?.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(notif?.createdAt)}
                              </Typography>
                            </>
                          }
                        />
                        </ListItemButton>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", textAlign: "center" }}>
            <Button
              onClick={() => handleUpdateNotificationStatus("all")}
              sx={{ color: "#C8A846", textTransform: "none" }}
            >
              Mark all as read
            </Button>
          </Box>
        </Menu>
      </Box>
    </IsLoadingWrapper>
  );
}


