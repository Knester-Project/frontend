// Components
import Create from "./Create";
import Filter from "./Filter";

const index = () => {
    return (
        <main className="flex lg:flex-row flex-col gap-5 px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-6">
            <section className="lg:w-[30%]">
                <Filter />
            </section>
            <section className="w-full lg:w-[70%]">
                <Create />
            </section>
        </main>
    );
}

export default index;