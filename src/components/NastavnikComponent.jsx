import React, { useState, useEffect } from "react";
import { Menu,MenuItem,AppBar,Toolbar,Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, CardActions, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Modal, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate ,Link,useLocation} from "react-router-dom";
import '../css/Nastavnik.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LogoutIcon from '@mui/icons-material/Logout';


const Nastavnik = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editTeacher, setEditTeacher] = useState({ id: '', name: '', prezime: '' });
    const [updateTeacherId, setUpdateTeacherId] = useState(null);
    const [updateTeacherIme, setUpdateTeacherIme] = useState('');
    const [updateTeacherPrezime, setUpdateTeacherPrezime] = useState('');
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isSubjectsVisible, setIsSubjectsVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteTeacherId, setDeleteTeacherId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newTeacherIme, setNewTeacherIme] = useState('');
    const [newTeacherPrezime, setNewTeacherPrezime] = useState('');
    const [editSubject, setEditSubject] = useState({ id: '', imePredmeta: '', nedeljniFondCasova: '' });
    const [openSubjectEditDialog, setOpenSubjectEditDialog] = useState(false); 
    const [openSubjectDeleteDialog, setOpenSubjectDeleteDialog] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);          ;
    const [anchorEl, setAnchorEl] = useState(null);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [isStudentTableVisible,setIsStudentTableVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const [subjectsAnchorEl, setSubjectsAnchorEl] = useState(null);
    const [openAddSubjectDialog, setOpenAddSubjectDialog] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectWeeklyHours, setNewSubjectWeeklyHours] = useState(''); 
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openStudentDeleteDialog, setOpenStudentDeleteDialog] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [isFormValid, setIsFormValid] = useState(true);
    const [subjectError, setSubjectError] = useState(false);
    const [error, setError] = useState(false);
    const [filteredSubjectsID, setFilteredSubjectsID] = useState([]);

    

    const headers = new Headers({
        'Authorization': 'Basic ' + btoa('nastavnik:password123'),
        'Content-Type': 'application/json'
    });
    //vraca tabelu nastavnika
    useEffect(() => {
        fetchTeachers();
    }, []);
    //za filtriranje predmeta  po imenu
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (typeof search === 'string' && search.trim() !== '') {
                setFilteredSubjects(
                    subjects.filter((subject) =>
                        subject.imePredmeta.toLowerCase().includes(search.toLowerCase())
                    )
                );
            } else {
                setFilteredSubjects(subjects); // ako nema pretrage prikazuju se svi predmeti
            }
        }, 200); // 200 ms debounce
    
        return () => clearTimeout(delayDebounceFn); // ciscenje tajmera
    }, [search, subjects]);
    //za filtriranje predmeta po id 
    useEffect(() => {
        if (searchId.trim() !== '') {
            const filtered = subjects.filter((subject) =>
                subject.id.toString() === searchId.trim() // Proverava da li se ID poklapa
            );
            setFilteredSubjectsID(filtered);
        } else {
            setFilteredSubjectsID(subjects); // Vraća sve predmete ako je pretraga prazna
        }
    }, [searchId, subjects]);

    //za filtriranje nastavnika po id
    const filteredTeachers = searchId
    ? teachers.filter(teacher => teacher.id.toString() === searchId)
    : teachers;

    //custom button
    const CustomButton = styled(Button)({
        margin: '8px',
    });
    // css za modal
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const navigate = useNavigate();

    //vracanje svih nastavnika
    const fetchTeachers = async () => {
        try {
            const response = await fetch('http://localhost:8080/nastavnik', { headers });
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };
    //vracanje svih predmeta
    const fetchSubjects = async () => {
        try {
            if (isSubjectsVisible) {
                setIsSubjectsVisible(false); // Ako su predmeti vidljivi, sakrij ih
            } else {
                const response = await fetch('http://localhost:8080/predmet', { headers });
                const data = await response.json();
                setSubjects(data);
                setFilteredSubjects(data);
                setIsSubjectsVisible(true); // Ako su predmeti sakriveni, prikaži ih
            }
        } catch (error) {
            console.log('Error fetching subjects!', error)
        }
    }
    //brisanje predmeta
    const handleDeleteSubject = async () => {
        try {
            const response = await fetch(`http://localhost:8080/predmet/${subjectToDelete.id}`, {
                method: 'DELETE',
                headers,
            });
            if (response.ok) {
                fetchSubjects(); // osvezava listu predmeta
                handleCloseSubjectDeleteDialog(); 
                alert('Subject deleted successfully'); 
            } else {
                console.error('Failed to delete subject');
                alert('Failed to delete subject');
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            alert('Error deleting subject');
        }
    };
    // sacuvavanje promena nad Predmetom
    const handleSaveSubjectChanges = async () => {
        setError(false);
        if (!editSubject.imePredmeta || !editSubject.nedeljniFondCasova) {
            setError(true);
            return; // Prevent update if validation fails
        }
        try {
            const response = await fetch(`http://localhost:8080/predmet/${editSubject.id}?imePredmeta=${encodeURIComponent(editSubject.imePredmeta)}&nfc=${encodeURIComponent(editSubject.nedeljniFondCasova)}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Authorization': 'Basic ' + btoa('nastavnik:password123'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imePredmeta: editSubject.imePredmeta,
                    nedeljniFondCasova: editSubject.nedeljniFondCasova
                })
            });
            if (response.ok) {
                fetchSubjects(); 
                handleCloseSubjectEditDialog(); 
                alert('Subject updated successfully'); 
            } else {
                console.error('Failed to update subject');
                alert('Failed to update subject');
            }
        } catch (error) {
            console.error('Error updating subject:', error);
            alert('Error updating subject');
        }
    };
    // vracanje svih studenata iz base
    const fetchStudents = async () => {
        try{
            const response = await fetch('http://localhost:8080/ucenik',{
                method: 'GET',
                credentials: 'include', //za cookie ili session informacije
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('Fetched students:', data);
            setStudents(data);
        }catch(error){
            console.error("Error fetching students: ", error);
        }
    }

    //dodavanje novog nastavnika
    const handleAddTeacher = async () => {
        setIsFormValid(true);
        if (!newTeacherIme || !newTeacherPrezime) {
            setIsFormValid(false);
            return; 
        }
        try {
            const url = `http://localhost:8080/nastavnik?ime=${encodeURIComponent(newTeacherIme)}&prezime=${encodeURIComponent(newTeacherPrezime)}`;

            const response = await fetch(url, {
                method: 'POST',
                headers,
            });
            
            if (response.ok) {
                fetchTeachers(); 
                setNewTeacherIme(''); 
                setNewTeacherPrezime('');
                setOpenAddDialog(false); 
                alert('Teacher added successfully'); 
            } else {
                console.error('Failed to add teacher');
                alert('Failed to add teacher');
            }
        } catch (error) {
            console.error('Error adding teacher:', error);
            alert('Error adding teacher');
        }
    };
    // izmena podataka nad postojecim nastavnikom
    const handleUpdateTeacher = async () => {
        setError(false);
        if (!updateTeacherIme || !updateTeacherPrezime) {
            setError(true);
            return; 
        }
        try {
            const response = await fetch(`http://localhost:8080/nastavnik/${editTeacher.id}?ime=${updateTeacherIme}&prezime=${updateTeacherPrezime}`, {
                method: 'PUT',
                headers,
            });
            if (response.ok) {
                fetchTeachers(); 
                handleCloseDialog(); 
                setEditTeacher({ id: '', ime: '', prezime: '' });
                setUpdateTeacherIme('');
                setUpdateTeacherPrezime('');
                setOpenSnackbar(true); 
            } else {
                console.error('Failed to update teacher');
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };
    // brisanje nastavnika
    const handleDeleteTeacher = async () => {
        try {
            const response = await fetch(`http://localhost:8080/nastavnik/${deleteTeacherId}`, {
                method: 'DELETE',
                headers,
            });
            if (response.ok) {
                fetchTeachers();
                setOpenDeleteModal(false);
                alert('Teacher deleted successfully');
            } else {
                console.error('Failed to delete teacher');
                alert('Failed to delete teacher');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Error deleting teacher');
        }
    };
    // toggle za prikaz tabele za nastavnike
    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
        if(!isTableVisible){
            fetchTeachers();
        }
    };
    const handleOpenDeleteModal = (id) => {
        setDeleteTeacherId(id);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setDeleteTeacherId(null);
    };
    // dialog za editovanje nastavnika
    const handleOpenEditDialog = (teacher) => {
        setEditTeacher({ id: teacher.id, ime: teacher.ime, prezime: teacher.prezime });
        setUpdateTeacherIme(teacher.ime);
        setUpdateTeacherPrezime(teacher.prezime);
        setOpenDialog(true); // Otvara dijalog
        navigate(`/nastavnik/${teacher.id}`);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setUpdateTeacherId(null);
        setUpdateTeacherIme('');
        setUpdateTeacherPrezime('');
        navigate('/nastavnik');
        
    };

    // Function to open Add Teacher Dialog
    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    // funkcija za zatvaranje Add Teacher Dialog
    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };
    // funkcija za otvaranje Subject Edit Dialog
    const handleOpenSubjectEditDialog = (subject) => {
        
        setEditSubject({
            id: subject.id,
            imePredmeta: subject.imePredmeta,
            nedeljniFondCasova: subject.nedeljniFondCasova,
        });
        navigate(`/nastavnik/predmet/${subject.id}`);
        setOpenSubjectEditDialog(true);

    };
    // funkcija za zatvaranje Subject Edit Dialog
    const handleCloseSubjectEditDialog = () => {
        setOpenSubjectEditDialog(false);
        setEditSubject({ id: '', imePredmeta: '', nedeljniFondCasova: '' });
        navigate("/nastavnik");
    };
    const handleOpenSubjectDeleteDialog = (subject) => {
        setSubjectToDelete(subject);
        setOpenSubjectDeleteDialog(true);
    };
    //funkcija za zatvaranje Delete dialoga
    const handleCloseSubjectDeleteDialog = () => {
        setOpenSubjectDeleteDialog(false);
        setSubjectToDelete(null);
    };
    //Log out handler
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
        console.log('Logged out');
    };
    //handler za prikaz studenata
    const handleShowStudents = async () => {
        if(!isStudentTableVisible){
            await fetchStudents();
        }
        setIsStudentTableVisible(!isStudentTableVisible);
    }

    //stylerd card css
    const StyledCard = styled(Card)(({ theme }) => ({
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        margin: '16px',
        padding: '16px',
    }));

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuFetchTeachers = () => {
        fetchTeachers(); 
        toggleTableVisibility(); 
        handleMenuClose();
    };

    const handleSubjectsMenuClick = (event) => {
        setSubjectsAnchorEl(event.currentTarget);
    };
    
    const handleSubjectsMenuClose = () => {
        setSubjectsAnchorEl(null);
    };
    //handler za otvaranje add-predmet dialog
    const handleOpenAddSubjectDialog = () => {
        setOpenAddSubjectDialog(true);
    };
    //handler za zatvaranje add-predmet dialog
    const handleCloseAddSubjectDialog = () => {
        setOpenAddSubjectDialog(false);
    };
    //handler za dodavanje predmeta
    const handleAddSubject = async () => {
        setSubjectError(false);
        if (!newSubjectName || !newSubjectWeeklyHours) {
            setSubjectError(true);
            return; // Prevent submission if validation fails
        }
        try {
            const url = `http://localhost:8080/predmet?imePredmeta=${encodeURIComponent(newSubjectName)}&nfc=${encodeURIComponent(newSubjectWeeklyHours)}`;
    
            const response = await fetch(url, {
                method: 'POST',
                headers,
            });
    
            if (response.ok) {
                fetchSubjects(); 
                setNewSubjectName(''); 
                setNewSubjectWeeklyHours('');
                setOpenAddSubjectDialog(false); 
                alert('Subject added successfully'); 
            } else {
                console.error('Failed to add subject');
                alert('Failed to add subject');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('Error adding subject');
        }
    };
    
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        imeRoditelja: '',
        prezimeRoditelja: '',
        emailRoditelja: ''
    });
    //handler za izmenu podataka studenta
    const handleUpdateStudent = async () => {
        const roditeljId = selectedStudent.roditelj?.id;
        try {
            const response = await fetch(`http://localhost:8080/ucenik/${selectedStudent.id}?ime=${formData.ime}&prezime=${formData.prezime}&roditelj=${roditeljId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('nastavnik:password123')
                },
                body: JSON.stringify({
                    ime: formData.ime,
                    prezime: formData.prezime,
                    roditelj: {
                        imeRoditelja: formData.imeRoditelja,
                        prezimeRoditelja: formData.prezimeRoditelja,
                        emailRoditelja: formData.emailRoditelja
                    }
                })
            });
    
            if (response.ok) {
                fetchStudents(); // Refresh student list
                handleCloseEditDialog(); // Close the dialog
                handleResetSelectedStudent(); // Reset selected student
                setOpenSnackbar(true); // Show success message
            } else {
                console.error('Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };
    const handleOpenEditStudentDialog = (student) => {
        setFormData({
            ime: student.ime,
            prezime: student.prezime,
            imeRoditelja: student.roditelj?.imeRoditelja || '',
            prezimeRoditelja: student.roditelj?.prezimeRoditelja || '',
            emailRoditelja: student.roditelj?.emailRoditelja || ''
        });
        setSelectedStudent(student);
        setOpenEditDialog(true);
        navigate(`/nastavnik/ucenik/${student.id}`);
    }
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        navigate('/nastavnik');
    };
    const handleResetSelectedStudent = () => {
        setSelectedStudent(null);
    };
    const handleOpenStudentDeleteDialog = (student) => {
        setSelectedStudent(student); 
        setOpenStudentDeleteDialog(true); 
    };
    
    const handleCloseStudentDeleteDialog = () => {
        setOpenStudentDeleteDialog(false); // Zatvori modal
        setSelectedStudent(null); // Resetuj odabranog studenta
    };

    const handleDeleteStudent = async () => {
        try {
            const response = await fetch(`http://localhost:8080/ucenik/${selectedStudent.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('nastavnik:password123')
                }
            });
            
            if (response.ok) {
                fetchStudents(); 
                handleCloseStudentDeleteDialog(); 
                setOpenSnackbar(true); 
            } else {
                console.error('Failed to delete student');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };
    const subjectsToDisplay = searchId ? filteredSubjectsID : filteredSubjects;
    

    



    return (
        
        <div>
            {/*nav bar */}
            <AppBar position="static" style={{ backgroundColor: '#3f51b5' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, Teacher
                    </Typography>

                    <Box display="flex" alignItems="center" justifyContent="space-between" width="30%">
                        <Button
                            color="inherit"
                            aria-controls="teachers-menu"
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                        >
                            Teachers Options
                        </Button>
                        
                        <Menu
                            id="teachers-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleOpenAddDialog}>
                                <PersonAddIcon style={{ marginRight: 8 }} /> Add Teacher
                            </MenuItem>
                            <MenuItem onClick={handleMenuFetchTeachers}>
                                <PeopleIcon style={{ marginRight: 8 }} /> Fetch All Teachers
                            </MenuItem>
                        </Menu>

                        <Button
                            color="inherit"
                            aria-controls="subjects-menu"
                            aria-haspopup="true"
                            onClick={handleSubjectsMenuClick}
                        >
                            Subject Options
                        </Button>
                        <Menu
                            id="subjects-menu"
                            anchorEl={subjectsAnchorEl}
                            open={Boolean(subjectsAnchorEl)}
                            onClose={handleSubjectsMenuClose}
                        >
                            <MenuItem onClick={handleOpenAddSubjectDialog} >
                                <LibraryAddIcon style={{ marginRight: 8 }} /> Add Subject
                            </MenuItem>
                            <MenuItem onClick={fetchSubjects} >
                                <LibraryBooksIcon style={{ marginRight: 8 }} /> Fetch All Subjects
                            </MenuItem>
                        </Menu>
                        

                        <Button color="inherit" component={Link} to="" onClick={handleShowStudents}>
                            Students
                        </Button>

                        <Button color="inherit" component={Link} to="">
                            Profile
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                            style={{ backgroundColor: '#f44336', color: '#fff' }}
                            startIcon={<LogoutIcon />}
                        >
                            Log Out
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {/*render za prikazivanje tabele studenata */}
            {isStudentTableVisible && (
                <div>
                    <Typography variant="h5">Students</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ bgcolor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Parent Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Parent Last Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Parent Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>{student.ime}</TableCell>
                                        <TableCell>{student.prezime}</TableCell>
                                        <TableCell>{student.roditelj?.imeRoditelja}</TableCell>
                                        <TableCell>{student.roditelj?.prezimeRoditelja}</TableCell>
                                        <TableCell>{student.roditelj?.emailRoditelja}</TableCell>
                                        <TableCell>
                                            <CustomButton
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenEditStudentDialog(student)}
                                            >
                                                Edit
                                            </CustomButton>
                                            <CustomButton
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleOpenStudentDeleteDialog(student)}
                                            >
                                                Delete
                                            </CustomButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
            {/*render za prikazivanje tabele nastavnika */}
            {isTableVisible && (
                <div>
                    <Typography variant="h5" style={{ marginLeft : '10px',margin: '10px 10px'}}>
                        Teachers
                    </Typography>
                    <TextField
                        label="Search by Teacher ID"
                        variant="outlined"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ marginBottom: '20px', 
                                marginLeft : '10px'
                        }}
                    />
                    <TableContainer component={Paper}>
                    <Table sx={{ bgcolor: '#f5f5f5' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTeachers.map(teacher => (
                                <TableRow key={teacher.id}>
                                    <TableCell>{teacher.id}</TableCell>
                                    <TableCell>{teacher.ime}</TableCell>
                                    <TableCell>{teacher.prezime}</TableCell>
                                    <TableCell>
                                        <CustomButton
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleOpenEditDialog(teacher)}
                                        >
                                            Edit
                                        </CustomButton>
                                        <CustomButton
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleOpenDeleteModal(teacher.id)}
                                        >
                                            Delete
                                        </CustomButton>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                
            )}
            {/*render za prikazivanje predmeta  */}  
            {isSubjectsVisible && (
                <div className="subject-card">
                    <div className="subjects-header">
                        <Typography variant="h5">Subjects</Typography>
                            <TextField
                                label="Search Subjects"
                                variant="outlined"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-field"
                            />
                            <TextField
                                label="Search by Subject ID"
                                variant="outlined"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                
                            />
                    </div>
                    <Grid container spacing={2}>
                        {subjectsToDisplay.map(subject => (
                            <Grid item xs={12} sm={6} md={4} key={subject.id}>
                                <StyledCard>
                                    <Card sx={{ bgcolor: '#f5f5f5' }}>
                                        <CardContent>
                                            <Typography variant="h7">ID: {subject.id}</Typography>
                                            <Typography variant="h6">{subject.imePredmeta}</Typography>
                                            <Typography variant="body2">
                                                Weekly classes: {subject.nedeljniFondCasova}
                                            </Typography>
                                            
                                        </CardContent>
                                        <CardActions>
                                        <CustomButton 
                                            size="small" 
                                            onClick={() => handleOpenSubjectDeleteDialog(subject)}
                                            startIcon={<DeleteIcon />}
                                            style={{ backgroundColor: 'red', color: 'white' }}
                                        >
                                            Delete
                                        </CustomButton>
                                        <CustomButton 
                                            size="small" 
                                            onClick={() => handleOpenSubjectEditDialog(subject)}
                                            startIcon={<EditIcon />}
                                            style={{ backgroundColor: '#66bfbf', color: 'white' }  }
                                        >
                                            Edit
                                        </CustomButton>
                                        </CardActions>
                                        
                                    </Card>
                                </StyledCard>  
                            </Grid>
                        ))}
                        
                    </Grid>   
                </div>
            )}

            {/*dialog za dodavanje predmeta  */} 
            <Dialog open={openAddSubjectDialog} onClose={handleCloseAddSubjectDialog}>
                <DialogTitle>
                    <LibraryAddIcon style={{ marginRight: 8 }} /> 
                        Add Subject
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Subject Name"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        fullWidth
                        error={subjectError && !newSubjectName}
                        helperText={subjectError && !newSubjectName ? "Subject name is required" : ""}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Weekly Hours"
                        value={newSubjectWeeklyHours}
                        onChange={(e) => setNewSubjectWeeklyHours(e.target.value)}
                        fullWidth
                        error={subjectError && !newSubjectWeeklyHours}
                        helperText={subjectError && !newSubjectWeeklyHours ? "Weekly class hours are required" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddSubjectDialog} color="primary">Cancel</Button>
                    <Button onClick={handleAddSubject} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* dialog za dodavanje novog nastavnika */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                    <DialogTitle>
                        <PersonAddIcon style={{ marginRight: 8 }} /> 
                            Add Teacher
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={newTeacherIme}
                            onChange={(e) => {
                                setNewTeacherIme(e.target.value);
                                if (e.target.value) {
                                    setIsFormValid(true);
                                }
                            }}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                            error={!isFormValid && !newTeacherIme}
                            helperText={!isFormValid && !newTeacherIme ? 'Name is required' : ''}
                        />
                        <TextField
                            label="Last name"
                            value={newTeacherPrezime}
                            onChange={(e) => {
                                setNewTeacherPrezime(e.target.value);
                                if (e.target.value) {
                                    setIsFormValid(true);
                                }
                            }}
                            fullWidth
                            error={!isFormValid && !newTeacherPrezime}
                            helperText={!isFormValid && !newTeacherPrezime ? 'Last name is required' : ''}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog} color="primary">Cancel</Button>
                        <Button onClick={handleAddTeacher} color="primary">Add</Button>
                    </DialogActions>
            </Dialog>
            
            {/* dialog za editovanje predmeta */}
            <Dialog open={openSubjectEditDialog} onClose={handleCloseSubjectEditDialog}>
            <DialogTitle >
                <EditIcon style={{ marginRight: 8 }} /> 
                    Edit Subject
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Subject Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editSubject.imePredmeta}
                    onChange={(e) => setEditSubject({ ...editSubject, imePredmeta: e.target.value })}
                    error={error && !editSubject.imePredmeta} // Highlight if there's an error
                    helperText={error && !editSubject.imePredmeta ? 'Subject name is required.' : ''}
                />
                <TextField
                    margin="dense"
                    label="Weekly Classes"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={editSubject.nedeljniFondCasova}
                    onChange={(e) => setEditSubject({ ...editSubject, nedeljniFondCasova: e.target.value })}
                    error={error && !editSubject.nedeljniFondCasova} // Highlight if there's an error
                    helperText={error && !editSubject.nedeljniFondCasova ? 'Weekly classes are required.' : ''}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseSubjectEditDialog}
                    style={{ backgroundColor: 'red', color: 'white' }}
                >Cancel
                </Button>
                <Button onClick={handleSaveSubjectChanges}
                    style={{ backgroundColor: '#347474', color: 'white' }}
                >Save</Button>
            </DialogActions>
            </Dialog>

            {/* dialog za editovanje nastavnika */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    <EditIcon style={{ marginRight: 8 }} /> 
                        Edit Teacher: {editTeacher.id} 
                </DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Ime"
                    type="text"
                    fullWidth
                    value={updateTeacherIme}
                    onChange={(e) => setUpdateTeacherIme(e.target.value)}
                    error={error && !updateTeacherIme} // Highlight if there's an error
                    helperText={error && !updateTeacherIme ? 'Ime is required.' : ''}
                    />
                    <TextField
                    margin="dense"
                    label="Prezime"
                    type="text"
                    fullWidth
                    value={updateTeacherPrezime}
                    onChange={(e) => setUpdateTeacherPrezime(e.target.value)}
                    error={error && !updateTeacherPrezime} // Highlight if there's an error
                    helperText={error && !updateTeacherPrezime ? 'Prezime is required.' : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary"
                        style={{ backgroundColor: 'red', color: 'white' }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateTeacher} color="primary"
                        style={{ backgroundColor: '#347474', color: 'white'}}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* dialog za editovanje studenta */} 
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Student: {selectedStudent?.id} </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Ime"
                            type="text"
                            fullWidth
                            value={formData.ime}
                            onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Prezime"
                            type="text"
                            fullWidth
                            value={formData.prezime}
                            onChange={(e) => setFormData({ ...formData, prezime: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Ime roditelja"
                            type="text"
                            fullWidth
                            value={formData.imeRoditelja}
                            onChange={(e) => setFormData({ ...formData, imeRoditelja: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Prezime roditelja"
                            type="text"
                            fullWidth
                            value={formData.prezimeRoditelja}
                            onChange={(e) => setFormData({ ...formData, prezimeRoditelja: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Email roditelja"
                            type="email"
                            fullWidth
                            value={formData.emailRoditelja}
                            onChange={(e) => setFormData({ ...formData, emailRoditelja: e.target.value })}
                        />
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateStudent} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


            {/* potvrda za brisanje nastavnika */}
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        Confirm Delete
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete this teacher?
                    </Typography>
                    <div style={{ marginTop: '16px' }}>
                        <CustomButton variant="outlined" color="error" onClick={handleDeleteTeacher}>
                            Delete
                        </CustomButton>
                        <CustomButton variant="outlined" onClick={handleCloseDeleteModal}>
                            Cancel
                        </CustomButton>
                    </div>
                </Box>
            </Modal>
            {/* potvrda za brisanje predmeta */}
            <Modal
                open={openSubjectDeleteDialog}
                onClose={handleCloseSubjectDeleteDialog}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        Confirm Delete
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete this subject?
                    </Typography>
                    <div style={{ marginTop: '16px' }}>
                        <CustomButton variant="outlined" color="error" onClick={handleDeleteSubject}>
                            Delete
                        </CustomButton>
                        <CustomButton variant="outlined" onClick={handleCloseSubjectDeleteDialog}>
                            Cancel
                        </CustomButton>
                    </div>
                </Box>
            </Modal>
            {/* potvrda za brisanje ucenika */}
            <Modal
                open={openStudentDeleteDialog}
                onClose={handleCloseStudentDeleteDialog}
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="delete-modal-title" variant="h6" component="h2">
                        Confirm Delete
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete this student?
                    </Typography>
                    <div style={{ marginTop: '16px' }}>
                        <CustomButton variant="outlined" color="error" onClick={handleDeleteStudent}>
                            Delete
                        </CustomButton>
                        <CustomButton variant="outlined" onClick={handleCloseStudentDeleteDialog}>
                            Cancel
                        </CustomButton>
                    </div>
                </Box>
            </Modal>

            {/* Snackbar za uspesne promene */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Updated successfully!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Nastavnik;