// UIs
import Main from "@/components/layouts/Main";
import Create from "./Create";
import Filter from "./Filter";
import Posts from "./Posts";

const index = () => {
    return (
        <Main classNames="flex lg:flex-row flex-col lg:justify-between gap-5">
            <div className="lg:w-[30%]">
                <Filter />
            </div>
            <div className="w-full lg:w-[65%]">
                <Create />
                <Posts />
            </div>
        </Main>
    );
}

export default index;