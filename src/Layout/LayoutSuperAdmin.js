import React, { useState, useEffect, useContext } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItemText, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ChatIcon from '@mui/icons-material/Chat';
import { ExitToAppOutlined } from "@mui/icons-material";
import temple from '../asset/temple.png'
import ListIcon from '@mui/icons-material/List';
import MoreIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


function LayoutSuperAdmin(props) {
    const history = useHistory();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };


    const Logout = () => {
        localStorage.clear();
        history.push("/home");
    };

    const renderMobileMenu = (
        <>
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem onClick={() => { { Logout() } }}>
                    <ExitToAppOutlined style={{ marginRight: '5px' }} />
                    <p>ออกจากระบบ</p>
                </MenuItem>

            </Menu >
        </>
    );

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" color="primary" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: '20px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon sx={{ color: "white" }} />
                        </IconButton>

                        <Box
                            component="img"
                            sx={{ width: { xs: "10%", sm: "6%", md: "3%" } }}
                            alt="logo"
                            src={temple}
                        />
                        <div style={{ marginLeft: "15px" }}>
                            <Box item xs={12} sx={{ display: { xs: "none", md: "flex" } }}>
                                <Typography style={{ color: "white", fontWeight: "bold" }}>Temple tourism system In Esan</Typography>
                            </Box>
                            <Box item xs={12} sx={{ display: { xs: "flex", md: "flex" } }}>
                                <Typography style={{ color: "white" }}>หน้าจัดการสำหรับผู้ดูแลระบบสูงสุด</Typography>
                            </Box>
                        </div>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <Button
                                variant="outlined"
                                size="large"
                                style={{ color: "#FFFFFF", borderRadius: "20px", border: "1px solid #FFFF" }}
                                onClick={() => {
                                    {
                                        Logout()
                                    }
                                }}>
                                <ExitToAppOutlined style={{ margin: 4 }} />
                                ออกจากระบบ
                            </Button>
                        </Box>

                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon style={{ color: "#FFFFFF" }} />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar >

                {renderMobileMenu}

                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="./manageTemple">
                            <ListItemIcon><AccountBalanceIcon titleAccess="จัดการข้อมูลวัด" /></ListItemIcon>
                            <ListItemText primary="จัดการข้อมูลวัด" />
                        </ListItem>
                        <ListItem button component={Link} to="./manageTempleType">
                            <ListItemIcon><ListIcon titleAccess="จัดการประเภทวัด" /></ListItemIcon>
                            <ListItemText primary="จัดการประเภทวัด" />
                        </ListItem>
                        <ListItem button component={Link} to="./manageEvent">
                            <ListItemIcon><EventIcon titleAccess="จัดการกิจกรรม" /></ListItemIcon>
                            <ListItemText primary="จัดการกิจกรรม" />
                        </ListItem>
                        <ListItem button component={Link} to="./manageReview">
                            <ListItemIcon><RateReviewIcon titleAccess="จัดการรีวิว" /></ListItemIcon>
                            <ListItemText primary="จัดการรีวิว" />
                        </ListItem>
                        <ListItem button component={Link} to="./manageComment">
                            <ListItemIcon><ChatIcon titleAccess="จัดการคอมเมนต์" /></ListItemIcon>
                            <ListItemText primary="จัดการคอมเมนต์" />
                        </ListItem>
                        <ListItem button component={Link} to="./manageUser">
                            <ListItemIcon><PeopleIcon titleAccess="จัดการผู้ใช้" /></ListItemIcon>
                            <ListItemText primary="จัดการผู้ใช้" />
                        </ListItem>
                    </List>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, px: 2, py: 3 }}>
                    <DrawerHeader />
                    {props.children}
                </Box>
            </Box >
        </>
    );
}

export default LayoutSuperAdmin
