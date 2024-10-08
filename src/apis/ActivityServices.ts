import {
    ActivityCreateRequestType,
    ActivityCreateResponseType,
    ActivityRetrievalRequestType,
    ActivityRetrievalResponseType,
    ActivityUpdateRequestType,
    ActivityUpdateResponseType,
} from '@/type';
import api from './api';


// ACTIVITY CREATION
export async function createActivity(activityCreate: ActivityCreateRequestType): Promise<ActivityCreateResponseType | undefined> {
    try {
        api.defaults.headers.put['Content-Type'] = 'application/json'
        // console.log('activityCreate');
        // console.log(activityCreate);

        const dbActivity = await api.post('/activity/create', activityCreate);
        if (dbActivity.status == 500 || dbActivity.status == 400) { // force user to the main page relogin again         
            return undefined
        }
        else {
            const dbUserData = await dbActivity.data
            return dbUserData
        }
    } catch (error) {
        console.log(error)
        return undefined
    }

}

// ACTIVITY RETRIEVAL
export async function getActivity(activityRetrieval: ActivityRetrievalRequestType): Promise<ActivityRetrievalResponseType | undefined> {
    try {
        const qs = []
        for (const [key, val] of Object.entries(activityRetrieval)) {
            if (val !== undefined && val !== null) {
                qs.push(`${key}=${encodeURIComponent(val)}`)
            }
        }
        const queryString = qs.length > 0 ? `?${qs.join('&')}` : '';

        const dbActivity = await api.get(`/activity/detail/${queryString}`)
        const dbActivityData = await dbActivity.data
        return dbActivityData
    } catch (error) {
        console.log(error)
        return undefined
    }
}


// ACTIVITY UPDATING
export async function updateActivity(activityUpdate: ActivityUpdateRequestType): Promise<ActivityUpdateResponseType | undefined> {
    try {
        const dbActivity = await api.put('/activity/update', activityUpdate);
        const dbActivityData = await dbActivity.data;
        return dbActivityData
    } catch (error) {
        console.error('Error updating activity:', error);
        return undefined
    }
}

