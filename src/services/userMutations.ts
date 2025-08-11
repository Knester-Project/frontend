import { useMutation } from "@tanstack/react-query";

//Functions
import { createUser, validateInvite } from "./api.services";


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
