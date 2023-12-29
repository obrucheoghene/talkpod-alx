import useSWR from 'swr'

export const useRoomById = (roomId:string) => {
    const {data, error, isLoading, mutate} = useSWR(`/rooms/${roomId}`)
    return {data, error, isLoading, mutate}
}
export const useRoomByUserId = (userId:string) => {
    const {data, error, isLoading, mutate} = useSWR(`/rooms/user/${userId}`)
    return {data, error, isLoading, mutate}
}
