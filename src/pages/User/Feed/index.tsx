// UIs
import Trending from "./Trending";
import CreatePost from "../../../features/post/CreatePost";
import PeopleAround from "./PeopleAround";
import Posts from "./Posts";
import Advert from "./Advert";
import Messages from "./Messages";



const Index = () => {

    return (
        <section className="flex gap-x-5 lg:p-4 2xl:p-8 xl:p-6">
            <section className="hidden xl:block space-y-10 xl:w-[25%]">
                <Trending />
                <Advert />
            </section>
            <section className="w-full lg:w-[70%] xl:w-[50%]">
                <div className="p-2 lg:p-0">
                    <CreatePost />
                </div>
                <Posts />
            </section>
            <section className="hidden lg:block space-y-10 lg:w-[30%] xl:w-[25%]">
                <PeopleAround />
                <Messages />
            </section>
        </section>
    );
}

export default Index;