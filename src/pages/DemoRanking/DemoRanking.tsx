import { useState } from 'react'
import { TabbarLink } from 'konsta/react'

import { mockPointRankingData, mockReferralRankingData } from '@/constants'
import CoinImage from '../../assets/images/02_earn_coin.png'

const DemoRanking = () => {
    const [dailyReward, setDailyReward] = useState(true)
    const [activeTab, setActiveTab] = useState('tab-1');
    const [isTabbarLabels, setIsTabbarLabels] = useState(true);
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
                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[300px] md:h-[460px] pt-2'>
                            <div className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between border-4 border-[#8cc73e]`}>
                                <div className='flex font-rubik font-[600] text-xl pr-10 py-1 content-start place-content-start'>
                                    <div className='text-right mx-2'>100+</div>
                                    <div className='text-right'>Dev</div>
                                </div>
                                <div className='flex flex-row justify-start pr-5 py-1'>
                                    <div className='text-xl pr-5'>30</div>
                                    <img src={CoinImage} width='30px' height='30px' className='justify-end ml-1' />
                                </div>
                            </div>
                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll  md:overflow-hidden'>

                                {mockReferralRankingData.map((mockReferral, index) => {
                                    if (index < 10) {
                                        return <div key={mockReferral.name} className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between`}>
                                            <div className='flex font-rubik font-[600] text-xl pr-10 pb-1 content-start place-content-start'>
                                                <div className='pl-5 text-right'>{mockReferral.rank}</div>
                                                <div className={`${index < 9 ? 'pl-7' : 'pl-5'} text-right`}>{mockReferral.name}</div>
                                            </div>
                                            <div className='flex flex-row justify-start pr-5 pb-1'>
                                                <div className='text-xl pr-5'>{mockReferral.referral}</div>
                                                <img src={CoinImage} width='30px' height='30px' className='justify-end' />
                                            </div>
                                        </div>
                                    }

                                })}
                            </div>
                        </div>
                    </>
                    }
                    {activeTab === 'tab-2' && <>
                        <div className='h-[300px] w-[343px] overflow-y-scroll sm:h-[300px] md:h-[460px] pt-2'>
                            <div className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between border-4 border-[#8cc73e]`}>
                                <div className='flex font-rubik font-[600] text-xl pr-10 py-1 content-start place-content-start'>
                                    <div className='text-right mx-2'>100+</div> {/* FIXME */}
                                    <div className='text-right'>Dev</div>  {/* FIXME */}
                                </div>
                                <div className='flex flex-row justify-start pr-5 py-1'>
                                    <div className='text-xl pr-5'>100000</div>  {/* FIXME */}
                                    <img src={CoinImage} width='30px' height='30px' className='justify-end' />
                                </div>
                            </div>

                            <div className='sm:h-[250px] md:h-[400px] overflow-y-scroll md:overflow-hidden'>

                                {mockPointRankingData.map((mockPoint, index) => {
                                    if (index < 10) {
                                        return <div key={mockPoint.name} className={`text-white bg-[#ffffff33] flex flex-row leading-[89px] justify-between`}>
                                            <div className='flex font-rubik font-[600] text-xl pr-10 pb-1 content-start place-content-start'>
                                                <div className='pl-5 text-right'>{mockPoint.rank}</div>
                                                <div className={`${index < 9 ? 'pl-7' : 'pl-5'} text-right`}>{mockPoint.name}</div>
                                            </div>
                                            <div className='flex flex-row justify-start pr-5 pb-1  font-rubik font-[600] text-xl content-start place-content-start'>
                                                <div className='text-xl pr-5'>{mockPoint.point}</div>
                                                <img src={CoinImage} width='30px' height='30px' className='justify-end' />
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