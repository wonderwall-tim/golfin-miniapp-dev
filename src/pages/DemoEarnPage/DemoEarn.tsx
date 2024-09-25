import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CoinIcon from '../../assets/images/02_earn_coin.png'
import Countdown from '../../components/Countdown'
import { useUserContext } from '../../contexts/UserContext'
import WebApp from '@twa-dev/sdk'
import { Progress } from "@/components/ui/progress"
import { usePointContext } from '@/contexts/PointContext'
import { getPoint, updatePoint } from '@/apis/PointServices'
import { dailyCheckInPointReward, friendReferralPointReward, tenFriendsReferralPointReward, weeklyCheckInPointReward } from '@/constants'
import { useActivityContext } from '@/contexts/ActivityContext'
import { getActivity, updateActivity } from '@/apis/ActivityServices'
import { useFriendContext } from '@/contexts/FriendContext'
import { isYesterday, sgTimeNowByDayJs } from '@/utils'
import { format } from 'date-fns'

const MINI_APP_BOT_NAME = import.meta.env.VITE_MINI_APP_BOT_NAME
const MINI_APP_NAME = import.meta.env.VITE_MINI_APP_NAME
const MINI_APP_APP = `https://t.me/${MINI_APP_BOT_NAME}/${MINI_APP_NAME}/start?startapp=${WebApp.initDataUnsafe.user?.id}`

interface DemoEarnComponentProp {
    timeLeft: string,
    dailyReward: boolean,
    setDailyReward: Dispatch<SetStateAction<boolean>>,
    totalPointAmount: number,
    sgTime: string,
}


interface DemoDailyRewardComponentProp {
    timeLeft: string
    dailyReward: boolean,
    setDailyReward: Dispatch<SetStateAction<boolean>>,
    sgTime: string
}

interface DemoBonusComponentProp {
    weeklyCount?: number,
    referralCount?: number,
}

interface DemoFriendReferralComponentProp {
    referralCount?: number
}


const DemoEarn = () => {
    const { account } = useUserContext()
    const { point, setPoint, setIsWaitingPoint } = usePointContext()
    const { activity, setActivity, setIsWaitingActivity } = useActivityContext()
    const { friend, friendTrigger } = useFriendContext()
    const [dailyReward, setDailyReward] = useState(true)
    const [timeLeft, setTimeLeft] = useState("")
    const [totalPointAmount, setTotalPointAmount] = useState(0)
    const [referralCount, setReferralCount] = useState(0)
    const [canClaim, setCanClaim] = useState(false)
    const [sgTime, setSgTime] = useState(sgTimeNowByDayJs());

    useEffect(() => {
        const timer = setInterval(() => {
            setSgTime(sgTimeNowByDayJs());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const todayDay = new Date()
        const todayYY = todayDay.getFullYear()
        const todayMM = todayDay.getUTCMonth() + 1
        const preTodayMM = todayMM < 10 ? `0${todayMM}` : todayMM
        const todayDD = todayDay.getDate() + 1
        const todayYYMMDD = `${todayYY}-${preTodayMM}-${todayDD}T00:00:00`
        setTimeLeft(todayYYMMDD)
    }, [new Date()])


    useEffect(() => {
        if (point?.login_amount || point?.referral_amount) {
            setTotalPointAmount(totalPointAmount + point?.login_amount + point?.referral_amount)
        }
    }, [point?.login_amount, point?.login_amount])

    useEffect(() => {
        const handleWeeklyReward = async () => {
            if (!activity?.login_streak || activity?.login_streak !== 7) return; // Early exit if not a streak of 7

            setIsWaitingPoint(true);
            setIsWaitingActivity(true);

            try {// Fetch existing point and update if necessary
                // const existingPoint = await getPoint({ access_token: '', user_id: account?.id });
                if (point) {
                    const updatePointPayload = {
                        id: point.id,
                        type: 'add', // REVIEW: add / minus point
                        access_token: '',
                        point_payload: {
                            login_amount: weeklyCheckInPointReward, // extra_profit_per_hour: optional
                        },
                    };
                    const updatedPoint = await updatePoint(updatePointPayload);
                    if (updatedPoint && updatedPoint?.point_base.user_id) {
                        setPoint(updatedPoint.point_base.point)
                        /* {
                            id: updatedPoint?.point_base.user_id,
                            login_amount: updatedPoint?.point_base.point.login_amount,
                            referral_amount: updatedPoint?.point_base.point.referral_amount,
                            extra_profit_per_hour: updatedPoint?.point_base.point.extra_profit_per_hour,
                            created_at: updatedPoint?.point_base.point.created_at,
                            updated_at: updatedPoint?.point_base.point.updated_at,
                            custom_logs: updatedPoint?.point_base.point.custom_logs
                        } */
                    }
                }
                if (activity) {
                    const updateActivityPayload = { // Update activity data (assuming login streak reset)
                        id: activity?.id,
                        access_token: '',
                        user_id: account?.id,
                        activity: {
                            logged_in: true, // Update logged_in state
                            login_streak: 1, // Reset login streak
                            total_logins: activity?.total_logins + 1, // Increment total logins
                            last_action_time: sgTime /* sgTimeNowByDayJs(), */
                        },
                    };
                    const updatedActivity = await updateActivity(updateActivityPayload);
                    setActivity(updatedActivity?.activity);
                }
            } catch (error) {
                console.error('Error handling weekly reward:', error);
            } finally {
                setIsWaitingPoint(false);
                setIsWaitingActivity(false);
            }
        };

        handleWeeklyReward(); // Call the function on component mount
    }, [activity?.login_streak]); // Only re-run when login_streak changes

    useEffect(() => {
        const handleReferralReward = async () => {

            if (!friendTrigger || friendTrigger % 10 !== 0) return; // Early exit if not a multiple of 10 or already claimed
            setIsWaitingPoint(true);

            try {
                if (canClaim) {
                    if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
                        if (point) {
                            setPoint({
                                id: point?.id,
                                login_amount: 0,
                                referral_amount: tenFriendsReferralPointReward,
                                extra_profit_per_hour: point.extra_profit_per_hour,
                                created_at: point?.created_at,
                                updated_at: point?.updated_at,
                                custom_logs: {
                                    action: `claim${friendTrigger / 10}`,
                                    date: new Date().toISOString()
                                }
                            })
                            console.log(point);
                        }
                    }

                    const existingPoint = await getPoint({ access_token: '', user_id: account?.id }); // Fetch existing point and update if necessary

                    if (point) {
                        const dbPointAction = existingPoint?.point_base?.point?.custom_logs?.action.split('claim')[1]
                        if (dbPointAction) {
                            if (friendTrigger / 10 != parseInt(dbPointAction)) {
                                const updatePointPayload = {
                                    id: existingPoint?.point_base.point.id,
                                    type: 'add', // REVIEW: add / minus point
                                    access_token: '',
                                    point_payload: {
                                        referral_amount: 3000, // extra_profit_per_hour: optional
                                    },
                                };
                                const updatedPoint = await updatePoint(updatePointPayload);
                                if (updatedPoint && updatedPoint?.point_base.user_id) {
                                    setPoint({
                                        id: updatedPoint?.point_base.user_id,
                                        login_amount: updatedPoint?.point_base.point.login_amount,
                                        referral_amount: updatedPoint?.point_base.point.referral_amount,
                                        extra_profit_per_hour: updatedPoint?.point_base.point.extra_profit_per_hour,
                                        created_at: updatedPoint?.point_base.point.created_at,
                                        updated_at: updatedPoint?.point_base.point.updated_at,
                                        custom_logs: updatedPoint?.point_base.point.custom_logs
                                    })
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling referral reward:', error);
            } finally {
                setIsWaitingPoint(false);
            }
        };

        handleReferralReward(); // Call the function on component mount
    }, [friendTrigger])

    useEffect(() => {
        const checkActionOnPoint = () => {
            if (point) {
                if (point?.custom_logs?.action) {
                    const dbPointAction = point.custom_logs?.action.split('claim')[1]
                    if (dbPointAction) {
                        if (referralCount / 10 != parseInt(dbPointAction))
                            return true
                    }
                } else {
                    return true
                }
            }
        }

        if (checkActionOnPoint() == true) {
            setCanClaim(true)
        }
    }, [])

    return (
        <div className='w-[100%] h-[690px]'>
            <DemoEarnComponent
                timeLeft={timeLeft}
                dailyReward={dailyReward}
                setDailyReward={setDailyReward}
                // MINI_APP_APP={MINI_APP_APP}
                // point={point}
                totalPointAmount={totalPointAmount}
                sgTime={sgTime}
            />
            <DemoBonusComponent
                weeklyCount={activity?.login_streak} // using cont 7 day count
                referralCount={canClaim ? friendTrigger : 0} />
        </div>
    )
}

const DemoEarnComponent = ({ timeLeft, dailyReward, setDailyReward, /* MINI_APP_APP */ totalPointAmount, sgTime }: DemoEarnComponentProp) => {
    return (
        <>
            <div className="w-[343px] h-[85px] sm:h-[95px] md:h-[105px] bg-[#ffffff33] rounded-lg flex justify-center content-center items-center mx-auto">
                <img className="w-[53px] h-[54px]" alt="Layer" src={CoinIcon} />
                <div className="w-[200px] text-white font-semibold [font-family:'Rubik-Medium',Helvetica]text-[#ffef2b] text-[28px] tracking-[0.38px]">
                    {totalPointAmount ? totalPointAmount.toLocaleString() : 0}
                </div>
            </div>
            <div className='flex justify-center justify-items-center mx-5 sm:mx-5 md:mx-6 pt-3 sm:pt-3  space-x-5'>
                <DemoDailyRewardComponent
                    timeLeft={timeLeft}
                    dailyReward={dailyReward}
                    setDailyReward={setDailyReward}
                    sgTime={sgTime}
                />
                <DemoReferralComponent /* MINI_APP_APP={MINI_APP_APP} */ />
            </div>
        </>
    )
}


const DemoDailyRewardComponent = ({ timeLeft, dailyReward, setDailyReward, sgTime }: DemoDailyRewardComponentProp) => {
    const { setPoint, setIsWaitingPoint, point } = usePointContext()
    const { account } = useUserContext()
    const { setActivity, activity, setIsWaitingActivity } = useActivityContext()
    const [allowed, setAllowed] = useState(true)
    const [clicked, setIsClicked] = useState(false)

    useEffect(() => {
        if (import.meta.env.VITE_MINI_APP_ENV == 'test' && activity?.last_login_time) {
            // const sgTimeNowString = sgTimeNowByDayJs()
            // console.log(sgTimeNowString);
            console.log(sgTime);

            const activityCheck = activity?.last_login_time.split('T')[0] == sgTime.split('T')[0]
            if (activityCheck == true || clicked == true) {
                setAllowed(false)
            }
        } else {
            if (activity?.last_login_time !== null && activity?.last_login_time !== undefined) {
                setIsClicked(true)
                // const sgTimeNowString = sgTimeNowByDayJs()
                const activityCheck = activity?.last_login_time.split('T')[0] === sgTime.split('T')[0]

                if (activityCheck == true || clicked == true) {
                    setAllowed(false)
                }
            }
        }
    }, [activity?.last_action_time])

    const handleCheckInDailyReward = async () => {
        setIsWaitingActivity(true)
        if (activity) {     // check if last login date was just yesterday
            const updateActivityPayload = activity?.last_login_time && isYesterday(new Date(format(activity?.last_login_time.split('T')[0], 'yyyy-MM-dd'))) ?
                {
                    id: activity.id,
                    user_id: account?.id,
                    access_token: '',
                    activity: {
                        logged_in: false,
                        login_streak: activity.login_streak += 1,
                        total_logins: activity.total_logins += 1,
                        last_action_time: sgTime,
                        last_login_time: sgTime
                    }
                } : {
                    id: activity?.id,
                    access_token: '',
                    user_id: account?.id,
                    activity: {
                        logged_in: false,
                        login_streak: 1,
                        total_logins: activity.total_logins += 1,
                        last_action_time: sgTime,
                        last_login_time: sgTime
                    }
                }
            const dbActivity = await updateActivity(updateActivityPayload)
            if (dbActivity) {
                setActivity(dbActivity.activity)
                /*  {
                     id: dbActivity.activity.id,
                     logged_in: dbActivity.activity.logged_in,
                     login_streak: dbActivity.activity.login_streak,
                     total_logins: dbActivity.activity.total_logins,
                     last_action_time: dbActivity.activity.last_action_time,
                     last_login_time: dbActivity.activity.last_login_time,
                     created_at: dbActivity.activity.created_at,
                     updated_at: dbActivity.activity.updated_at,
                     custom_logs: dbActivity.activity.custom_logs,
                 } */
                setIsWaitingActivity(false)
            }
        }

        setIsWaitingPoint(true)

        // const existingPoint = await getPoint({
        //     access_token: '',
        //     user_id: account?.id,
        // })
        if (point) {
            const updatePointPayload = {
                id: point.id,
                type: 'add',
                access_token: '',
                point_payload: {
                    login_amount: dailyCheckInPointReward,
                }
            }
            const dbPoint = await updatePoint(updatePointPayload)

            if (dbPoint && dbPoint?.point_base.user_id) {
                setPoint(dbPoint.point_base.point)
                // {
                //     id: dbPoint?.point_base.user_id,
                //     login_amount: dbPoint?.point_base.point.login_amount,
                //     referral_amount: dbPoint?.point_base.point.referral_amount,
                //     extra_profit_per_hour: dbPoint?.point_base.point.extra_profit_per_hour,
                //     created_at: dbPoint?.point_base.point.created_at,
                //     updated_at: dbPoint?.point_base.point.updated_at,
                //     custom_logs: dbPoint?.point_base.point.custom_logs
                // }
                setIsWaitingPoint(false)
            }
        }

        // setDailyReward(false)
    }
    // console.log('allow ', allowed);

    return (
        <div className={`h-[100px] cursor-pointer ${allowed != true && 'pointer-events-none'}`}
            aria-disabled={allowed != true}
            onClick={() => { // FIXME: add daily check in boolean field on each day on backend table 
                if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
                    setIsClicked(true)
                    setIsWaitingActivity(true)
                    setActivity({
                        id: 1,
                        logged_in: false,
                        login_streak: 1,
                        total_logins: 1,
                        last_action_time: sgTime,
                        last_login_time: sgTime,
                        created_at: sgTime,
                        updated_at: sgTime,
                    })
                    setIsWaitingPoint(true)
                    setPoint({
                        id: 1,
                        login_amount: 2,
                        referral_amount: 0,
                        extra_profit_per_hour: 0,
                        created_at: sgTime,
                        updated_at: sgTime,
                    })
                } else {
                    setIsClicked(true)
                    handleCheckInDailyReward()
                }


            }}>
            <div className='text-center w-[100%] h-[80px]'>
                <div className={`relative w-[160px] h-14 rounded-[6px_6px_0px_0px] 
                ${allowed == true ? "[background:linear-gradient(180deg,rgb(169,231,29)_0%,rgb(94.04,196.56,89.27)_100%)]" :
                        "[background:radial-gradient(50%_50%_at_50%_50%,rgb(112.62,108.57,77.9)_0%,rgb(119,102.27,78.84)_100%)]"}`}>
                    {allowed == true ? <div className="absolute w-[77px] top-[7px] left-[40px] [font-family:'Roboto-Medium',Helvetica] font-medium text-[#ffffff] text-xl text-center tracking-[0] leading-[22px]">
                        Daily
                        <br />
                        Reward
                    </div> :
                        <div className="absolute w-[123px] top-[7px] left-[19px] [font-family:'Roboto-Medium',Helvetica] font-medium text-[#ffffff] text-xl text-center tracking-[0] leading-[22px]"
                        >
                            Daily Reward
                            <br />
                            <Countdown targetDate={timeLeft}  /* dailyReward={dailyReward} setDailyReward={setDailyReward} */ />
                        </div>
                    }

                </div>

                <div className='bg-white text-black-400 rounded-b-sm border-white h-[50%] content-center text-center items-center w-[160px]'>
                    + {`${dailyCheckInPointReward}`}
                </div>
            </div>

        </div >

    )

}

const DemoReferralComponent = ({ /* MINI_APP_APP */ }) => {
    return (

        <div className={`h-[100px] cursor-pointer`}
            onClick={() => {
                WebApp.openTelegramLink(`https://t.me/share/url?url=${MINI_APP_APP}`)
            }}>
            <div className='text-center w-[100%] h-[80px]'>
                <div className="relative w-[160px] h-14 rounded-[6px_6px_0px_0px] [background:linear-gradient(180deg,rgb(169,231,29)_0%,rgb(94.04,196.56,89.27)_100%)]">
                    <div className="absolute w-[77px] top-[7px] left-[46px] [font-family:'Roboto-Medium',Helvetica] font-medium text-[#ffffff] text-xl text-center tracking-[0] leading-[22px]">
                        Invite
                        <br />
                        a Friend
                    </div>
                </div>
                <div className='bg-white text-black-400 rounded-b-sm border-white h-[50%] content-center text-center items-center w-[160px]'>
                    + {`${friendReferralPointReward}`}
                </div>
            </div>

        </div>

    )
}


const DemoBonusComponent = ({ weeklyCount, referralCount }: DemoBonusComponentProp) => {
    return (
        <div className='relative'>
            <div className='grid grid-rows-1 justify-items-center'>
                <div className="[font-family:'Rubik-Regular',Helvetica]
                font-normal
                mx-auto
                text-white
                text-start
                text-[28px]
                tracking-[-0.38px]
                leading-[34px]
                whitespace-nowrap
                content-start
                pr-[285px]
                pb-2 
                text-xl">Bonus</div>
                <div className="w-[342px] h-14 bg-[rgba(255,255,255,1.0)] rounded-md overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgb(112.62,108.57,77.9)_0%,rgb(119,102.27,78.84)_100%)] relative mb-5">
                    <Progress className="[&>*]:[background:radial-gradient(50%_50%_at_50%_50%,rgb(255,225.25,0)_0%,rgb(255,148.75,0)_100%)]
                    h-14
                    rounded-[6px_0px_0px_0px]"
                        value={weeklyCount && weeklyCount / 7 * 100}
                        max={7} />
                    <div className="relative w-[342px] h-14">
                        <div className="absolute h-14 top-0 left-0 rounded-[6px_0px_0px_0px] [background:radial-gradient(50%_50%_at_50%_50%,rgb(255,225.25,0)_0%,rgb(255,148.75,0)_100%)]" />
                        <div className="absolute w-[295px] top-[18px] left-[23px] [font-family:'Roboto-Black',Helvetica] font-normal text-[#ffffff] text-base text-center tracking-[0] leading-[normal]">
                            <div className="absolute w-[98px] h-14 top-0 left-0 " />
                        </div>

                    </div>
                    <p className="absolute w-[295px] top-[18px] left-[23px] [font-family:'Roboto-Black',Helvetica] font-normal text-[#ffffff] text-base text-center tracking-[0] leading-[normal]">
                        <span className="font-black">+ {`${weeklyCheckInPointReward}`} </span>
                        <span className="[font-family:'Roboto-Medium',Helvetica] font-medium">
                            points for login every day for a week
                        </span>
                    </p>
                </div>
                <DemoFriendReferralComponent referralCount={referralCount} />
            </div>
        </div >

    )
}

const DemoFriendReferralComponent = ({ referralCount }: DemoFriendReferralComponentProp) => {
    return (
        <div className="w-[342px] h-14 bg-[rgba(255,255,255,1.0)] rounded-md overflow-hidden [background:radial-gradient(50%_50%_at_50%_50%,rgb(112.62,108.57,77.9)_0%,rgb(119,102.27,78.84)_100%)] relative mb-5">
            <Progress className="[&>*]:[background:radial-gradient(50%_50%_at_50%_50%,rgb(255,225.25,0)_0%,rgb(255,148.75,0)_100%)] h-14 rounded-[6px_0px_0px_0px]"
                value={referralCount && referralCount / 10 * 100}
                max={10} />
            <div className="relative w-[342px] h-14">
                <div className="absolute h-14 top-0 left-0 rounded-[6px_0px_0px_0px] [background:radial-gradient(50%_50%_at_50%_50%,rgb(255,225.25,0)_0%,rgb(255,148.75,0)_100%)]" />
                <div className="absolute w-[295px] top-[18px] left-[23px] [font-family:'Roboto-Black',Helvetica] font-normal text-[#ffffff] text-base text-center tracking-[0] leading-[normal]">
                    <div className="absolute w-[98px] h-14 top-0 left-0 " />
                </div>
            </div>
            <p className="absolute w-[269px] top-[18px] left-9 [font-family:'Roboto-Black',Helvetica] font-normal text-[#ffffff] text-base text-center tracking-[0] leading-[normal]">
                <span className="font-black">+ {`${tenFriendsReferralPointReward}`} </span>
                <span className="[font-family:'Roboto-Medium',Helvetica] font-medium">
                    points for every 10 people
                </span>
            </p>

        </div >
    )

}
export default DemoEarn