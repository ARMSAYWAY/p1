import React, { useState, useEffect, useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import axios from "axios";
import Snackbar from './snackbar';
import { hostname } from "../hostname";
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


function LoginCompo() {
    const history = useHistory()
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [notInputUsername, setNotInputUsername] = useState("")
    const [errorNotInputUsername, setErrorNotInputUsername] = useState(false)

    const [notInputPassword, setNotInputPassword] = useState("")
    const [errorNotInputPassword, setErrorNotInputPassword] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });

    const handleLoginSubmit = async e => {
        e.preventDefault();

        validate()
        if (username !== "" && password !== "") {
            if (errorNotInputUsername !== true && errorNotInputPassword !== true) {
                LoginAPI()
            }
        }
    };

    const validate = () => {
        if (username == "") {
            setNotInputUsername("กรุณากรอกชื่อผู้ใช้")
            setErrorNotInputUsername(true)
        }
        if (password == "") {
            setNotInputPassword("กรุณากรอกรหัสผ่าน")
            setErrorNotInputPassword(true)
        }
    }

    const LoginAPI = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/login`,
            data: { username: username, password: password },
        });

        let resStatusData = res.data.status

        let resData = res.data
        localStorage.setItem('user_id', resData.user_id)
        localStorage.setItem('user_role_name', resData.user_role_name)
        localStorage.setItem('user_firstname', resData.user_firstname)
        localStorage.setItem('user_lastname', resData.user_lastname)

        if (resData.temple_id !== null) {
            localStorage.setItem('temple_id', resData.temple_id)
        }

        if (resStatusData == "invalid_user_password") {
            resetInputField()
            setOpenSnackbar({ status: true, type: "error", msg: resStatusData });
        } else {
            if (resData.user_role_name == "temple_admin") {
                history.push('/templeAdmin/manageTemple')
            } else if (resData.user_role_name == "super_admin") {
                history.push('/superAdmin/manageTemple')
            } else if (resData.user_role_name == "user") {
                history.push('/home')
            }
        }
    }

    const resetInputField = () => {
        setUsername("");
        setPassword("");

        setNotInputUsername("")
        setNotInputPassword("")
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        เข้าสู่ระบบ
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleLoginSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            error={errorNotInputUsername}
                            helperText={notInputUsername}
                            fullWidth
                            label="ชื่อผู้ใช้"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setErrorNotInputUsername(false)
                                setNotInputUsername("")
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            error={errorNotInputPassword}
                            helperText={notInputPassword}
                            value={password}
                            label="รหัสผ่าน"
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrorNotInputPassword(false)
                                setNotInputPassword("")
                            }}
                            type="password"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            type="submit"
                        >
                            เข้าสู่ระบบ
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link variant="body2"
                                    component="button"
                                    onClick={() => history.push('/register')}>
                                    {"สมัครสมาชิก"}
                                </Link>
                            </Grid>
                            <Grid item>

                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>

                </Box>
            </Container>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </>
    )
}

export default LoginCompo
