import { useQuery } from "@tanstack/react-query";

// API endpoints
import { checkUsername } from "./api.services";


// Get Account Number Details
export function CheckUsername(username: string){
    return useQuery({
        queryKey: ['checkedUsername'],
        queryFn: () => checkUsername(username),
        enabled: username.trim().length > 5,
    })
}