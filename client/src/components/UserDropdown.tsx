import { Avatar, Dropdown, MenuProps } from 'antd'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { getInitials, getUserHomeRoom } from '../utils/helpers';
import { AuthContext } from '../contexts/AuthContext';

const UserDropdown = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const openRooms = async () => {
        try {
            const room = await getUserHomeRoom(user?.data.id as string)
            navigate(`/${room.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    const logout = () => {
        setUser(null);
        navigate('/')
    }
    const items: MenuProps['items'] = [
        {
            key: 'Rooms',
            label: <button onClick={openRooms}>Rooms</button>
        },
        {
            key: 'Logout',
            label: <button onClick={logout}>Logout</button>
        }
    ]
    return (
        <Dropdown menu={{ items }} placement='bottom'>
            <div className='flex items-center justify-center gap-x-2'>
                <Avatar style={{ backgroundColor: "#8852FF", color: "white" }}>{getInitials(user!.data.name)}</Avatar> {user!.data.name}</div>
        </Dropdown>
    )
}

export default UserDropdown
