import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Variete() {
    type vegInfo = {
        commodity: string;
        lo_prices: number[];
        hi_prices: number[];
    };

    const [cabbageInfo, setCabbageInfo] = useState<vegInfo>({ commodity: "Chou", lo_prices: [], hi_prices: [] });
    const [squashZuchInfo, setSquashZuchInfo] = useState<vegInfo>({ commodity: "Zucchini", lo_prices: [], hi_prices: [] });
    const [squashYlwInfo, setSquashYlwInfo] = useState<vegInfo>({ commodity: "Courgette Jaune", lo_prices: [], hi_prices: [] });
    const [pepperInfo, setPepperInfo] = useState<vegInfo>({ commodity: "Poivron", lo_prices: [], hi_prices: [] });
    const [broccoliInfo, setBroccoliInfo] = useState<vegInfo>({ commodity: "Brocoli", lo_prices: [], hi_prices: [] });
    const [cauliflowerInfo, setCauliflowerInfo] = useState<vegInfo>({ commodity: "Chou-fleur", lo_prices: [], hi_prices: [] });
    const [brusselsInfo, setBrusselsInfo] = useState<vegInfo>({ commodity: "Choux de Bruxelles", lo_prices: [], hi_prices: [] });

    type VegResult = {
        market_location_city: string;
        commodity: string;
        item_size: string;
        pkg: string;
        low_price: string;
        high_price: string;
        organic: string;
    };

    type outletContextType = {
        vegReports: { results: VegResult[] }[];
        loading: boolean;
    };

    const { vegReports, loading } = useOutletContext<outletContextType>();

    // ⬇️ New useEffect that filters organics & avoids accumulation
    useEffect(() => {
        const commodityMap: Record<string, string> = {
            "Cabbage": "Chou",
            "Squash, Zucchini": "Zucchini",
            "Squash, Yellow Straightneck": "Courgette Jaune",
            "Peppers, Bell Type": "Poivron",
            "Broccoli": "Brocoli",
            "Cauliflower": "Chou-fleur",
            "Brussels Sprouts": "Choux de Bruxelles",
        };

        const freshState: Record<string, { lo_prices: number[]; hi_prices: number[] }> = {};
        Object.values(commodityMap).forEach((display) => {
            freshState[display] = { lo_prices: [], hi_prices: [] };
        });

        vegReports
            .flatMap((report) => report.results)
            .filter((result) => result.organic?.toUpperCase() !== "Y")
            .forEach((result) => {
                const displayName = commodityMap[result.commodity];
                if (displayName) {
                    freshState[displayName].lo_prices.push(parseInt(result.low_price));
                    freshState[displayName].hi_prices.push(parseInt(result.high_price));
                }
            });

        setCabbageInfo({ commodity: "Chou", ...freshState["Chou"] });
        setSquashZuchInfo({ commodity: "Zucchini", ...freshState["Zucchini"] });
        setSquashYlwInfo({ commodity: "Courgette Jaune", ...freshState["Courgette Jaune"] });
        setPepperInfo({ commodity: "Poivron", ...freshState["Poivron"] });
        setBroccoliInfo({ commodity: "Brocoli", ...freshState["Brocoli"] });
        setCauliflowerInfo({ commodity: "Chou-fleur", ...freshState["Chou-fleur"] });
        setBrusselsInfo({ commodity: "Choux de Bruxelles", ...freshState["Choux de Bruxelles"] });
    }, [vegReports]);

    useEffect(() => {
        console.log(cabbageInfo);
        console.log(squashZuchInfo);
        console.log(squashYlwInfo);
        console.log(pepperInfo);
        console.log(broccoliInfo);
    }, [cabbageInfo, squashZuchInfo, squashYlwInfo, pepperInfo, broccoliInfo]);




    return (
        <section className="w-[min(100%,_40rem)] flex flex-col items-center px-[0.2rem] gap-[1rem]">

            {loading ? (
                <p>
                    Chargement...
                </p>
            ) : vegReports.length === 0 ||
                vegReports.every((report) => report.results.length === 0) ? (
                <p>Les rapports pour la date sélectionnée ne sont pas disponibles</p>
            ) : (
                <>
                    <p className=" relative w-[80%] text-center text-[1.2rem]"> *Les Prix montrés ci-dessous excluent les prix bio* </p>
                    <ul className="flex flex-col gap-[0.25rem] w-[min(100%,_40rem)]">
                        {[
                            cabbageInfo,
                            squashZuchInfo,
                            squashYlwInfo,
                            pepperInfo,
                            broccoliInfo,
                            cauliflowerInfo,
                            brusselsInfo,
                        ].map((veg) => {
                            const loAvg =
                                veg.lo_prices && veg.lo_prices.length > 0
                                    ? (veg.lo_prices.reduce((a, b) => a + b, 0) / veg.lo_prices.length).toFixed(2)
                                    : "N/A";
                            const hiAvg =
                                veg.hi_prices && veg.hi_prices.length > 0
                                    ? (veg.hi_prices.reduce((a, b) => a + b, 0) / veg.hi_prices.length).toFixed(2)
                                    : "N/A";

                            return (
                                <li
                                    key={veg.commodity}
                                    className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid"
                                >
                                    <h3 className="text-[1.5rem] font-bold text-center">{veg.commodity}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-center">
                                            Prix bas moyen: <br />
                                            $<span className="font-bold text-[1.2rem]">{loAvg}</span> usd
                                        </p>
                                        <p className="text-center">
                                            Prix haut moyen: <br />
                                            $<span className="font-bold text-[1.2rem]">{hiAvg}</span> usd
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>


                </>
            )}
        </section>
    );
}

export default Variete;