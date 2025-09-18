import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function IndexPage() {

    const [veggiesToShow, setVeggiesToShow] = useState<string[]>(["Cabbage", "Squash", "Peppers, Bell Type", "Broccoli"]);


    type VegResult = {
        market_location_city: string;
        commodity: string;
        item_size: string;
        pkg: string;
        low_price: string;
        high_price: string;
        report_date: string;
    };

    type outletContextType = {
        vegReports: { results: VegResult[] }[];
        loading: boolean;
    };
    const { vegReports, loading } = useOutletContext<outletContextType>()

    const commodityDisplayName = (commodity: string) => {
        switch (commodity) {
            case "Cabbage":
                return "Chou";
            case "Squash, Zucchini":
                return "Zucchini";
            case "Squash, Yellow Straightneck":
                return "Courgette Jaune";
            case "Peppers, Bell Type":
                return "Poivron";
            case "Broccoli":
                return "Brocoli";
            default:
                return commodity;
        }
    }



    return (
        <section className="w-[min(100%,_70rem)]  flex flex-col items-center px-[0.75rem] gap-[1rem]">

            {loading ? (
                <p>Loading...</p>
            ) : vegReports.length === 0 ||
                vegReports.every((report) => report.results.length === 0) ? (
                <p>Les rapports pour la date sélectionnée ne sont pas disponibles</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-[0.5rem] w-[min(76%,_40rem)] lg:text-[1.2rem] lg:gap-x-[10rem] ">
                        <div className="relative flex justify-between">
                            <label htmlFor="cabbage">Choux</label>
                            <input onChange={(e) => setVeggiesToShow(e.target.checked ? [...veggiesToShow, "Cabbage"] : veggiesToShow.filter((kw) => kw !== "Cabbage"))} checked={veggiesToShow.includes("Cabbage")} className="accent-green-700 w-[1rem]" id="cabbage" type="checkbox" />

                        </div>
                        <div className="relative flex justify-between">
                            <label htmlFor="squash">Courgettes</label>
                            <input onChange={(e) => setVeggiesToShow(e.target.checked ? [...veggiesToShow, "Squash"] : veggiesToShow.filter((kw) => kw !== "Squash"))} checked={veggiesToShow.includes("Squash")} className="accent-green-700 w-[1rem]" id="squash" type="checkbox" />

                        </div>
                        <div className="relative flex justify-between">
                            <label htmlFor="peppers">Poivrons</label>
                            <input onChange={(e) => setVeggiesToShow(e.target.checked ? [...veggiesToShow, "Peppers, Bell Type"] : veggiesToShow.filter((kw) => kw !== "Peppers, Bell Type"))} checked={veggiesToShow.includes("Peppers, Bell Type")} className="accent-green-700 w-[1rem]" id="peppers" type="checkbox" />

                        </div>
                        <div className="relative flex justify-between">
                            <label htmlFor="broccoli">Brocolis</label>
                            <input onChange={(e) => setVeggiesToShow(e.target.checked ? [...veggiesToShow, "Broccoli"] : veggiesToShow.filter((kw) => kw !== "Broccoli"))} checked={veggiesToShow.includes("Broccoli")} className="accent-green-700 w-[1rem]" id="broccoli" type="checkbox" />

                        </div>

                    </div>
                    <ul className="flex flex-col lg:grid lg:grid-cols-2  gap-[0.25rem] w-[min(100%,_40rem)] lg:w-full">
                        {vegReports.flatMap((report, idx) =>
                            report.results
                                .filter((result) =>
                                    veggiesToShow.some((kw: string) =>
                                        result.commodity.includes(kw)
                                    )
                                )
                                .map((result, rIdx) => (
                                    <li className=" relative flex flex-col gap-[0.5rem] bg-white p-[0.5rem] pb-[1.2rem] lg:py-[2rem] rounded-[0.75rem] border-4 border-green-400 border-solid" key={`${idx}-${rIdx}`}>
                                        <h3 className="text-center lg:text-[1.1rem]"><strong>{result.market_location_city}</strong>:</h3>{" "}
                                        <div className="lg:flex items-center gap-[2rem]">
                                            <p className="text-[1.3rem] lg:text-[1.5rem] font-bold" >{commodityDisplayName(result.commodity)}</p>
                                            <p>({result.item_size}, {result.pkg})</p>
                                        </div>
                                        <div className="flex">
                                            <p> <span className="text-[1.2rem] font-bold">Bas: </span> ${Number(result.low_price).toFixed(2)}usd, &nbsp;</p>
                                            <p> <span className="text-[1.2rem] font-bold">Haut: </span>  ${Number(result.high_price).toFixed(2)}usd</p>
                                        </div>
                                        <p className="text-[0.8rem] absolute bottom-0 right-1" >{result.report_date}</p>
                                    </li>
                                ))
                        )}
                    </ul>
                </>
            )}
        </section>
    );
}

export default IndexPage;