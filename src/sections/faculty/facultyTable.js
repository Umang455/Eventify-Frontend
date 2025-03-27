import PropTypes from "prop-types";
import { format } from "date-fns";
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useState } from "react";
import _ from "lodash";
import axios from "axios";
import { deleteCompanySnippet, deleteFacultyAPI, deleteProjects, deleteSystemUser } from "src/config/api";
import { CommunicationSnippetEdit } from "src/components/communicationSnippets/communicationSnippetEdit";
import { toast } from "react-toastify";
import { CommunicationSnippetView } from "src/components/communicationSnippets/communicationSnippetView";
import { ProjectView } from "src/components/projects/projectView";

export const FacultyTable = (props) => {
    const {
        // count = 0,
        items,
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => { },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = [],
        getData,
    } = props;

    const selectedSome = selected.length > 0 && selected.length < items.length;
    const selectedAll = items.length > 0 && selected.length === items.length;

    const [searchTerm, setSearchTerm] = useState("");
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState(null);

    let data = items;

    if (searchTerm !== "") {
        data = _.filter(data, (i) => {
            return i.name && i.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }

    const _deleteData = async (id) => {
        try {
            let res = await axios.delete(deleteFacultyAPI(id))
            getData()
            toast.success("Deleted Successfully")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Card sx={{ p: 2 }}>
                <OutlinedInput
                    defaultValue=""
                    fullWidth
                    placeholder="Search Users"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                                <MagnifyingGlassIcon />
                            </SvgIcon>
                        </InputAdornment>
                    }
                    sx={{ maxWidth: 500 }}
                />
            </Card>
            <Card>
                <Scrollbar>
                    <Box sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Number</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>is Admin</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((d, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{d?.name}</TableCell>
                                        <TableCell>{d?.phone}</TableCell>
                                        <TableCell>{d?.email}</TableCell>
                                        <TableCell>{d?.isAdmin ? "Yes" : "No"}</TableCell>
                                        <TableCell><IconButton onClick={() => _deleteData(d._id)} >
                                            <DeleteIcon />
                                        </IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Scrollbar>
                <TablePagination
                    component="div"
                    count={10}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
            {/* <CommunicationSnippetEdit
        open={openEditModal}
        setOpen={setOpenEditModal}
        item={selectedSnippet}
      /> */}
            <ProjectView open={openViewModal} setOpen={setOpenViewModal} item={selectedSnippet} />
        </>
    );
};

// CompanySnippetsTable.propTypes = {
//     count: PropTypes.number,
//     items: PropTypes.array,
//     onDeselectAll: PropTypes.func,
//     onDeselectOne: PropTypes.func,
//     onPageChange: PropTypes.func,
//     onRowsPerPageChange: PropTypes.func,
//     onSelectAll: PropTypes.func,
//     onSelectOne: PropTypes.func,
//     page: PropTypes.number,
//     rowsPerPage: PropTypes.number,
//     selected: PropTypes.array
// };
