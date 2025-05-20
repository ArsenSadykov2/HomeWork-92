
import {useState} from "react";
import {Button, Menu, MenuItem} from "@mui/material";
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import {useAppDispatch} from "../../app/hooks.ts";
import {logout} from "../../features/Users/usersThunks.ts";
import type {User} from "../../types";
import {unsetUser} from "../../features/Users/userSlices.ts";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setUserOptionsEl(event.currentTarget);
    };

    const handleClose = () => {
        setUserOptionsEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(unsetUser());
        handleClose();
        toast.success("Logout successfully");
    };

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                sx={{
                    textTransform: 'none',
                    backgroundColor: 'white',
                    color: '#1976d2',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: '#e3f2fd',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                Hello, {user.username}!
            </Button>
            <Menu
                keepMounted
                anchorEl={userOptionsEl}
                open={Boolean(userOptionsEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: '#e8f5e9',
                        padding: '8px',
                        borderRadius: '8px',
                    }
                }}
            >
                <MenuItem>
                    {user.role === 'admin' && (
                        <Button
                            component={NavLink}
                            to="/albums/new"
                            onClick={handleClose}
                            sx={{
                                width: '100%',
                                textTransform: 'none',
                                color: '#1b5e20',
                                fontWeight: 'bold',
                                transition: 'box-shadow 0.3s',
                                '&:hover': {
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            Add product
                        </Button>
                    )}
                </MenuItem>

                <MenuItem
                    sx={{
                        color: '#1b5e20',
                        fontWeight: 'bold',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        },
                    }}
                >
                    My account
                </MenuItem>

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        color: '#1b5e20',
                        fontWeight: 'bold',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        },
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>


        </>
    );
};

export default UserMenu;