import DB from "../lib/db"

interface NewRoomData {
    name: string,
    userId: string
}

export const createRoom = async (data: NewRoomData) => {
    try {
        const room = await DB.room.create({data: data});
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserHomeRoom = async (userId: string) => {
    try {
        const room = await DB.room.findFirst({
            where: {
                userId: userId
            }
        });
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserRooms = async (userId: string) => {
    try {
        const rooms = await DB.room.findMany({
            where: {
                userId: userId
            }
        });
        return rooms;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getRoomById = async (roomId: string) => {
    try {
        const room = await DB.room.findUnique({
            where: {
                id: roomId
            }
        });
        return room;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getUserByRoomId = async (roomId: string) => {
    try {

        const room = await DB.room.findUnique({
            where: {
                id: roomId
            }
        });
        const user = await DB.user.findUnique({
            where: {
                id: room?.userId
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
