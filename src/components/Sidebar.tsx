import React from "react";
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, Toolbar, useMediaQuery, useTheme, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { BadgePlus, Library, ChevronLeft, Logs, BadgeInfo } from "lucide-react";

const DRAWER_WIDTH = 240;

export default function Sidebar() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(isDesktop);

  React.useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);

  const toggle = () => setOpen((o) => !o);

  return (
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      open={open}
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: open ? DRAWER_WIDTH : theme.spacing(7),
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : theme.spacing(7),
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: "#f8f2dc",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          px: 1,
        }}
      >
        {open && (
          <Typography
            variant="h5"
            noWrap
            sx={{
              fontWeight: "bold",
              ml: 1,
            }}
          >
            <span className="font-poppins text-xl">Upliance.ai</span>
          </Typography>
        )}
        <IconButton onClick={toggle}>
          {open ? <ChevronLeft /> : <Logs />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton component={Link} to="/create">
          <ListItemIcon>
            <BadgePlus />
          </ListItemIcon>
          {open && <span className="font-poppins text-lg">Create</span>}
        </ListItemButton>
        <ListItemButton component={Link} to="/my-forms">
          <ListItemIcon>
            <Library />
          </ListItemIcon>
          {open && <span className="font-poppins text-lg">My Forms</span>}
        </ListItemButton>
      </List>
      <p className="flex font-consolas text-xs text-slate-600 absolute bottom-5 left-4 mr-5">
        {open ? (
          <span>Made by Ashu | © 2025 All Rights Reserved.</span>
        ) : (
          <BadgeInfo />
        )}
      </p>
    </Drawer>
  );
}
