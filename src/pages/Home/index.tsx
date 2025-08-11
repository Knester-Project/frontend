import { useSearchParams } from "react-router";

//Components
import InviteOnly from "../Home/InviteOnly";
import InviteValidation from "./InviteValidation";

const Index = () => {

    const [searchParams] = useSearchParams();
    const invite = searchParams.get("invite")

    return (
        <>
            {invite === null && <InviteOnly />}
            {invite !== null && <InviteValidation invitationCode={invite} />}
        </>
    );
}

export default Index;