import React, { useState, useEffect, useContext } from 'react'
import clsx from "clsx";
import { styled, useTheme } from "@material-ui/core/styles";
import { Button, Divider, Box, List, IconButton, Typography, ListItemText, Toolbar, Grid, Card, Paper, Hidden, CardActionArea, CardActions, CardContent, CardMedia, TextField, Menu, MenuItem, CssBaseline } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { ExitToAppOutlined } from "@material-ui/icons";
import temple from '../asset/temple.png'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MoreIcon from '@material-ui/icons/MoreVert';
import Snackbar from '../components/snackbar';
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
function Layout(props) {
    const history = useHistory();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const user_firstname = localStorage.getItem("user_firstname")
    const user_lastname = localStorage.getItem("user_lastname")
    const user_role_name = localStorage.getItem("user_role_name")

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const Logout = () => {
        localStorage.clear();
        setOpenSnackbar({ status: true, type: "success", msg: "ออกจากระบบสำเร็จ" });
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

                {user_role_name == "user" &&
                    <Button size="large" disabled>
                        {`สวัสดี ${user_firstname} ${user_lastname}`}
                    </Button>
                }
                <MenuItem onClick={() => { { history.push('/home') } }}>
                    <p>หน้าหลัก</p>
                </MenuItem>
                <MenuItem onClick={() => { { history.push('/event') } }}>
                    <p>กิจกรรมทั้งหมด</p>
                </MenuItem>
                <MenuItem onClick={() => { { history.push('/review') } }}>
                    <p>รีวิวทั้งหมด</p>
                </MenuItem>
                {user_role_name == "user" ?
                    <>
                        <MenuItem onClick={() => { { Logout() } }}>
                            <ExitToAppOutlined style={{ marginRight: '5px' }} />
                            <p>ออกจากระบบ</p>
                        </MenuItem>
                    </>
                    :
                    <MenuItem onClick={() => { { history.push('/login') } }}>
                        <p>เข้าสู่ระบบ</p>
                    </MenuItem>
                }
            </Menu >
        </>
    );

    return (
        <>
            <CssBaseline />
            <AppBar position="fixed" color="primary" open={open}>
                <Toolbar>
                    <Box
                        component="img"
                        sx={{ width: { xs: "10%", sm: "6%", md: "3%" } }}
                        alt="logo"
                        src={temple}
                    />
                    <Typography style={{ padding: "1%", color: "white", fontWeight: "bold" }}>Temple tourism system In Esan</Typography>
                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <Button
                            size="large"
                            style={{ color: "#FFFFFF", }}
                            onClick={() => {
                                {
                                    history.push('/home')
                                }
                            }}
                        >
                            หน้าหลัก
                        </Button>
                        <Button
                            size="large"
                            style={{ color: "#FFFFFF", }}
                            onClick={() => {
                                {
                                    history.push('/event')
                                }
                            }}
                        >
                            กิจกรรมทั้งหมด
                        </Button>
                        <Button
                            size="large"
                            style={{ color: "#FFFFFF" }}
                            onClick={() => {
                                {
                                    history.push('/review')
                                }
                            }}
                        >
                            รีวิวทั้งหมด
                        </Button>
                        {user_role_name == "user" ?
                            <>
                                <Button size="large" disabled>
                                    {`สวัสดี ${user_firstname} ${user_lastname}`}
                                </Button>
                                <IconButton onClick={() => {
                                    {
                                        Logout()
                                    }
                                }}>
                                    <ExitToAppOutlined />
                                </IconButton>
                            </>
                            :
                            <Button
                                variant="outlined"
                                size="large"
                                style={{ color: "#FFFFFF", borderRadius: "20px", border: "1px solid #FFFF" }}
                                onClick={() => {
                                    {
                                        history.push('/login')
                                    }
                                }}
                            >
                                <LockOpenIcon style={{ margin: 3 }} />
                                เข้าสู่ระบบ
                            </Button>
                        }
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
            </AppBar>

            {renderMobileMenu}

            <Box component="main" sx={{ flexGrow: 1, px: 2, py: 3 }}>
                <DrawerHeader />
                {props.children}
            </Box>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </>
    );
}

export default Layout
