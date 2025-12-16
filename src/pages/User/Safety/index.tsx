// Components
import Create from "./Create";

const index = () => {
    return (
        <main className="flex gap-x-5 px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-6">
            <section className="hidden lg:block lg:w-[30%]">

            </section>
            <section className="w-full lg:w-[70%]">
                <Create />
            </section>
        </main>
    );
}

export default index;