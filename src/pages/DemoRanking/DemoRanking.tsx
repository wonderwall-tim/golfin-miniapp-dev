import { useCallback, useEffect, useRef, useState } from 'react'
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
    const [existingUsers, setExistingUsers] = useState([]) // TODO:
    const [isLoading, setIsLoading] = useState(false)

    // })
    useEffect(() => {
        const fetchRankings = async () => {
            if (isLoading || !account) return;
            setIsLoading(true);
            setIsWaitingPoint(true);
            setIsWaitingUser(true);
            setIsWaitingFriend(true);

            try {
                if (import.meta.env.VITE_MINI_APP_ENV !== 'test') {
                    await handleReferralRanking();
                    await handlePointRanking();
                } else {
                    setReferrakRanking(mockReferralRankingData);
                    setMyReferralRecord({ name: 'nextInnovationDev25', rank: 1, referral: 25 });
                    setPointRanking(mockPointRankingData);
                    setMyPointRecord({ name: 'nextInnovationDev25', rank: 25, point: 250 });
                }
            } catch (error) {
                console.error('Error fetching rankings:', error);
            } finally {
                setIsLoading(false);
                setIsWaitingPoint(false);
                setIsWaitingUser(false);
                setIsWaitingFriend(false);
            }
        };

        fetchRankings();
    }, [account]);


    const handlePointRanking = async () => {
        setIsWaitingUser(true)
        const myPointRankingFromServer = await getPointRanking({
            access_token: '',
            user_id: account?.id
        })
        console.log('my ranking from server: ', myPointRankingFromServer);
        if (myPointRankingFromServer && account?.telegram_info.username) {
            setMyPointRecord({
                rank: myPointRankingFromServer.rank,
                name: account?.telegram_info.username,
                point: myPointRankingFromServer?.total_points
            })
        }
        const existingUsers = await getPointRankingList();

        console.log(existingUsers);

        if (existingUsers && existingUsers.length > 0) {
            const pointRanking = await Promise.all(existingUsers.map(async (user) => {
                const dbUser = await getUser({
                    access_token: '',
                    id: user.user_id.toString()
                })
                return {
                    rank: user.rank,
                    name: dbUser?.user_details.user_base.telegram_info.username,
                    point: user?.total_points
                }
            }));
            console.log('pointRanking');
            console.log(pointRanking);
            setPointRanking(pointRanking);
            setIsWaitingUser(false)
        } else {
            console.log('No users found for point ranking.'); // Informative logging
        }
    }

    const handleReferralRanking = async () => {
        // setIsWaitingUser(true)
        const myReferralRankingFromServer = await getReferralRanking({
            access_token: '',
            user_id: account?.id
        })
        console.log('my referral ranking from server: ', myReferralRankingFromServer);
        if (myReferralRankingFromServer && account?.telegram_info.username) {
            setMyReferralRecord({
                rank: myReferralRankingFromServer.rank,
                name: account?.telegram_info.username,
                referral: myReferralRankingFromServer?.referral_count
            })
        }

        const existingUsers = await getUsers(0, 10);

        console.log(existingUsers);

        if (existingUsers && existingUsers.length > 0) {
            const referralRanking: ReferralRankingItem[] = existingUsers.map((user, index) => {
                const senderCount = user.user_details.sender?.length || 0; // Handle potential nullish value
                return {
                    rank: index,
                    name: user.user_details.user_base.telegram_info.username,
                    referral: senderCount,
                };
            });
            console.log('referralRanking');
            console.log(referralRanking);
            // setIsWaitingFriend(true)
            referralRanking.sort((a, b) => b.referral - a.referral).map((item, index) => ({
                ...item,
                rank: index + 1, // Assign the ranking position
            }));
            referralRanking.map((r, sortIndex) => {
                // if (r.name == account?.telegram_info.username) {
                //     setMyReferralRecord({
                //         rank: sortIndex,
                //         name: account?.telegram_info.username,
                //         referral: r.referral
                //     })
                // }
                return {
                    ...r, rank: sortIndex
                }
            })
            setReferrakRanking(referralRanking);
            // console.log('myReferralRecord');
            // console.log(myReferralRecord);

        } else {
            console.log('No users found for referral ranking.'); // Informative logging
        }
    }


    //useEffect(() => {
    //    if (import.meta.env.VITE_MINI_APP_ENV !== 'test') {
    //        handleReferralRanking()
    //        handlePointRanking()
    //        // setIsWaitingUser(false)
    //        // setIsWaitingFriend(false)
    //        // setIsWaitingPoint(false)
    //    } else {
    //        // setIsWaitingUser(true)
    //        setReferrakRanking(mockReferralRankingData)
    //        setMyReferralRecord({ name: 'nextInnovationDev25', rank: 1, referral: 25 })
    //        // setIsWaitingFriend(true)
    //        setPointRanking(mockPointRankingData)
    //        setMyPointRecord({ name: 'nextInnovationDev25', rank: 25, point: 250 })
    //        // setIsWaitingPoint(true)
    //        // setIsWaitingUser(false)
    //        // setIsWaitingFriend(false)
    //        // setIsWaitingPoint(false)
    //    }
    //
    //}, [])
    //useEffect(() => {
    //    if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
    //        // setIsWaitingUser(true)
    //        setReferrakRanking(mockReferralRankingData)
    //        setMyReferralRecord({ name: 'nextInnovationDev25', rank: 1, referral: 25 })
    //        // setIsWaitingFriend(true)
    //        setPointRanking(mockPointRankingData)
    //        setMyPointRecord({ name: 'nextInnovationDev25', rank: 25, point: 250 })
    //        // setIsWaitingPoint(true)
    //        // setIsWaitingUser(false)
    //        // setIsWaitingFriend(false)
    //        // setIsWaitingPoint(false)
    //    }
//
    //}, [])
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
                                'text-white font-[700] rounded-t-lg border-b-2 border-white' :
                                'text-white font-[700] border-b-2 border-gray-500'}`}
                        />
                        <TabbarLink
                            active={activeTab === 'tab-2'}
                            onClick={() => setActiveTab('tab-2')}
                            label={isTabbarLabels && 'Total Points'}
                            className={`${activeTab === 'tab-2' ? 'text-white font-[700] rounded-t-lg border-b-2 border-white' : 'text-white font-[700] border-b-2 border-gray-500'}`}
                        />
                    </div>

                    {activeTab === 'tab-1' && <>
                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[400px] md:h-[460px] pt-2'>
                            <div className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between border-4 border-[#8cc73e]`}>
                                <div className='flex font-rubik font-[400] text-xl pr-10 py-1 content-start place-content-start mx-[-1px]'>
                                    <div className='text-center mx-2 text-[17px]'>{myReferralRecord !== undefined && myReferralRecord.rank > 100 ? '100+' : (myReferralRecord?.rank !== undefined && myReferralRecord?.rank)}</div>
                                    <div className='text-center content-center justify-center text-[17px]'>{myReferralRecord !== undefined && myReferralRecord.name}</div>
                                </div>
                                <div className='flex flex-row justify-between pr-2 py-1'>
                                    <div className='text-xl pr-5 text-[17px]'>{myReferralRecord !== undefined && myReferralRecord.referral}</div>
                                    <img src={CoinImage} width='30px' height='30px' className='justify-end ml-1' />
                                </div>
                            </div>
                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll  md:overflow-hidden bg-[#ffffff33]'>

                                {referralRanking.map((referralRank, index) => {
                                    if (index < 10) {
                                        return <div key={referralRank.name} className={`text-white flex flex-row leading-[89px] justify-between items-end content-end`}>
                                            <div className={`flex font-rubik font-[400] text-xl pr-10 pb-1`}>
                                                {/* <div className='pl-5 text-right font-[12px]'>{referralRank.rank}</div> */}
                                                <div className='px-3 text-[17px]'>{index + 1}</div>
                                                <div className={`${index < 9 ? 'pl-1' : 'pl-[-2px]'} font-[10px]`}>{referralRank.name}</div>
                                            </div>
                                            <div className='flex flex-row pb-1 justify-between'>
                                                <div className={`text-xl font-[10px] px-1`}>{referralRank.referral}</div>
                                                <img src={CoinImage} width='30px' height='30px' className='flex' />
                                            </div>
                                        </div>
                                    }

                                })}
                            </div>
                        </div>
                    </>
                    }
                    {activeTab === 'tab-2' && <>

                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[400px] md:h-[460px] pt-2'>
                            <div className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between border-4 border-[#8cc73e]`}>
                                <div className='flex font-rubik font-[400] text-xl pr-10 py-1 content-start place-content-start mx-[-1px]'>
                                    <div className='text-center mx-2 text-[17px]'>{myPointRecord !== undefined && myPointRecord.rank > 100 ? '100+' : (myPointRecord?.rank !== undefined && myPointRecord?.rank)}</div>
                                    <div className='text-center content-center justify-center text-[17px]'>{myPointRecord !== undefined && myPointRecord.name}</div>
                                </div>
                                <div className='flex flex-row justify-start pr-2 py-1'>
                                    <div className='text-xl pr-5 text-[17px]'>{myPointRecord !== undefined && myPointRecord.point}</div>
                                    <img src={CoinImage} width='30px' height='30px' className='justify-end ml-1' />
                                </div>
                            </div>
                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll md:overflow-hidden bg-[#ffffff33]'>
                                {pointRanking.map((pointRank, index) => {
                                    if (index < 10) {
                                        return <div key={pointRank.name} className={`text-white flex flex-row leading-[89px] justify-between items-end content-end`}>
                                            <div className={`flex font-rubik font-[400] text-xl pr-10 pb-1`}>
                                                {/* <div className='pl-5 text-right font-[12px]'>{referralRank.rank}</div> */}
                                                <div className='px-3 text-[17px]'>{index + 1}</div>
                                                <div className={`${index < 9 ? 'pl-1' : 'pl-[-2px]'} text-[17px]`}>{pointRank.name}</div>
                                            </div>
                                            <div className='flex flex-row pb-1 justify-between px-1'>
                                                {/* <div className='text-xl pr-1 font-[10px]'>{pointRank.point}</div> */}
                                                <div className={`text-xl font-[10px] px-1`}>{pointRank.point}</div>
                                                <img src={CoinImage} width='30px' height='30px' className='flex' />
                                            </div>
                                        </div>
                                    }

                                })}
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>


            {/* <DemoEarnComponent
                dailyReward={dailyReward}
                setDailyReward={setDailyReward}
                MINI_APP_APP={MINI_APP_APP}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isTabbarLabels={isTabbarLabels}
                account={account}
            /> */}
        </div>
    )
}


// const DemoEarnComponent = ({ dailyReward, setDailyReward, MINI_APP_APP, activeTab, setActiveTab, isTabbarLabels, account }) => {
//     return (
//         <>

//         </>
//     )
// }

export default DemoRanking