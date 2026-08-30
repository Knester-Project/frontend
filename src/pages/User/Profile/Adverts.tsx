import AdvertCard from "@/features/advert/AdvertCard";

const Adverts = ({ adverts, isOwner }: { adverts: MyAdvert[], isOwner: boolean }) => {

    return (
        <main>
            {adverts.length > 0 ? (
                <div className="gap-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {adverts.map((advert) => (
                        <AdvertCard key={advert._id} advert={advert} isOwner={isOwner} />
                    ))}
                </div>
            ) : (
                <div className="bg-primary/10 py-12 text-center">
                    <p className="text-primary">No adverts found.</p>
                </div>
            )}
        </main>
    );
}

export default Adverts;