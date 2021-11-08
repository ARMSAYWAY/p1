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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { hostname } from "../hostname";
import FormHelperText from '@mui/material/FormHelperText';
import axios from "axios";
import { useHistory } from 'react-router-dom'
import Snackbar from './snackbar';

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function RegisterCompo() {
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const history = useHistory()
    const classes = useStyles();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordNotMatch, setPasswordNotMatch] = useState("");
    const [errorPasswordNotMatch, setErrorPasswordNotMatch] = useState(false);

    const [notSelectRole, setNotSelectRole] = useState("")
    const [errorNotSelectRole, setErrorNotSelectRole] = useState(false)

    const [notInputUsername, setNotInputUsername] = useState("")
    const [errorNotInputUsername, setErrorNotInputUsername] = useState(false)

    const [notInputPassword, setNotInputPassword] = useState("")
    const [errorNotInputPassword, setErrorNotInputPassword] = useState(false)

    const [notInputFirstname, setNotInputFirstname] = useState("")
    const [errorNotInputFirstname, setErrorNotInputFirstname] = useState(false)

    const [notInputLastname, setNotInputLastname] = useState("")
    const [errorNotInputLastname, setErrorNotInputLastname] = useState(false)

    const handleSignUpSubmit = async e => {
        e.preventDefault();

        validate()
        if (firstname !== "" && lastname !== "" && username !== "" && password !== "" && confirmPassword !== "" && roleId !== "") {
            if (errorNotInputFirstname !== true && errorNotInputLastname !== true && errorNotInputUsername !== true
                && errorNotInputPassword !== true && errorPasswordNotMatch !== true && errorNotSelectRole !== true) {
                registerAPI()
            }
        }
    };

    const validate = () => {
        if (firstname == "") {
            setNotInputFirstname("กรุณากรอกชื่อ")
            setErrorNotInputFirstname(true)
        }
        if (lastname == "") {
            setNotInputLastname("กรุณากรอกนามสกุล")
            setErrorNotInputLastname(true)
        }
        if (username == "") {
            setNotInputUsername("กรุณากรอกชื่อผู้ใช้")
            setErrorNotInputUsername(true)
        }
        if (password == "") {
            setNotInputPassword("กรุณากรอกรหัสผ่าน")
            setErrorNotInputPassword(true)
        }
        if (password !== confirmPassword) {
            setPasswordNotMatch("รหัสผ่านไม่ตรงกัน")
            setErrorPasswordNotMatch(true)
        }
        if (roleId == "") {
            setNotSelectRole("กรุณาเลือกประเภทผู้ใช้")
            setErrorNotSelectRole(true)
        }
    }

    const registerAPI = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/register`,
            data: {
                username: username,
                password: password,
                user_firstname: firstname,
                user_lastname: lastname,
                user_role_id: roleId,
            },
        });

        let resStatusData = res.data.status

        if (resStatusData == "registered") {
            resetInputField()
            setOpenSnackbar({ status: true, type: "error", msg: resStatusData });
        } else if (resStatusData == "success") {
            history.push('/login')
            setOpenSnackbar({ status: true, type: "error", msg: "สมัครสมาชิกสำเร็จ" });
        }
    }

    const resetInputField = () => {
        setFirstname("");
        setLastname("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setRoleId("");

        setNotInputFirstname("")
        setNotInputLastname("")
        setNotInputUsername("")
        setNotInputPassword("")
        setPasswordNotMatch("")
        setNotSelectRole("")
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
                        สมัครสมาชิก
                    </Typography>
                    <form className={classes.form} autocomplete="off" noValidate onSubmit={handleSignUpSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={firstname}
                                    error={errorNotInputFirstname}
                                    helperText={notInputFirstname}
                                    onChange={(e) => {
                                        setFirstname(e.target.value)
                                        setErrorNotInputFirstname(false)
                                        setNotInputFirstname("")
                                    }}
                                    label="ชื่อ"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    value={lastname}
                                    error={errorNotInputLastname}
                                    helperText={notInputLastname}
                                    onChange={(e) => {
                                        setLastname(e.target.value)
                                        setErrorNotInputLastname(false)
                                        setNotInputLastname("")
                                    }}
                                    fullWidth
                                    label="นามสกุล"
                                    name="lastName"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    value={username}
                                    error={errorNotInputUsername}
                                    helperText={notInputUsername}
                                    fullWidth
                                    label="ชื่อผู้ใช้"
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                        setErrorNotInputUsername(false)
                                        setNotInputUsername("")
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={password}
                                    error={errorNotInputPassword}
                                    helperText={notInputPassword}
                                    label="รหัสผ่าน"
                                    type="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrorNotInputPassword(false)
                                        setNotInputPassword("")
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    error={errorPasswordNotMatch}
                                    value={confirmPassword}
                                    label="ยืนยันรหัสผ่าน"
                                    type="password"
                                    helperText={passwordNotMatch}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                        setErrorPasswordNotMatch(false)
                                        setPasswordNotMatch("")
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} style={{ marginLeft: "25%" }}>
                                <RadioGroup
                                    row aria-label="position"
                                    name="position" onChange={(e) => {
                                        setRoleId(e.target.value)
                                        setNotSelectRole("")
                                        setErrorNotSelectRole(false)
                                    }}
                                    defaultValue="top"
                                    value={roleId}
                                    required
                                    error
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio color="primary" />}
                                        label="ผู้ใช้ทั่วไป"
                                        labelPlacement="end"
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio color="primary" />}
                                        label="ผู้ดูแลวัด" />
                                </RadioGroup>
                                <FormHelperText error={errorNotSelectRole}>{notSelectRole}</FormHelperText>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            สมัครสมาชิก
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link variant="body2" component="button" onClick={() => history.push('/login')}>
                                    มีบัญชีอยู่แล้ว ? เข้าสู่ระบบ
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>

                </Box>
            </Container>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />
        </>
    )
}

export default RegisterCompo
