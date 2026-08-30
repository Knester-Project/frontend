// UIs
import Main from "@/components/layouts/Main";
import Trending from "./Trending";
import CreatePost from "../../../features/post/CreatePost";
import PeopleAround from "./PeopleAround";
import Posts from "./Posts";
import Advert from "./Advert";
import Messages from "./Messages";



const Index = () => {

    return (
        <Main classNames="flex gap-x-5">
            <section className="hidden xl:block space-y-10 xl:w-[25%]">
                <Trending />
                <Advert />
            </section>
            <section className="w-full lg:w-[70%] xl:w-[50%]">
                <CreatePost />
                <Posts />
            </section>
            <section className="hidden lg:block space-y-10 lg:w-[30%] xl:w-[25%]">
                <PeopleAround />
                <Messages />
            </section>
        </Main>
    );
}

export default Index;