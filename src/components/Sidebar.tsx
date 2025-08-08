import React from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CreateIcon from "@mui/icons-material/Create";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Link } from "react-router-dom";

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
            // className="font-consolas"
          >
            <span className="font-poppins text-xl">Upliance.ai</span>
          </Typography>
        )}
        <IconButton onClick={toggle}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton component={Link} to="/create">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Create" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/preview">
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Preview" />}
        </ListItemButton>
        <ListItemButton component={Link} to="/my-forms">
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          {open && <ListItemText primary="My Forms" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
}
