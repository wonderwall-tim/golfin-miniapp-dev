import { createFriend, getFriend, } from "@/apis/FriendServices"
import { getUser } from "@/apis/UserSevices"
import { FriendContext } from "@/contexts/FriendContext"
import { useUserContext } from "@/contexts/UserContext"
import { FriendBaseType, FriendCreateRequestType, FriendStatusType } from "@/type"
import WebApp from "@twa-dev/sdk"
import { useEffect, useState } from "react"

export const FriendProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [friend, setFriend] = useState<FriendBaseType | undefined>()
    const [isWaitingFriend, setIsWaitingFriend] = useState(false)

    const webappUser = WebApp.initDataUnsafe.user
    const webappStartParam = WebApp.initDataUnsafe.start_param

    const { account } = useUserContext()

    useEffect(() => {
        const friendCreation = async (senderId: string, friendCreatePayload: FriendCreateRequestType) => {
            const sender = await getUser({
                access_token: '',
                telegram_id: senderId
            })
            
            if (sender)
                friendCreatePayload.sender_id == sender.user_details.user_base.id

            const newFriend = await createFriend(friendCreatePayload)
            if (newFriend) {
                setFriend({
                    id: newFriend.friend_details.friend_base.id,
                    status: newFriend.friend_details.friend_base.status,
                    sender_id: newFriend.friend_details.sender_id,
                    receiver_id: newFriend.friend_details.receiver_id,
                    updated_at: newFriend.friend_details.friend_base.updated_at,
                    created_at: newFriend.friend_details.friend_base.created_at,
                })
            } else {
                const existingFriend = await getFriend({
                    access_token: '',
                    user_id: account?.id
                })
                if (existingFriend) {
                    setFriend({
                        id: existingFriend.friend_base.id,
                        status: existingFriend.friend_base.status,
                        sender_id: existingFriend.sender_id,
                        receiver_id: existingFriend.receiver_id,
                        updated_at: existingFriend.friend_base.updated_at,
                        created_at: existingFriend.friend_base.created_at,
                    })
                    setIsWaitingFriend(false)
                }
            }
        }

        if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
            setFriend({
                id: 1,
                status: FriendStatusType.active,
                sender_id: 60001,
                receiver_id: 30001,
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            })
            setIsWaitingFriend(false)
        } else {
            setIsWaitingFriend(true)
            if (account?.id && webappStartParam) {
                console.log('provider friend');
                const friendPayload = {
                    access_token: '',
                    sender_id: 0,
                    receiver_id: account?.id,
                    status: FriendStatusType.active
                }
                friendCreation(webappStartParam/*  the one who make the friend request == sender */, friendPayload)
            } else {
                setIsWaitingFriend(false)
            }
        }
    }, [account, webappStartParam])

    return <FriendContext.Provider value={{
        friend,
        setFriend,
        isWaitingFriend,
        setIsWaitingFriend
    }}>
        {children}
    </FriendContext.Provider>
}