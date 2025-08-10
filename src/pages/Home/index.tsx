import { useSearchParams } from "react-router";

//Components
import InviteOnly from "../Home/InviteOnly";

const Index = () => {

    const [searchParams] = useSearchParams();
    const invite = searchParams.get("invite")

    return (
        <>
            {invite === null && <InviteOnly />}
        </>
    );
}

export default Index;