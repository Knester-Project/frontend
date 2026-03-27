// UIs
import Main from "@/components/Main";
import Trending from "./Trending";
import CreatePost from "./CreatePost";
import PeopleAround from "./PeopleAround";

const index = () => {
    return (
        <Main classNames="flex gap-x-5">
            <section className="hidden xl:block xl:w-[25%]">
                <Trending />
            </section>
            <section className="w-full lg:w-[70%] xl:w-[50%]">
                <CreatePost />
            </section>
            <section className="hidden lg:block lg:w-[30%] xl:w-[25%]">
                <PeopleAround />
            </section>
        </Main>
    );
}

export default index;