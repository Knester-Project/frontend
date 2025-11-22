//Components
import Trending from "./Trending";
import CreatePost from "./CreatePost";
import PeopleAround from "./PeopleAround";

const index = () => {
    return (
        <main className="flex gap-x-5 px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-6">
            <section className="hidden xl:block xl:w-[25%]">
                <Trending />
            </section>
            <section className="w-full lg:w-[70%] xl:w-[50%]">
                <CreatePost />
            </section>
            <section className="hidden lg:block lg:w-[30%] xl:w-[25%]">
                <PeopleAround />
            </section>
        </main>
    );
}

export default index;