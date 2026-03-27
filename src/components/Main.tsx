const Main = ({ children, classNames }: { children: React.ReactNode, classNames?: string }) => {
    return ( 
        <main className={`px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-6 ${classNames}`}>
            {children}
        </main>
     );
}
 
export default Main;