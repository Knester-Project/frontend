// export function useAdminSuspendUser() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     // Accept page + limit alongside email/isSuspended
//     mutationFn: (variables: { email: string; isSuspended: boolean; page: number; limit: number }) => {
//       const { email, isSuspended } = variables;
//       return adminSuspendUser({ email, isSuspended }); // your API call
//     },

//     onSuccess: (variables) => {
//       // Invalidate just the one query that matches the page + limit
//       queryClient.invalidateQueries({
//         queryKey: ["allUsers", variables.page, variables.limit],
//       });
//     },

//     onError: (error) => {
//       console.error(`Couldn't suspend user:`, error);
//     },
//   });
// }