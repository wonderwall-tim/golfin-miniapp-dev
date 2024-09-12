import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk';

import { mockUserAccount } from '../constants';
import { UserContext } from '../contexts/UserContext';
import { AccountType, UserCreateRequestType, UserType } from '../type';
import { createUser } from '@/apis/UserSevices';



export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [account, setAccount] = useState<UserType | undefined | AccountType>();
    const webappUser = WebApp.initDataUnsafe.user
    const webappStartParam = WebApp.initDataUnsafe.start_param

    useEffect(() => {
        const userCreation = async (userCreatePayload: UserCreateRequestType) => {
            try {
                const newUser = await createUser(userCreatePayload)
                if (newUser !== undefined) {
                    const { user_details, access_token } = newUser
                    const { user_base, game_characters, point, activity, social_media, sender, receiver } = user_details

                    setAccount(user_base)
                    // setUser(userPayload)
                }
                return
            } catch (error) {
                console.log(error);
                return error
            }
        }
        if (process.env.env == 'test') {
            if (mockUserAccount.name !== undefined && mockUserAccount.point !== undefined && mockUserAccount.referral !== undefined) {
                setAccount({
                    name: mockUserAccount.name,
                    point: mockUserAccount.point,
                    referral: mockUserAccount.referral,
                })
            }
        }

        if (webappUser && `${webappUser?.id}` == webappStartParam) {
            window.alert('Same ID')
            WebApp.close()
        }

        if (webappUser?.id !== undefined && webappStartParam !== undefined) {
            console.log('userInfoPayload');
            const { id, username, first_name, last_name, is_premium, is_bot, language_code } = webappUser

            if (is_bot) {
                WebApp.close()
            }

            console.log('userInfoPayload if');
            userCreation({
                app_info: {
                    is_active: true,
                    is_admin: false,
                    skin: []
                },
                personal_info: {
                    location: "Japan", // FIXME: change it by form later, with ENUM
                    nationality: "Japanese" // FIXME: change it by form later, with ENUM
                    // age?: number
                    // gender?: string
                    // email?: string
                },
                telegram_info: {
                    username: username!,
                    telegram_id: id.toString(),
                    token_balance: 0,
                    is_premium: is_premium!,
                    chat_id: '123' // FIXME: change it by getting the chat id from tg bot later on
                    // wallet_address?: string
                    // chat_id: string
                }

            })
        }
    }, [])
    return (
        <UserContext.Provider value={{
            account,
            setAccount
        }}>
            {children}
        </UserContext.Provider>
    );
}

