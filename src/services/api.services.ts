import { axiosUnauthInstance } from './config';

//Check Username
export const checkUsername = async (username: string) => {
    const response = await axiosUnauthInstance.get(`users/checkUsername/${username}`);
    return response.data;
}

//Validate a User Referral
export const validateInvite = async (data: { invitationCode: string }) => {
    const response = await axiosUnauthInstance.post("users/validate", data);
    return response.data;
};
