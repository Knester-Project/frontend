import { Route } from '@/routes/_auth/index'; 

import InviteOnly from "./InviteOnly";
import InviteValidation from "./InviteValidation";

const Home = () => {

    const { invite } = Route.useSearch();

    return (
        <>
            {!invite && <InviteOnly />}
            {invite && <InviteValidation invitationCode={invite} />}
        </>
    );
};

export default Home;
