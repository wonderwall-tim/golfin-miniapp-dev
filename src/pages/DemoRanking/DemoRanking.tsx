import { useCallback, useEffect, useState } from 'react'
import { TabbarLink } from 'konsta/react'

import { mockPointRankingData, mockReferralRankingData } from '@/constants'
import CoinImage from '../../assets/images/02_earn_coin.png'
import { getUser, getUsers } from '@/apis/UserSevices'
import { useUserContext } from '@/contexts/UserContext'
import { useFriendContext } from '@/contexts/FriendContext'
import { usePointContext } from '@/contexts/PointContext'
import { getPointRanking, getPointRankingList } from '@/apis/PointServices'
import { getReferralRanking } from '@/apis/FriendServices'

interface ReferralRankingItem {
    rank: number,
    name: string;
    referral: number;
}
interface PointRankingItem {
    rank: number,
    name: string;
    point: number;
}
const DemoRanking = () => {
    const { account, setIsWaitingUser } = useUserContext()
    const { setIsWaitingFriend } = useFriendContext()
    const { setIsWaitingPoint } = usePointContext()
    const [dailyReward, setDailyReward] = useState(true)
    const [activeTab, setActiveTab] = useState('tab-1');
    const [isTabbarLabels, setIsTabbarLabels] = useState(true);

    const [referralRanking, setReferrakRanking] = useState<ReferralRankingItem[]>([])
    const [pointRanking, setPointRanking] = useState<any[]>([])

    const [myReferralRecord, setMyReferralRecord] = useState<ReferralRankingItem>()
    const [myPointRecord, setMyPointRecord] = useState<PointRankingItem>()
    // FIXME
    // const myReferralRankingFromServer = await getReferralRanking({
    //     access_token: '',
    //     user_id: account?.id
    // })
    // console.log('my referral ranking from server: ', myReferralRankingFromServer);
    // if (myReferralRankingFromServer && account?.telegram_info.username) {
    //     setMyReferralRecord({
    //         rank: myReferralRankingFromServer.rank,
    //         name: account?.telegram_info.username,
    //         referral: myReferralRankingFromServer?.referral_count
    //     })
    // }

    const handleReferralRanking = useCallback(async () => {
        //setIsWaitingFriend(true)
        try {
            if (import.meta.env.VITE_MINI_APP_ENV === 'test') {
                setReferrakRanking(mockReferralRankingData)
                setMyReferralRecord({ name: 'nextInnovationDev25', rank: 1, referral: 5999999999 })
            } else {
                const existingUsers = await getUsers(0, 20); // FIXME

                console.log(existingUsers);

                if (existingUsers && existingUsers.length > 0) {
                    const referralRanking: ReferralRankingItem[] = existingUsers.map((user, /* index */) => {
                        const senderCount = user.user_details.sender?.length || 0; // Handle potential nullish value
                        return {
                            rank: 0,
                            name: user.user_details.user_base.telegram_info.username,
                            referral: senderCount,
                        };
                    })
                        .sort((a, b) => b.referral - a.referral)
                        .map((item, index) => ({ ...item, rank: index + 1 }));

                    const myReferralRecord = referralRanking.find(r => r.name == account?.telegram_info.username)
                    if (myReferralRecord) {
                        setMyReferralRecord(myReferralRecord)
                    }

                    setReferrakRanking(referralRanking);
                }
            }

        } catch (error) {
            console.error('Error handling referral reward:', error);

        } finally {
            //setIsWaitingFriend(false)
        }

    }, [setIsWaitingFriend, setReferrakRanking, setMyReferralRecord])

    useEffect(() => {
        handleReferralRanking()
    }, [handleReferralRanking])

    const handlePointRanking = useCallback(async () => {
        // setIsWaitingPoint(true)
        try {
            if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
                setPointRanking(mockPointRankingData)
                setMyPointRecord({ name: 'nextInnovationDev25', rank: 1000, point: 250 })
            } else {
                const myPointRankingFromServer = await getPointRanking({
                    access_token: '',
                    user_id: account?.id
                })
                console.log('my ranking from server: ', myPointRankingFromServer);
                const existingUsers = await getPointRankingList();
                const pointRanking = existingUsers && await Promise.all(existingUsers.map(async (user, index) => {
                    const dbUser = await getUser({
                        access_token: '',
                        id: user.user_id.toString()
                    })
                    if (dbUser?.user_details.user_base.telegram_info.username) {
                        // Handle potential nullish values for user.user_details.point and user.user_details.point[0]
                        return {
                            rank: user.rank,
                            name: dbUser?.user_details.user_base.telegram_info.username,
                            point: user?.total_points
                        }
                    }
                }))

                if (myPointRankingFromServer && account?.telegram_info.username && pointRanking) {
                    setMyPointRecord({
                        rank: myPointRankingFromServer.rank,
                        name: account?.telegram_info.username,
                        point: myPointRankingFromServer?.total_points
                    })
                    setPointRanking(pointRanking)
                }
            }
        } catch (error) {
            console.error('Error handling referral reward:', error);
        } finally {
            // setIsWaitingPoint(false)
        }
    }, [account])


    useEffect(() => {
        handlePointRanking()
    }, [handlePointRanking])


    const rankingNameDisplayer = (name: string) => {
        if (name.length > 10) {
            return name.substring(0, 7) + '...' + name.substring(name.length - 3)
        }
        return name
    }

    return (
        <div className='w-[100%] h-[690px]'>
            <div className='flex justify-center'>
                <div className='mx-10 mt-5 sm:mt-[5px] md:mt-[12px] lg:mt-[15px]'>
                    <div className='flex'>
                        <TabbarLink
                            active={activeTab === 'tab-1'}
                            onClick={() => setActiveTab('tab-1')}
                            label={isTabbarLabels && 'Referral'}
                            style={{}}
                            className={`${activeTab === 'tab-1' ?
                                'text-[rgba(255,255,255,0.4)] font-[700] rounxded-t-lg border-b-2 border-white' :
                                'text-[rgba(255,255,255,0.4)] border-b-2 border-gray-500'}`}
                        />
                        <TabbarLink
                            active={activeTab === 'tab-2'}
                            onClick={() => setActiveTab('tab-2')}
                            label={isTabbarLabels && 'Total Points'}
                            className={`${activeTab === 'tab-2' ?
                                'text-[rgba(255,255,255,0.4)] font-[700] rounded-t-lg border-b-2 border-white' :
                                'text-[rgba(255,255,255,0.4)] font-[700] border-b-2 border-gray-500'}`}
                        />
                    </div>


                    {activeTab === 'tab-1' && <>
                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[400px] md:h-[460px] pt-3'>
                            <div className={`text-white bg-[#ffffff33] flex items-center justify-between border-4 rounded-md border-[#8ADD5D] p-1`}>
                                <div className='flex items-center font-rubik font-[400] text-xl'>
                                    <div className='text-center mx-4 text-[17px]'>{myReferralRecord !== undefined && myReferralRecord.rank > 100 ? '100+' : (myReferralRecord?.rank !== undefined && myReferralRecord.rank)}</div>
                                    <div className='text-center text-[17px]'>{myReferralRecord !== undefined && rankingNameDisplayer(myReferralRecord.name)}</div>
                                </div>
                                <div className='flex items-center'>
                                    <img src={CoinImage} width='20' height='20' className='mr-2' alt="Coin" />
                                    <div className='text-xl text-[17px]'>{myReferralRecord !== undefined && myReferralRecord.referral}</div>
                                </div>
                            </div>

                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll md:overflow-hidden bg-[#ffffff33]'>
                                {referralRanking.map((referralRank, index) => {
                                    if (index < 10) {
                                        return (
                                            <div key={referralRank.name} className='text-white flex items-center justify-between p-1 pr-10'>
                                                <div className='flex items-center space-x-3 flex-1'>
                                                    <div className='w-6 text-right text-[17px]'>{index + 1}</div>
                                                    <div className='text-[17px] truncate'>{rankingNameDisplayer(referralRank.name)}</div>
                                                </div>
                                                <div className='flex items-center space-x-2 flex-shrink-0'>
                                                    <img src={CoinImage} width='20' height='20' alt="Coin" />
                                                    <div className='text-[17px] w-12 text-left'>{referralRank.referral}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </>}

                    {activeTab === 'tab-2' && <>
                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[400px] md:h-[460px] pt-3'>
                            <div className={`text-white bg-[#ffffff33] flex items-center justify-between border-4 rounded-md border-[#8ADD5D] p-1`}>
                                <div className='flex items-center font-rubik font-[400] text-xl'>
                                    <div className='text-center mx-4 text-[17px]'>{myPointRecord !== undefined && myPointRecord.rank > 100 ? '100+' : (myPointRecord?.rank !== undefined && myPointRecord.rank)}</div>
                                    <div className='text-center text-[17px]'>{myPointRecord !== undefined && rankingNameDisplayer(myPointRecord.name)}</div>
                                </div>
                                <div className='flex items-center'>
                                    <img src={CoinImage} width='20' height='20' className='mr-2' alt="Coin" />
                                    <div className='text-xl text-[17px]'>{myPointRecord !== undefined && myPointRecord.point}</div>
                                </div>
                            </div>

                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll md:overflow-hidden bg-[#ffffff33]'>
                                {pointRanking.map((pointRank, index) => {
                                    if (index < 10) {
                                        return (
                                            <div key={pointRank.name} className='text-white flex items-center justify-between p-1 pr-10'>
                                                <div className='flex items-center space-x-3 flex-1'>
                                                    <div className='w-6 text-right text-[17px]'>{index + 1}</div>
                                                    <div className='text-[17px] truncate'>{rankingNameDisplayer(pointRank.name)}</div>
                                                </div>
                                                <div className='flex items-center space-x-2 flex-shrink-0'>
                                                    <img src={CoinImage} width='20' height='20' alt="Coin" />
                                                    <div className='text-[17px] w-12 text-left'>{pointRank.point}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default DemoRanking