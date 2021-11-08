import React, { useState, useEffect } from 'react'
import { Button, Grid, Box, TextField, MenuItem, Chip, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import LayoutSuperAdmin from '../../Layout/LayoutSuperAdmin';
import axios from "axios";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { hostname } from "../../hostname";
import MUIDataTable from "mui-datatables";
import Snackbar from '../snackbar';

function ManageUser() {
    const [allUserData, setAllUserData] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({ status: false, type: "", msg: "" });
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [deleteUserData, setDeleteUserData] = useState("")

    const getAllUserData = async () => {
        let res = await axios({
            method: "post",
            url: `${hostname}/user/getAllUser`,
            data: {},
        });

        setAllUserData(res.data)
    }

    const handleDeleteUser = async (rowData) => {
        setDeleteUserDialog(true);
        setDeleteUserData(rowData)
    }

    const deleteUser = async (user_id) => {
        let res = await axios({
            method: "delete",
            url: `${hostname}/user/deleteUserByUserId`,
            data: { user_id: user_id },
        });
        setOpenSnackbar({ status: true, type: "success", msg: "ลบผู้ใช้สำเร็จ" });
        setDeleteUserDialog(false);
        getAllUserData()
    }

    useEffect(() => {
        getAllUserData()
    }, [])

    return (
        <>
            <LayoutSuperAdmin>

                <Box justify="center" sx={{ p: { md: '20px' } }} >
                    <MUIDataTable
                        title={"ตารางจัดการผู้ใช้"}
                        data={allUserData}
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
                                name: "user_id",
                                label: "ลำดับ",
                                options: {
                                    customBodyRenderLite: (dataIndex) => {
                                        return (<div>{dataIndex + 1}</div>)
                                    }
                                },
                            },
                            {
                                name: "user_create_time",
                                label: "วันที่สร้าง",
                            },
                            {
                                name: "user_firstname",
                                label: "ชื่อ",
                            },
                            {
                                name: "user_lastname",
                                label: "นามสกุล",
                            },
                            {
                                name: "user_role_name",
                                label: "ประเภท",
                                options: {
                                    customBodyRenderLite: (dataIndex) => {
                                        let rowData = allUserData[dataIndex];
                                        return (
                                            rowData.user_role_name == "user" ? "ผู้ใช้ทั่วไป"
                                                : rowData.user_role_name == "temple_admin" ? "ผู้ดูแลระบบวัด" : "-"
                                        );
                                    }
                                }
                            },
                            {
                                name: "",
                                label: "จัดการ",
                                options: {
                                    customBodyRenderLite: (dataIndex) => {
                                        let rowData = allUserData[dataIndex];
                                        return <>
                                            <IconButton
                                                onClick={() => {
                                                    handleDeleteUser(rowData)
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

                <Snackbar values={openSnackbar} setValues={setOpenSnackbar} />

                <Dialog
                    open={deleteUserDialog}
                    onClose={() => { setDeleteUserDialog(false) }}
                    maxWidth='xl'
                >
                    <DialogTitle >ลบผู้ใช้</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            <Typography>คุณแน่ใจหรือไม่ว่าต้องลบผู้ใช้นี้ ?</Typography>

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ margin: "8px" }} onClick={() => { setDeleteUserDialog(false) }} variant="outlined">
                            ปิด
                        </Button>
                        <Button
                            style={{ margin: "8px", backgroundColor: "#D9534F", color: "#FFFFFF" }}
                            onClick={() => {
                                deleteUser(deleteUserData.user_id)
                            }}
                            variant="contained">
                            ตกลง
                        </Button>

                    </DialogActions>
                </Dialog>
            </LayoutSuperAdmin>
        </>
    )
}

export default ManageUser
