import { useEffect } from "react";

// Libs
import { useLocationManager } from "@/lib/location/manager";

// UIs
import Main from "@/components/Main";
import Trending from "./Trending";
import CreatePost from "./CreatePost";
import PeopleAround from "./PeopleAround";
import Posts from "./Posts";
import Advert from "./Advert";



const Index = () => {

    const { ensureFreshLocation } = useLocationManager()

    useEffect(() => {
        const handleLocation = async () => {
            try {
                await ensureFreshLocation();
            } catch (error) {
                console.error("Location check failed", error);
            }
        };

        handleLocation();
    }, [ensureFreshLocation])

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
            </section>
        </Main>
    );
}

export default Index;