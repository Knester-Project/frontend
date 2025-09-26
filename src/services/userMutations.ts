import { useMutation } from "@tanstack/react-query";

//Functions
import { authenticateUser, createUser, validateInvite } from "./api.services";


//Validate Users
export function useValidateUser() {

    return useMutation({
        mutationFn: (data: { invitationCode: string }) => validateInvite(data),
        onError: (error) => {
            console.error("Validation failed:", error);
        },
    })
}

//Create User
export function useCreateUser() {

    return useMutation({
        mutationFn: (data: { username: string, password: string, referrer: string }) => createUser(data),
        onError: (error) => {
            console.error("Create User failed:", error);
        },
    })
}

//Authenticate User
export function useAuthUser() {

    return useMutation({
        mutationFn: (data: { username: string, password: string }) => authenticateUser(data),
        onError: (error) => {
            console.error("User Authentication failed:", error);
        },
    })
}