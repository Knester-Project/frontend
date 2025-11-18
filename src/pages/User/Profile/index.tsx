import { Route } from "@/routes/_dashboard/profile";

const Index = () => {

    const { profile } = Route.useSearch();
    console.log("The Profile", profile)

    return ( 
        <main>
            
        </main>
     );
}
 
export default Index;