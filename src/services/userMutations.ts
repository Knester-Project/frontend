import { useMutation, useQueryClient } from "@tanstack/react-query";

//Functions
import { authenticateUser, createUser, validateInvite } from "./api.services";

//Schemas
import type { AuthInput } from "@/schemas/auth.schema";

//Libs
import { setUserToken } from "@/lib/token";


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
        }
    })
}

//Authenticate User
export function useAuthUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AuthInput) => authenticateUser(data),
        onError: (error) => {
            console.error("User Authentication failed:", error);
        },
        onSuccess: async (response) => {
            setUserToken(response.data.accessToken);
            queryClient.invalidateQueries();
        }
    })
}