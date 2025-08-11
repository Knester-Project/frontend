import { useMutation } from "@tanstack/react-query";

//Functions
import { validateInvite } from "./api.services";


//Validate Users
export function useValidateUser() {

    return useMutation({
        mutationFn: (data: { invitationCode: string }) => validateInvite(data),
        onError: (error) => {
            console.error("Validation failed:", error);
        },
    })
}
