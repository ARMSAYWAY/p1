import React, { useState, useEffect } from 'react'
import makeStyles from '@mui/styles/makeStyles';
import { Button, Grid, TextField, MenuItem, IconButton, Typography, Box } from '@mui/material/'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import axios from "axios";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { hostname } from "../../hostname";
import { useHistory } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MUIDataTable from "mui-datatables";
import Snackbar from '../snackbar';


const useStyles = makeStyles((theme) => ({
    colorActiveAdd: {
        backgroundColor: "#6495ED", color: "white"
    },
    colorActive: {
        backgroundColor: "#6fbf73", color: "#FFFFFF"
    }
}));

function ManageTempleType() {
    const classes = useStyles();
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const history = useHistory()
    const [openAddTempleTypeDialog, setOpenAddTempleTypeDialog] = useState(false);
    const [openEditTempleTypeDialog, setOpenEditTempleTypeDialog] = useState(false);

    const [templeTypeName, setTempleTypeName] = useState("");

    const [editTempleTypeId, setEditTempleTypeId] = useState("");
    const [editTempleTypeName, setEditTempleTypeName] = useState("");

    const [allTempleTypeData, setAllTempleTypeData] = useState([])
    const [templeTypeData, setTempleTypeData] = useState([])

    const [deleteTempleTypeDialog, setDeleteTempleTypeDialog] = useState(false)
    const [deleteTempleTypeData, setDeleteTempleTypeData] = useState("")


    const handleOpenAddTempleTypeDialog = () => {
        setOpenAddTempleTypeDialog(true);
    };

    const handleCloseAddTempleTypeDialog = () => {
        setTempleTypeName("");
        setOpenAddTempleTypeDialog(false);
    };

    const handleOpenEditTempleTypeDialog = async (temple_type_id) => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getTempleTypeByTempleTypeId`,
            data: { temple_type_id: temple_type_id },
        });

        const resData = res.data
        setEditTempleTypeId(resData[0].temple_type_id);
        setEditTempleTypeName(resData[0].temple_type_name);
        setOpenEditTempleTypeDialog(true);
    };

    const handleCloseEditTempleTypeDialog = () => {
        resetInputField()
        setOpenEditTempleTypeDialog(false);
    };


    const getAllTempleTypeData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/getAllTempleType`,
            data: {},
        });
        setAllTempleTypeData(res.data)
    }

    const addTempleType = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/temple/addTempleType`,
            data: {
                temple_type_name: templeTypeName,
            },
        });

        let resStatusData = res.data.status
        if (resStatusData == "added") {
            resetInputField()
            setOpenSnackbar({ status: true, type: "error", msg: resStatusData });
        } else if (resStatusData == "add_success") {
            resetInputField()
            setOpenAddTempleTypeDialog(false)
            setOpenSnackbar({ status: true, type: "success", msg: "เพิ่มประเภทวัดสำเร็จ" });
        }
        getAllTempleTypeData()
    }

    const editTempleType = async () => {
        let res = await axios({
            method: "put",
            url: `${hostname}/temple/updateTempleTypeByTempleTypeId`,
            data: {
                temple_type_id: editTempleTypeId,
                temple_type_name: editTempleTypeName,
            },
        });

        let resStatusData = res.data.status
        if (resStatusData == "update_success") {
            resetInputField()
            setOpenEditTempleTypeDialog(false)
            setOpenSnackbar({ status: true, type: "success", msg: "แก้ไขประเภทวัดสำเร็จ" });
        }

        getAllTempleTypeData()
    }

    const handleDeleteTempleType = async (rowData) => {
        setDeleteTempleTypeDialog(true);
        setDeleteTempleTypeData(rowData)
    }


    const deleteTempleType = async (temple_type_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/temple/deleteTempleTypeByTempleTypeId`,
            data: { temple_type_id: temple_type_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "ลบประเภทวัดสำเร็จ" });
        setDeleteTempleTypeDialog(false);
        getAllTempleTypeData()
    }

    const resetInputField = () => {
        setTempleTypeName("");
        setEditTempleTypeName("");
        setEditTempleTypeId("")
    };

    useEffect(() => {
        getAllTempleTypeData()
    }, [])

    return <>
        <LayoutSuperAdmin>
            <Grid container justifyContent="flex-start">
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    sx={{ ml: { md: "20px" }, mt: { md: "20px" }, mb: { xs: "20px", md: "10px" } }}
                    onClick={handleOpenAddTempleTypeDialog}>
                    <PlaylistAddIcon fontSize="small" style={{ marginRight: "5px" }}></PlaylistAddIcon>
                    เพิ่มประเภทวัด
                </Button>
            </Grid>

            <Box justify="center" sx={{ p: { md: '20px' } }} >
                <MUIDataTable
                    title={"ตารางจัดการประเภทวัด"}
                    data={allTempleTypeData}
                    options={{
                        viewColumns: false,
                        filter: false,
                        print: false,
                        download: false,
                        selectableRows: false,
                        textLabels: {
                            body: {
                                noMatch: "ไม่พบข้อมูล",
                            },
                        },
                    }}
                    columns={[
                        {
                            name: "temple_type_id",
                            label: "ลำดับ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    return (<div>{dataIndex + 1}</div>)
                                }
                            },
                        },
                        {
                            name: "temple_type_name",
                            label: "ชื่อประเภทวัด",
                        },
                        {
                            name: "temple_type_create_time",
                            label: "วันที่สร้าง",
                        },
                        {
                            name: "",
                            label: "จัดการ",
                            options: {
                                customBodyRenderLite: (dataIndex) => {
                                    let rowData = allTempleTypeData[dataIndex];
                                    return <>
                                        <IconButton
                                            onClick={() => {
                                                handleOpenEditTempleTypeDialog(rowData.temple_type_id)
                                            }}
                                            size="large">
                                            <Edit fontSize="medium" style={{ color: "#ffa000ff" }} />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => {
                                                handleDeleteTempleType(rowData)
                                            }}
                                            size="large">
                                            <Delete fontSize="medium" style={{ color: "#f50057" }} />
                                        </IconButton>
                                    </>;
                                }
                            }
                        },
                    ]}
                />
            </Box>

            <Dialog
                open={openAddTempleTypeDialog}
                onClose={handleCloseAddTempleTypeDialog}
                fullWidth
            >
                <DialogTitle >{"เพิ่มข้อมูลประเภทวัด"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container style={{ marginTop: "2%" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        label="ชื่อประเภทวัด"
                                        variant="outlined"
                                        required
                                        value={templeTypeName}
                                        onChange={(e) => {
                                            setTempleTypeName(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                    <Button onClick={handleCloseAddTempleTypeDialog} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    <Button
                        color="save"
                        onClick={addTempleType}
                        variant="contained"
                        disabled={templeTypeName == "" ? true : false}
                    >
                        เพิ่มประเภทวัด
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditTempleTypeDialog}
                onClose={handleCloseEditTempleTypeDialog}
                fullWidth
            >
                <DialogTitle >{"แก้ไขข้อมูลประเภทวัด"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container style={{ marginTop: "2%" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        label="ชื่อประเภทวัด"
                                        variant="outlined"
                                        required
                                        value={editTempleTypeName}
                                        onChange={(e) => {
                                            setEditTempleTypeName(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ marginRight: "15px", marginBottom: "15px" }}>
                    <Button onClick={handleCloseEditTempleTypeDialog} style={{ color: "#636363" }}>
                        ยกเลิก
                    </Button>
                    <Button
                        color="save"
                        onClick={editTempleType}
                        variant="contained"
                        disabled={editTempleTypeName == "" ? true : false}
                    >

                        บันทึก
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteTempleTypeDialog}
                onClose={() => { setDeleteTempleTypeDialog(false) }}
                maxWidth='xl'
            >
                <DialogTitle >ลบประเภทวัด</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบประเภทวัดนี้ ?</Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ margin: "8px" }} onClick={() => { setDeleteTempleTypeDialog(false) }} variant="outlined">
                        ปิด
                    </Button>
                    <Button
                        style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                        onClick={() => {
                            deleteTempleType(deleteTempleTypeData.temple_type_id)
                        }}
                        variant="contained">
                        ตกลง
                    </Button>

                </DialogActions>
            </Dialog>

            <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

        </LayoutSuperAdmin>
    </>;
}

export default ManageTempleType
