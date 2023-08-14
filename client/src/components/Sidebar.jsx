import React, { useEffect, useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import {
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutline,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.jpeg";
import { useGetAllTicketsQuery } from "state/api";

const Sidebar = ({
  user,
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetAllTicketsQuery({
    role: user.role,
    status: "pending",
  });

  const handleClick = (text) => {
    if (text.toLowerCase() === "admin") {
      setOpen(!open);
    } else {
      setActive(text.toLowerCase());
    }
  };

  const style = {};

  const navItems =
    user.role === "owner" || user.role === "superadmin"
      ? [
          {
            text: "Dashboard",
            icon: <HomeOutlined />,
            subList: [],
          },
          {
            text: "Client Facing",
            icon: null,
            subList: [],
          },
          {
            text: "Products",
            icon: <ShoppingCartOutlined />,
            subList: [],
          },
          {
            text: "Customers",
            icon: <Groups2Outlined />,
            subList: [],
          },
          {
            text: "Transactions",
            icon: <ReceiptLongOutlined />,
            subList: [],
          },
          {
            text: "Geography",
            icon: <PublicOutlined />,
            subList: [],
          },
          {
            text: "Sales",
            icon: null,
            subList: [],
          },
          {
            text: "Overview",
            icon: <PointOfSaleOutlined />,
            subList: [],
          },
          {
            text: "Daily",
            subList: [],
            icon: <TodayOutlined />,
          },
          {
            text: "Monthly",
            subList: [],
            icon: <CalendarMonthOutlined />,
          },
          {
            text: "Breakdown",
            subList: [],
            icon: <PieChartOutline />,
          },
          {
            text: "Management",
            subList: [],
            icon: null,
          },
          {
            text: "Admin",
            icon: <AdminPanelSettingsOutlined />,
            subList: [
              {
                text: "Overview",
                path: "admin/overview",
                icon: <ViewKanbanOutlinedIcon />,
              },
              {
                text: "Tickets",
                path: "admin/tickets",
                icon:
                  data === undefined || data.length === 0 ? (
                    <DraftsOutlinedIcon />
                  ) : (
                    <Badge badgeContent={data.length} color="primary">
                      <EmailOutlinedIcon
                        sx={{
                          color:
                            active === "admin/tickets"
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                        color="action"
                      />
                    </Badge>
                  ),
              },
              {
                text: "Inactive admins",
                path: "admin/inactive",
                icon: <NoAccountsIcon />,
              },
            ],
          },
          {
            text: "Performance",
            subList: [],
            icon: <TrendingUpOutlined />,
          },
        ]
      : [
          {
            text: "Dashboard",
            icon: <HomeOutlined />,
          },
          {
            text: "Client Facing",
            icon: null,
          },
          {
            text: "Products",
            icon: <ShoppingCartOutlined />,
          },
          {
            text: "Customers",
            icon: <Groups2Outlined />,
          },
          {
            text: "Transactions",
            icon: <ReceiptLongOutlined />,
          },
          {
            text: "Geography",
            icon: <PublicOutlined />,
          },
          {
            text: "Sales",
            icon: null,
          },
          {
            text: "Overview",
            icon: <PointOfSaleOutlined />,
          },
          {
            text: "Daily",
            icon: <TodayOutlined />,
          },
          {
            text: "Monthly",
            icon: <CalendarMonthOutlined />,
          },
          {
            text: "Breakdown",
            icon: <PieChartOutline />,
          },
          {
            text: "Management",
            icon: null,
          },
          {
            text: "Admin",
            icon: <AdminPanelSettingsOutlined />,
            subList: [
              {
                text: "Overview",
                path: "admin/overview",
                icon: <ViewKanbanOutlinedIcon />,
              },
              {
                text: "Tickets",
                path: "admin/tickets",
                icon:
                  data === undefined || data.length === 0 ? (
                    <DraftsOutlinedIcon />
                  ) : (
                    <Badge badgeContent={data.length} color="primary">
                      <EmailOutlinedIcon
                        sx={{
                          color:
                            active === "admin/tickets"
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                        color="action"
                      />
                    </Badge>
                  ),
              },
              {
                text: "Inactive admins",
                path: "admin/inactive",
                icon: <NoAccountsIcon />,
              },
            ],
          },
          {
            text: "Performance",
            icon: <TrendingUpOutlined />,
          },
        ];

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box
            width="100%"
            height="90%"
            sx={{
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.5rem",
              },
              "&::-webkit-scrollbar-track": {
                background:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.secondary[300],

                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#888" : "#F3E5AB",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "white"
                    : theme.palette.secondary[100],
              },
            }}
          >
            {/* Title */}
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap=".5rem">
                  <Typography variant="h4" fontWeight="bold">
                    ECOMVISON
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* Elements */}
            <List>
              {navItems.map(({ text, icon, subList }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLocaleLowerCase();
                if (lcText !== "admin") {
                  return (
                    <ListItem key={text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(`/${lcText}`);
                          setActive(lcText);
                        }}
                        sx={{
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {active === lcText && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                } else {
                  return (
                    <React.Fragment key={text}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            handleClick(text);
                            navigate(subList[0].path);
                            setActive(subList[0].path);
                          }}
                          // sx={{
                          //   backgroundColor:
                          //     active === subList[0].path
                          //       ? theme.palette.secondary[300]
                          //       : "transparent",
                          //   color:
                          //     active === subList[0].path
                          //       ? theme.palette.primary[600]
                          //       : theme.palette.secondary[100],
                          // }}
                        >
                          <ListItemIcon
                            sx={{
                              ml: "2rem",
                              color:
                                active === lcText
                                  ? theme.palette.primary[600]
                                  : theme.palette.secondary[200],
                            }}
                          >
                            {icon}
                          </ListItemIcon>
                          <ListItemText primary={text} />
                          {open ? (
                            <ExpandLess sx={{ ml: "auto" }} />
                          ) : (
                            <ExpandMore sx={{ ml: "auto" }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subList.map((subItem) => (
                            <ListItem
                              key={subItem.text}
                              disablePadding
                              sx={{ pl: "1rem" }}
                            >
                              <ListItemButton
                                onClick={() => {
                                  navigate(subItem.path);
                                  setActive(subItem.path);
                                }}
                                sx={{
                                  backgroundColor:
                                    active === subItem.path
                                      ? theme.palette.secondary[300]
                                      : "transparent",
                                  color:
                                    active === subItem.path
                                      ? theme.palette.primary[600]
                                      : theme.palette.secondary[100],
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    ml: "2rem",
                                    color:
                                      active === subItem.path
                                        ? theme.palette.primary[600]
                                        : theme.palette.secondary[200],
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText primary={subItem.text} />
                                {active === subItem.path && (
                                  <ChevronRightOutlined sx={{ ml: "auto" }} />
                                )}
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
                }
              })}
            </List>
          </Box>

          <Box position="absolute" bottom="2rem">
            <Divider sx={{ width: drawerWidth }} />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>

                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
